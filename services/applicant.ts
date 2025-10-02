import { MAX_APPLICANT_MAJOR_COUNT, MAX_APPLICANTS } from "@/constants";
import sendEmail from "@/lib/email";
import emailTemplates from "@/lib/email/templates";
import {
  BadRequestError,
  MaxApplicantsError,
  NotFoundError,
} from "@/lib/errors";
import { prisma } from "@/lib/prisma";
import {
  ApplicantInput,
  applicantPublicSelection,
  ApplicantUpdateInput,
} from "@/types/applicant";
import { ApplicantForProject, projectPublicSelection } from "@/types/project";
import { Applicant } from "@prisma/client";

export async function applyToProject(
  projectId: number,
  data: ApplicantInput
): Promise<Applicant> {
  const project = await prisma.project.findUnique({
    where: { id: projectId },
    select: projectPublicSelection,
  });
  if (!project) {
    throw new NotFoundError(
      `Project with id ${projectId} not found to associate applicant.`
    );
  }

  if (
    project.applicants.filter((applicant) => applicant.status === "APPROVED")
      .length >= MAX_APPLICANTS
  ) {
    throw new MaxApplicantsError(
      `Maximum number of applicants (${MAX_APPLICANTS}) reached for this project.`
    );
  }

  const createdApplicant = await prisma.applicant.create({
    data: {
      ...data,
      projectId,
    },
    select: applicantPublicSelection,
  });

  const applicantAppliedEmail = emailTemplates.applicantApplied(
    project,
    createdApplicant.name
  );
  sendEmail({
    to: project.email,
    subject: applicantAppliedEmail.subject,
    html: applicantAppliedEmail.html,
  });
  return createdApplicant;
}

export async function getApplicantsByProjectId(
  projectId: number
): Promise<Applicant[]> {
  const applicants = await prisma.applicant.findMany({
    where: { projectId },
    select: applicantPublicSelection,
    orderBy: { createdDatetime: "asc" },
  });
  return applicants;
}

export async function getApplicantByIdForProject(
  applicantId: number,
  projectId: number
): Promise<Applicant | null> {
  const applicant = await prisma.applicant.findUnique({
    where: {
      id: applicantId,
      projectId: projectId,
    },
    select: applicantPublicSelection,
  });
  return applicant;
}

export async function updateApplicant(
  applicantId: number,
  projectId: number,
  data: ApplicantUpdateInput
): Promise<Applicant> {
  const applicantToUpdate = await prisma.applicant.findUnique({
    where: { id: applicantId, projectId },
  });

  if (!applicantToUpdate) {
    throw new NotFoundError("Applicant not found for this project.");
  }

  const updatedApplicant = await prisma.applicant.update({
    where: {
      id: applicantId,
      // projectId는 where 조건으로 이미 확인됨
    },
    data,
    select: applicantPublicSelection,
  });
  return updatedApplicant;
}

export async function deleteApplicant(
  applicantId: number,
  projectId: number
): Promise<Applicant> {
  const applicantToDelete = await prisma.applicant.findUnique({
    where: { id: applicantId, projectId },
  });

  if (!applicantToDelete) {
    throw new NotFoundError(
      "Applicant not found for deletion in this project."
    );
  }

  const deletedApplicant = await prisma.applicant.delete({
    where: {
      id: applicantId,
    },
    select: applicantPublicSelection,
  });
  return deletedApplicant;
}

