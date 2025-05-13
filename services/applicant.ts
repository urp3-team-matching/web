import {
  NotFoundError,
  UnauthorizedError,
  verifyResourcePassword,
} from "@/lib/authUtils";
import { prisma } from "@/lib/prisma";
import {
  applicantPublicSelection,
  CreateApplicantInput, // types에서 import
  PublicApplicant,
  UpdateApplicantInput,
} from "@/types/applicant";
import bcrypt from "bcryptjs";

const SALT_ROUNDS = 10;

// 지원자 생성 (비밀번호 해싱)
export async function createApplicant(
  projectId: number,
  data: CreateApplicantInput
): Promise<PublicApplicant> {
  const { password: plainTextPassword, ...applicantData } = data;
  const passwordHash = await bcrypt.hash(plainTextPassword, SALT_ROUNDS);

  // 연결할 프로젝트 존재 확인 (선택적)
  const projectExists = await prisma.project.findUnique({
    where: { id: projectId },
  });
  if (!projectExists) {
    throw new NotFoundError(
      `Project with id ${projectId} not found to associate applicant.`
    );
  }

  const createdApplicant = await prisma.applicant.create({
    data: {
      ...applicantData,
      passwordHash,
      projectId,
    },
    select: applicantPublicSelection, // passwordHash 제외 확인
  });
  return createdApplicant as PublicApplicant;
}

// 특정 프로젝트의 모든 지원자 조회
export async function getApplicantsByProjectId(
  projectId: number
): Promise<PublicApplicant[]> {
  const applicants = await prisma.applicant.findMany({
    where: { projectId },
    select: applicantPublicSelection, // passwordHash 제외 확인
    orderBy: { createdDatetime: "asc" },
  });
  return applicants as PublicApplicant[];
}

// 특정 프로젝트의 특정 지원자 조회
export async function getApplicantByIdForProject(
  applicantId: number,
  projectId: number
): Promise<PublicApplicant | null> {
  const applicant = await prisma.applicant.findUnique({
    where: {
      id: applicantId,
      projectId: projectId,
    },
    select: applicantPublicSelection, // passwordHash 제외 확인
  });
  return applicant as PublicApplicant | null;
}

// 지원자 정보 수정 (비밀번호 검증)
export async function updateApplicant(
  applicantId: number,
  projectId: number,
  data: UpdateApplicantInput
): Promise<PublicApplicant> {
  const {
    currentPassword,
    password: newPlainTextPassword,
    ...applicantData
  } = data;

  const applicantToUpdate = await prisma.applicant.findUnique({
    where: { id: applicantId, projectId },
  });

  if (!applicantToUpdate) {
    throw new NotFoundError("Applicant not found for this project.");
  }
  if (!applicantToUpdate.passwordHash) {
    throw new Error("Applicant password integrity error.");
  }

  const isAuthorized = await verifyResourcePassword(
    currentPassword,
    applicantToUpdate.passwordHash
  );
  if (!isAuthorized) {
    throw new UnauthorizedError("Incorrect current password for applicant.");
  }

  let passwordHashToUpdate;
  if (newPlainTextPassword) {
    passwordHashToUpdate = await bcrypt.hash(newPlainTextPassword, SALT_ROUNDS);
  }

  const updatedApplicant = await prisma.applicant.update({
    where: {
      id: applicantId,
      // projectId는 where 조건으로 이미 확인됨
    },
    data: {
      ...applicantData,
      ...(passwordHashToUpdate && { passwordHash: passwordHashToUpdate }),
    },
    select: applicantPublicSelection, // passwordHash 제외 확인
  });
  return updatedApplicant as PublicApplicant;
}

// 지원자 삭제 (비밀번호 검증)
export async function deleteApplicant(
  applicantId: number,
  projectId: number,
  currentPassword?: string
): Promise<PublicApplicant> {
  if (!currentPassword) {
    throw new UnauthorizedError(
      "Current password is required to delete this applicant."
    );
  }
  const applicantToDelete = await prisma.applicant.findUnique({
    where: { id: applicantId, projectId },
  });

  if (!applicantToDelete) {
    throw new NotFoundError(
      "Applicant not found for deletion in this project."
    );
  }
  if (!applicantToDelete.passwordHash) {
    throw new Error("Applicant password integrity error.");
  }

  const isAuthorized = await verifyResourcePassword(
    currentPassword,
    applicantToDelete.passwordHash
  );
  if (!isAuthorized) {
    throw new UnauthorizedError(
      "Incorrect current password for applicant deletion."
    );
  }

  const deletedApplicant = await prisma.applicant.delete({
    where: {
      id: applicantId,
    },
    select: applicantPublicSelection, // passwordHash 제외 확인
  });
  return deletedApplicant as PublicApplicant;
}
