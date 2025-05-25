import { MAX_APPLICANTS } from "@/constants";
import {
  MaxApplicantsError,
  NotFoundError,
  UnauthorizedError,
  verifyResourcePassword,
} from "@/lib/authUtils";
import { prisma } from "@/lib/prisma";
import {
  ApplicantInput,
  applicantPublicSelection,
  ApplicantUpdateInput,
} from "@/types/applicant";
import { projectPublicSelection } from "@/types/project";
import { PasswordOmittedType } from "@/types/utils";
import { Applicant } from "@prisma/client";
import bcrypt from "bcryptjs";

const SALT_ROUNDS = 10;
type PasswordOmittedApplicant = PasswordOmittedType<Applicant>;

// 지원자 생성 (비밀번호 해싱)
export async function createApplicant(
  projectId: number,
  data: ApplicantInput
): Promise<PasswordOmittedApplicant> {
  const { password: plainTextPassword, ...applicantData } = data;
  const passwordHash = await bcrypt.hash(plainTextPassword, SALT_ROUNDS);

  // 트랜잭션으로 지원자 생성 및 프로젝트 카운터 업데이트
  return await prisma.$transaction(async (tx) => {
    // 프로젝트 확인 로직
    const project = await tx.project.findUnique({
      where: { id: projectId },
      select: {
        ...projectPublicSelection,
        applicantCount: true,
      },
    });

    if (!project) {
      throw new NotFoundError(
        `Project with id ${projectId} not found to associate applicant.`
      );
    }

    if (project.applicantCount >= MAX_APPLICANTS) {
      throw new MaxApplicantsError(
        `Maximum number of applicants (${MAX_APPLICANTS}) reached for this project.`
      );
    }

    // 지원자 생성
    const createdApplicant = await tx.applicant.create({
      data: {
        ...applicantData,
        passwordHash,
        projectId,
        accepted: false, // 기본값은 false (미확정)
      },
      select: applicantPublicSelection,
    });

    // 프로젝트 카운터 업데이트
    await tx.project.update({
      where: { id: projectId },
      data: {
        applicantCount: { increment: 1 },
      },
    });

    return createdApplicant;
  });
}

// 특정 프로젝트의 모든 지원자 조회
export async function getApplicantsByProjectId(
  projectId: number
): Promise<PasswordOmittedApplicant[]> {
  const applicants = await prisma.applicant.findMany({
    where: { projectId },
    select: applicantPublicSelection, // passwordHash 제외 확인
    orderBy: { createdDatetime: "asc" },
  });
  return applicants;
}

// 특정 프로젝트의 특정 지원자 조회
export async function getApplicantByIdForProject(
  applicantId: number,
  projectId: number
): Promise<PasswordOmittedApplicant | null> {
  const applicant = await prisma.applicant.findUnique({
    where: {
      id: applicantId,
      projectId: projectId,
    },
    select: applicantPublicSelection, // passwordHash 제외 확인
  });
  return applicant;
}

// 지원자 정보 수정 (비밀번호 검증)
export async function updateApplicant(
  applicantId: number,
  projectId: number,
  data: ApplicantUpdateInput
): Promise<PasswordOmittedApplicant> {
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
  return updatedApplicant;
}

// 지원자 상태 업데이트 (수락/거부)
export async function updateApplicantStatus(
  applicantId: number,
  projectId: number,
  accepted: boolean,
  currentPassword: string
): Promise<PasswordOmittedApplicant> {
  return await prisma.$transaction(async (tx) => {
    // 지원자 조회 및 비밀번호 검증
    const applicant = await tx.applicant.findUnique({
      where: { id: applicantId, projectId },
      select: {
        ...applicantPublicSelection,
        passwordHash: true,
        accepted: true,
      },
    });

    if (!applicant) {
      throw new NotFoundError("Applicant not found for this project.");
    }

    // 비밀번호 검증 로직
    const isAuthorized = await verifyResourcePassword(
      currentPassword,
      applicant.passwordHash
    );
    if (!isAuthorized) {
      throw new UnauthorizedError("Incorrect password for applicant.");
    }

    // 상태가 변경되는 경우에만 카운터 업데이트
    const statusChanged = applicant.accepted !== accepted;

    // 지원자 상태 업데이트
    const updatedApplicant = await tx.applicant.update({
      where: { id: applicantId },
      data: { accepted },
      select: applicantPublicSelection,
    });

    // 프로젝트 카운터 업데이트 (상태가 변경된 경우에만)
    if (statusChanged) {
      await tx.project.update({
        where: { id: projectId },
        data: {
          acceptedApplicantCount: {
            [accepted ? "increment" : "decrement"]: 1,
          },
        },
      });
    }

    return updatedApplicant;
  });
}

// 지원자 삭제 (비밀번호 검증)
export async function deleteApplicant(
  applicantId: number,
  projectId: number,
  currentPassword?: string
): Promise<PasswordOmittedApplicant> {
  return await prisma.$transaction(async (tx) => {
    // 지원자 조회
    const applicantToDelete = await tx.applicant.findUnique({
      where: { id: applicantId, projectId },
      select: {
        ...applicantPublicSelection,
        passwordHash: true,
        accepted: true,
      },
    });

    if (!applicantToDelete) {
      throw new NotFoundError(
        "Applicant not found for deletion in this project."
      );
    }

    // 비밀번호 검증 로직
    if (!currentPassword) {
      throw new UnauthorizedError(
        "Current password is required to delete this applicant."
      );
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

    // 지원자 삭제
    const deletedApplicant = await tx.applicant.delete({
      where: { id: applicantId },
      select: applicantPublicSelection,
    });

    // 프로젝트 카운터 업데이트
    await tx.project.update({
      where: { id: projectId },
      data: {
        applicantCount: { decrement: 1 },
        // 수락된 지원자인 경우에만 수락 카운트도 감소
        ...(applicantToDelete.accepted && {
          acceptedApplicantCount: { decrement: 1 },
        }),
      },
    });

    return deletedApplicant;
  });
}
