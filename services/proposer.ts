import {
  NotFoundError,
  UnauthorizedError,
  verifyResourcePassword,
} from "@/lib/authUtils";
import { prisma } from "@/lib/prisma";
import {
  CreateProposerInput,
  GetProposersQueryInput,
  proposerPublicSelection, // types에서 import
  UpdateProposerInput,
} from "@/types/proposer";
import { PaginatedType } from "@/types/utils";
import { Prisma, Proposer } from "@prisma/client";
import bcrypt from "bcryptjs";

const SALT_ROUNDS = 10;

// 모든 제안자 조회 (페이지네이션, 필터링)
export async function getAllProposers(
  query: GetProposersQueryInput
): Promise<PaginatedType<Proposer>> {
  const { page, limit, type, name, email, major } = query;
  const skip = (page - 1) * limit;
  const take = limit;

  const whereConditions: Prisma.ProposerWhereInput = {};
  if (type) whereConditions.type = type;
  if (name) whereConditions.name = { contains: name, mode: "insensitive" };
  if (email) whereConditions.email = { equals: email, mode: "insensitive" };
  if (major) whereConditions.major = { contains: major, mode: "insensitive" };

  const [proposers, totalItems] = await prisma.$transaction([
    prisma.proposer.findMany({
      where: whereConditions,
      select: proposerPublicSelection, // passwordHash 제외 확인
      orderBy: { name: "asc" },
      skip,
      take,
    }),
    prisma.proposer.count({ where: whereConditions }),
  ]);

  return {
    data: proposers, // 타입 캐스팅 주의
    totalItems,
    totalPages: Math.ceil(totalItems / limit),
    currentPage: page,
    itemsPerPage: limit,
  };
}

// ID로 특정 제안자 조회
export async function getProposerById(id: number): Promise<Proposer | null> {
  const proposer = await prisma.proposer.findUnique({
    where: { id },
    select: proposerPublicSelection, // passwordHash 제외 확인
  });
  return proposer;
}

// 독립적인 제안자 수정 (비밀번호 검증) - Project 수정과 분리된 경우
export async function updateProposer(
  id: number,
  data: UpdateProposerInput
): Promise<Proposer> {
  const {
    currentPassword,
    password: newPlainTextPassword,
    ...proposerData
  } = data;

  const proposerToUpdate = await prisma.proposer.findUnique({ where: { id } });
  if (!proposerToUpdate) throw new NotFoundError("Proposer not found");
  if (!proposerToUpdate.passwordHash)
    throw new Error("Proposer password integrity error.");

  const isAuthorized = await verifyResourcePassword(
    currentPassword,
    proposerToUpdate.passwordHash
  );
  if (!isAuthorized)
    throw new UnauthorizedError("Incorrect current password for proposer.");

  let passwordHashToUpdate;
  if (newPlainTextPassword) {
    passwordHashToUpdate = await bcrypt.hash(newPlainTextPassword, SALT_ROUNDS);
  }

  const updatedProposer = await prisma.proposer.update({
    where: { id },
    data: {
      ...proposerData,
      ...(passwordHashToUpdate && { passwordHash: passwordHashToUpdate }),
    },
    select: proposerPublicSelection, // passwordHash 제외 확인
  });
  return updatedProposer;
}

// 제안자 삭제 (비밀번호 검증)
export async function deleteProposer(
  id: number,
  currentPassword?: string
): Promise<Proposer> {
  if (!currentPassword) {
    throw new UnauthorizedError(
      "Current password is required to delete this proposer."
    );
  }
  const proposerToDelete = await prisma.proposer.findUnique({ where: { id } });
  if (!proposerToDelete) {
    throw new NotFoundError("Proposer not found for deletion.");
  }
  if (!proposerToDelete.passwordHash) {
    throw new Error("Proposer password integrity error.");
  }

  const isAuthorized = await verifyResourcePassword(
    currentPassword,
    proposerToDelete.passwordHash
  );
  if (!isAuthorized) {
    throw new UnauthorizedError(
      "Incorrect current password for proposer deletion."
    );
  }

  // Proposer 삭제 시 연관된 Project의 proposer 필드는 자동으로 null이 됨 (Prisma 관계 처리)
  // 만약 Project 삭제 시 Proposer를 지우는 Cascade 규칙이 있었다면 여기서 고려 필요
  const deletedProposer = await prisma.proposer.delete({
    where: { id },
    select: proposerPublicSelection, // passwordHash 제외 확인
  });
  return deletedProposer;
}

// 독립적인 제안자 생성 (일반적이지 않음, Project 생성 시 함께 만드는 것이 일반적)
export async function createStandaloneProposer(
  data: CreateProposerInput
): Promise<Proposer> {
  const { password: plainTextPassword, projectId, ...proposerData } = data;
  const passwordHash = await bcrypt.hash(plainTextPassword, SALT_ROUNDS);

  // 연결할 프로젝트가 존재하는지 확인하는 로직 추가 가능
  const projectExists = await prisma.project.findUnique({
    where: { id: projectId },
  });
  if (!projectExists) {
    throw new NotFoundError(
      `Project with id ${projectId} not found to associate proposer.`
    );
  }

  // Proposer는 unique projectId를 가져야 함. 이미 해당 projectId로 Proposer가 있는지 확인 필요.
  const existingProposer = await prisma.proposer.findUnique({
    where: { id: projectId },
  });
  if (existingProposer) {
    throw new Error(
      `Proposer already exists for project id ${projectId}. Cannot create another.`
    );
  }

  const createdProposer = await prisma.proposer.create({
    data: {
      ...proposerData,
      passwordHash,
      id: projectId, // 또는 project: { connect: { id: projectId } }
    },
    select: proposerPublicSelection,
  });
  return createdProposer;
}
