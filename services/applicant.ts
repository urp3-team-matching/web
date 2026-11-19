import { waitUntil } from "@vercel/functions"; // Vercel 백그라운드 작업 유지를 위해 추가됨

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
  ApplicantAdmin,
  applicantAdminSelection,
  ApplicantInput,
  ApplicantPublic,
  applicantPublicSelection,
  ApplicantUpdateInput,
} from "@/types/applicant";
import { ApplicantForProject, projectPublicSelection } from "@/types/project";

export async function applyToProject(
  projectId: number,
  data: ApplicantInput
): Promise<ApplicantPublic> {
  const project = await prisma.project.findUnique({
    where: { id: projectId },
    select: projectPublicSelection,
  });
  if (!project) {
    throw new NotFoundError(
      `Project with id ${projectId} not found to associate applicant.`
    );
  }

  // 승인 인원이 정원(MAX_APPLICANTS)에 도달했더라도 추가 신청은 받는다.
  // 신규 신청은 항상 PENDING으로 생성되어 팀 구성에 바로 반영되지 않으며,
  // 정원/전공 제한은 승인 단계(acceptApplicant)에서 검사한다.
  // (모집 자체를 막으려면 작성자가 프로젝트를 '마감(CLOSED)' 처리하면 된다.)

  const createdApplicant = await prisma.applicant.create({
    data: {
      ...data,
      projectId,
      status: "PENDING", // 신규 지원자는 항상 대기 상태로 생성 (자가 승인 방지)
    },
    select: applicantPublicSelection,
  });

  const applicantAppliedEmail = emailTemplates.applicantApplied(
    project,
    createdApplicant.name
  );
  
  // 비동기 이메일 발송 작업을 waitUntil로 감싸서 Vercel 서버 종료 방지
  const emailPromise = sendEmail({
    to: project.email,
    subject: applicantAppliedEmail.subject,
    html: applicantAppliedEmail.html,
  }).catch((error) => {
    console.error(`[이메일 발송 실패] 지원자 알림 - 프로젝트 ID: ${projectId}`, error);
  });
  
  waitUntil(emailPromise);

  return createdApplicant;
}

// isOwner=true(verifyProjectPermission 통과)일 때만 PII 포함된 admin select.
// 미인증/비-owner 호출은 PII 제외된 public select.
export async function getApplicantsByProjectId(
  projectId: number,
  isOwner: boolean = false
): Promise<ApplicantPublic[] | ApplicantAdmin[]> {
  if (isOwner) {
    return await prisma.applicant.findMany({
      where: { projectId },
      select: applicantAdminSelection,
      orderBy: { createdDatetime: "asc" },
    });
  }
  return await prisma.applicant.findMany({
    where: { projectId },
    select: applicantPublicSelection,
    orderBy: { createdDatetime: "asc" },
  });
}

export async function getApplicantByIdForProject(
  applicantId: number,
  projectId: number,
  isOwner: boolean = false
): Promise<ApplicantPublic | ApplicantAdmin | null> {
  if (isOwner) {
    return await prisma.applicant.findUnique({
      where: { id: applicantId, projectId },
      select: applicantAdminSelection,
    });
  }
  return await prisma.applicant.findUnique({
    where: { id: applicantId, projectId },
    select: applicantPublicSelection,
  });
}

export async function updateApplicant(
  applicantId: number,
  projectId: number,
  data: ApplicantUpdateInput
): Promise<ApplicantAdmin> {
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
    select: applicantAdminSelection,
  });
  return updatedApplicant;
}

export async function deleteApplicant(
  applicantId: number,
  projectId: number
): Promise<ApplicantAdmin> {
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
    select: applicantAdminSelection,
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
    select: applicantAdminSelection,
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

  // 동시성 문제를 고려한 트랜잭션 최적화
  const [currentApplicantsCount, currentApplicantMajorsCount] = await prisma.$transaction([
    prisma.applicant.count({ where: { projectId, status: "APPROVED" } }),
    prisma.applicant.count({ where: { projectId, status: "APPROVED", major: applicant.major } })
  ]);

  // 지원자 수가 최대 지원자 수를 초과하는 경우
  if (currentApplicantsCount >= MAX_APPLICANTS) {
    throw new MaxApplicantsError();
  }

  // 전공 수가 최대 전공 수를 초과하는 경우
  if (currentApplicantMajorsCount >= MAX_APPLICANT_MAJOR_COUNT) {
    throw new MaxApplicantsError();
  }

  // 지원자 승인
  const updatedApplicant = await prisma.applicant.update({
    where: { id: applicantId },
    data: { status: "APPROVED" },
    select: applicantAdminSelection,
  });

  const applicantStatusChangedEmail = emailTemplates.applicantStatusChanged(
    project,
    updatedApplicant.name,
    applicant.status,
    updatedApplicant.status
  );
  
  // 비동기 이메일 발송 작업을 waitUntil로 감싸서 Vercel 서버 종료 방지
  const emailPromise = sendEmail({
    to: applicant.email,
    subject: applicantStatusChangedEmail.subject,
    html: applicantStatusChangedEmail.html,
  }).catch((error) => {
    console.error(`[이메일 발송 실패] 승인 알림 - 지원자 ID: ${applicantId}`, error);
  });
  
  waitUntil(emailPromise);

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
    select: applicantAdminSelection,
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
    select: applicantAdminSelection,
  });

  const applicantStatusChangedEmail = emailTemplates.applicantStatusChanged(
    project,
    updatedApplicant.name,
    applicant.status,
    updatedApplicant.status
  );
  
  // 비동기 이메일 발송 작업을 waitUntil로 감싸서 Vercel 서버 종료 방지
  const emailPromise = sendEmail({
    to: applicant.email,
    subject: applicantStatusChangedEmail.subject,
    html: applicantStatusChangedEmail.html,
  }).catch((error) => {
    console.error(`[이메일 발송 실패] 거절 알림 - 지원자 ID: ${applicantId}`, error);
  });
  
  waitUntil(emailPromise);

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
    select: applicantAdminSelection,
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
    select: applicantAdminSelection,
  });

  const applicantStatusChangedEmail = emailTemplates.applicantStatusChanged(
    project,
    updatedApplicant.name,
    applicant.status,
    updatedApplicant.status
  );
  
  // 비동기 이메일 발송 작업을 waitUntil로 감싸서 Vercel 서버 종료 방지
  const emailPromise = sendEmail({
    to: applicant.email,
    subject: applicantStatusChangedEmail.subject,
    html: applicantStatusChangedEmail.html,
  }).catch((error) => {
    console.error(`[이메일 발송 실패] 대기 알림 - 지원자 ID: ${applicantId}`, error);
  });
  
  waitUntil(emailPromise);

  return updatedApplicant;
}