export async function acceptApplicant(
  projectId: number,
  applicantId: number
): Promise<ApplicantForProject> {
  const project = await prisma.project.findUnique({
    where: { id: projectId },
    select: projectPublicSelection,
  });
  if (!project) {
    throw new NotFoundError(`Project with id ${projectId} not found.`);
  }

  const applicant = await prisma.applicant.findUnique({
    where: { id: applicantId },
    select: applicantPublicSelection,
  });

  if (!applicant || applicant.projectId !== projectId) {
    throw new NotFoundError("Applicant not found for this project.");
  }

  // 지원자 상태가 이미 승인된 경우
  if (applicant.status === "APPROVED") {
    throw new BadRequestError("Applicant is already approved.");
  }

  // 지원자 상태가 거절된 경우
  if (applicant.status === "REJECTED") {
    throw new BadRequestError("Applicant is already rejected.");
  }

  // 지원자 수가 최대 지원자 수를 초과하는 경우
  const currentApplicantsCount = await prisma.applicant.count({
    where: { projectId, status: "APPROVED" },
  });
  if (currentApplicantsCount >= MAX_APPLICANTS) {
    throw new MaxApplicantsError();
  }

  // 전공 수가 최대 전공 수를 초과하는 경우
  const currentApplicantMajorsCount = await prisma.applicant.count({
    where: { projectId, status: "APPROVED", major: applicant.major },
  });
  if (currentApplicantMajorsCount >= MAX_APPLICANT_MAJOR_COUNT) {
    throw new MaxApplicantsError();
  }

  // 지원자 승인
  const updatedApplicant = await prisma.applicant.update({
    where: { id: applicantId },
    data: { status: "APPROVED" },
    select: applicantPublicSelection,
  });

  const applicantStatusChangedEmail = emailTemplates.applicantStatusChanged(
    project,
    updatedApplicant.name,
    applicant.status,
    updatedApplicant.status
  );
  sendEmail({
    to: applicant.email,
    subject: applicantStatusChangedEmail.subject,
    html: applicantStatusChangedEmail.html,
  });
  return updatedApplicant;
}

// 지원자 거절
export async function rejectApplicant(
  projectId: number,
  applicantId: number
): Promise<ApplicantForProject> {
  const project = await prisma.project.findUnique({
    where: { id: projectId },
    select: projectPublicSelection,
  });
  if (!project) {
    throw new NotFoundError(`Project with id ${projectId} not found.`);
  }

  const applicant = await prisma.applicant.findUnique({
    where: { id: applicantId },
    select: applicantPublicSelection,
  });

  if (!applicant || applicant.projectId !== projectId) {
    throw new NotFoundError("Applicant not found for this project.");
  }

  // 지원자 상태가 이미 거절된 경우
  if (applicant.status === "REJECTED") {
    throw new BadRequestError("Applicant is already rejected.");
  }

  // 지원자 거절
  const updatedApplicant = await prisma.applicant.update({
    where: { id: applicantId },
    data: { status: "REJECTED" },
    select: applicantPublicSelection,
  });

  const applicantStatusChangedEmail = emailTemplates.applicantStatusChanged(
    project,
    updatedApplicant.name,
    applicant.status,
    updatedApplicant.status
  );
  sendEmail({
    to: applicant.email,
    subject: applicantStatusChangedEmail.subject,
    html: applicantStatusChangedEmail.html,
  });
  return updatedApplicant;
}

// 지원자 대기 상태로 변경
export async function pendingApplicant(
  projectId: number,
  applicantId: number
): Promise<ApplicantForProject> {
  const project = await prisma.project.findUnique({
    where: { id: projectId },
    select: projectPublicSelection,
  });
  if (!project) {
    throw new NotFoundError(`Project with id ${projectId} not found.`);
  }

  const applicant = await prisma.applicant.findUnique({
    where: { id: applicantId },
    select: applicantPublicSelection,
  });

  if (!applicant || applicant.projectId !== projectId) {
    throw new NotFoundError("Applicant not found for this project.");
  }

  // 지원자 상태가 이미 대기 중인 경우
  if (applicant.status === "PENDING") {
    throw new BadRequestError("Applicant is already pending.");
  }

  // 지원자 대기 중으로 변경
  const updatedApplicant = await prisma.applicant.update({
    where: { id: applicantId },
    data: { status: "PENDING" },
    select: applicantPublicSelection,
  });

  const applicantStatusChangedEmail = emailTemplates.applicantStatusChanged(
    project,
    updatedApplicant.name,
    applicant.status,
    updatedApplicant.status
  );
  sendEmail({
    to: applicant.email,
    subject: applicantStatusChangedEmail.subject,
    html: applicantStatusChangedEmail.html,
  });
  return updatedApplicant;
}
