import {
  NotFoundError,
  UnauthorizedError,
  verifyResourcePassword,
} from "@/lib/authUtils";
import { prisma } from "@/lib/prisma";
import {
  ApplicantForProject,
  CreateProjectInput,
  GetProjectsQueryInput,
  projectPublicSelection,
  ProposerForProject,
  UpdateProjectInput,
} from "@/types/project";
import { PaginatedType, PasswordOmittedType } from "@/types/utils";
import { Prisma, Project } from "@prisma/client";
import bcrypt from "bcryptjs";

const SALT_ROUNDS = 10;
type PasswordOmittedProject = PasswordOmittedType<Project>;
type ProjectWithProposer = Project & {
  proposer: ProposerForProject;
};
type ProjectWithForeignKeys = Project & {
  proposer: ProposerForProject;
  applicants: ApplicantForProject[];
};

// 프로젝트 생성 (Proposer 포함 가능)
export async function createProject(
  data: CreateProjectInput
): Promise<ProjectWithProposer> {
  const {
    proposer: proposerInput,
    password: projectPlainTextPassword,
    ...projectDataRest
  } = data;

  const projectPasswordHash = await bcrypt.hash(
    projectPlainTextPassword,
    SALT_ROUNDS
  );

  let proposerCreatePayload;
  if (proposerInput) {
    const { password: proposerPlainTextPassword, ...proposerDataRest } =
      proposerInput;
    const proposerPasswordHash = await bcrypt.hash(
      proposerPlainTextPassword,
      SALT_ROUNDS
    );
    proposerCreatePayload = {
      ...proposerDataRest,
      passwordHash: proposerPasswordHash,
    };
  }

  const createdProject = await prisma.project.create({
    data: {
      ...projectDataRest,
      passwordHash: projectPasswordHash,
      proposer: proposerCreatePayload
        ? { create: proposerCreatePayload }
        : undefined,
    },
    select: projectPublicSelection, // passwordHash 제외 확인
  });
  return createdProject;
}

// 모든 프로젝트 조회 (페이지네이션, 필터링, 정렬)
export async function getAllProjects(
  query: GetProjectsQueryInput
): Promise<PaginatedType<PasswordOmittedProject>> {
  const {
    page,
    limit,
    sortBy,
    sortOrder,
    name,
    keyword,
    proposerType,
    searchTerm,
  } = query;
  const skip = (page - 1) * limit;
  const take = limit;

  const whereConditions: Prisma.ProjectWhereInput = {};
  const orderByConditions: Prisma.ProjectOrderByWithRelationInput = {};

  if (name) whereConditions.name = { contains: name, mode: "insensitive" };
  if (keyword) whereConditions.keywords = { has: keyword };
  if (proposerType) whereConditions.proposer = { type: proposerType };
  if (searchTerm) {
    whereConditions.OR = [
      { name: { contains: searchTerm, mode: "insensitive" } },
      { background: { contains: searchTerm, mode: "insensitive" } },
      { objective: { contains: searchTerm, mode: "insensitive" } },
      { keywords: { has: searchTerm } },
      { proposer: { name: { contains: searchTerm, mode: "insensitive" } } }, // 제안자 이름 검색 추가 가능
    ];
  }

  if (sortBy) {
    if (sortBy.includes(".")) {
      const [relation, field] = sortBy.split(".");
      orderByConditions[
        relation as keyof Prisma.ProjectOrderByWithRelationInput
      ] = { [field]: sortOrder };
    } else {
      orderByConditions[
        sortBy as keyof Prisma.ProjectOrderByWithRelationInput
      ] = sortOrder;
    }
  } else {
    orderByConditions.createdDatetime = "desc";
  }

  const [projects, totalItems] = await prisma.$transaction([
    prisma.project.findMany({
      where: whereConditions,
      select: projectPublicSelection, // passwordHash 제외 확인
      orderBy: orderByConditions,
      skip: skip,
      take: take,
    }),
    prisma.project.count({ where: whereConditions }),
  ]);

  return {
    data: projects,
    totalItems,
    totalPages: Math.ceil(totalItems / limit),
    currentPage: page,
    itemsPerPage: limit,
  };
}

// ID로 특정 프로젝트 조회 (조회수 증가)
export async function getProjectById(
  id: number
): Promise<ProjectWithForeignKeys | null> {
  const project = await prisma.project.findUnique({
    where: { id },
    select: projectPublicSelection, // passwordHash 제외 확인
  });

  if (project) {
    // 조회수 증가 - 에러 발생해도 무시하거나 로깅만 할 수 있음
    try {
      await prisma.project.update({
        where: { id },
        data: { viewCount: { increment: 1 } },
      });
      return {
        ...project,
        viewCount: project.viewCount + 1,
      };
    } catch (error) {
      console.error(`Failed to increment view count for project ${id}:`, error);
      // 에러 발생해도 조회된 프로젝트 정보는 반환
      return project;
    }
  }
  return null;
}

// 프로젝트 수정 (비밀번호 검증, Proposer 포함 가능)
export async function updateProject(
  id: number,
  data: UpdateProjectInput
): Promise<ProjectWithProposer> {
  const {
    currentPassword,
    password: newPlainTextPassword,
    proposer: proposerInput,
    ...projectDataRest
  } = data;

  const projectToUpdate = await prisma.project.findUnique({
    where: { id },
    include: { proposer: true }, // 기존 Proposer 정보 확인 및 비밀번호 변경 위해 include
  });

  if (!projectToUpdate) {
    throw new NotFoundError("Project not found.");
  }
  if (!projectToUpdate.passwordHash) {
    // 모든 리소스는 비밀번호 설정되어있다는 가정 하에 이 부분은 예외적 상황
    throw new Error("Project password integrity error.");
  }

  const isAuthorized = await verifyResourcePassword(
    currentPassword,
    projectToUpdate.passwordHash
  );
  if (!isAuthorized) {
    throw new UnauthorizedError("Incorrect current password for project.");
  }

  let projectPasswordHashToUpdate;
  if (newPlainTextPassword) {
    projectPasswordHashToUpdate = await bcrypt.hash(
      newPlainTextPassword,
      SALT_ROUNDS
    );
  }

  let proposerActions = {};
  if (proposerInput === null) {
    if (projectToUpdate.proposer) {
      // Proposer를 삭제하는 것은 Project 수정 API에서 직접 지원하기보다
      // 별도의 Proposer 삭제 API를 사용하는 것이 더 명확할 수 있음.
      // 여기서는 Project와의 연결만 끊는 것으로 가정 (스키마 구조상 Proposer 삭제 필요)
      // Prisma는 중첩 삭제를 이 방식으로 직접 지원하지 않으므로, 연결된 Proposer ID를 찾아 삭제 필요
      proposerActions = { delete: true }; // 이 방식은 Project 모델에 proposerId가 있을 때 유효함.
      // 현재 스키마에서는 Proposer.delete 필요. Project 업데이트로는 불가능.
      // 따라서 Proposer 연결 해제/변경은 Proposer 자체 수정/삭제 로직 따르도록 권장.
      // 여기서는 Project 필드 업데이트만 처리하고 Proposer 변경은 별도 API 사용 가정.
      // 만약 Proposer *내용*만 변경한다면 아래 upsert 로직 사용 가능.
      console.warn(
        "Detaching/Deleting Proposer via Project update is complex with current schema. Use Proposer API or adjust schema."
      );
    }
  } else if (proposerInput) {
    // Proposer 정보 업데이트 (upsert)
    const { password: newProposerPassword, ...proposerDataRest } =
      proposerInput;
    let proposerPasswordHashToUpdate;
    if (newProposerPassword) {
      proposerPasswordHashToUpdate = await bcrypt.hash(
        newProposerPassword,
        SALT_ROUNDS
      );
    }
    const currentProposerData = projectToUpdate.proposer || {};

    // Create payload는 모든 필수 필드를 포함해야 함
    const proposerCreatePayload = {
      type: proposerInput.type!, // Zod 스키마에서 required로 정의 가정
      name: proposerInput.name!,
      email: proposerInput.email!,
      major: proposerInput.major!,
      phone: proposerInput.phone!,
      introduction: proposerInput.introduction ?? "",
      passwordHash:
        proposerPasswordHashToUpdate || currentProposerData.passwordHash || "", // 생성 시에는 새 해시 또는 오류 필요
      // 스키마상 password는 필수이므로 해시는 항상 생성됨
    };

    // Update payload는 변경된 필드만 포함
    const proposerUpdatePayload = {
      ...proposerDataRest,
      ...(proposerPasswordHashToUpdate && {
        passwordHash: proposerPasswordHashToUpdate,
      }),
    };

    proposerActions = {
      upsert: {
        // Project 생성 시 Proposer가 없었다면 create 실행됨. create 시 필요한 모든 필드 전달.
        create: proposerCreatePayload,
        // Project 생성 시 Proposer가 있었다면 update 실행됨. 변경된 필드만 전달.
        update: proposerUpdatePayload,
      },
    };
  }

  const updatedProject = await prisma.project.update({
    where: { id },
    data: {
      ...projectDataRest,
      ...(projectPasswordHashToUpdate && {
        passwordHash: projectPasswordHashToUpdate,
      }),
      // Proposer 관련 작업: upsert만 가능 (삭제/연결해제는 별도 처리 권장)
      ...(proposerInput !== null &&
        proposerInput && { proposer: proposerActions }),
    },
    select: projectPublicSelection, // passwordHash 제외 확인
  });

  return updatedProject;
}

// 프로젝트 삭제 (비밀번호 검증, 관련 Applicant/Proposer 동시 삭제)
export async function deleteProject(
  id: number,
  currentPassword?: string
): Promise<void> {
  if (!currentPassword) {
    throw new UnauthorizedError(
      "Current password is required to delete this project."
    );
  }
  const projectToDelete = await prisma.project.findUnique({ where: { id } });
  if (!projectToDelete) {
    throw new NotFoundError("Project not found for deletion.");
  }
  if (!projectToDelete.passwordHash) {
    throw new Error("Project password integrity error.");
  }

  const isAuthorized = await verifyResourcePassword(
    currentPassword,
    projectToDelete.passwordHash
  );
  if (!isAuthorized) {
    throw new UnauthorizedError(
      "Incorrect current password for project deletion."
    );
  }

  // 관련 레코드(Applicant, Proposer) 삭제 후 프로젝트 삭제 (onDelete: Cascade 미설정 시)
  try {
    await prisma.$transaction([
      prisma.applicant.deleteMany({ where: { projectId: id } }),
      prisma.proposer.deleteMany({ where: { projectId: id } }), // Proposer도 projectId를 가지므로 삭제 가능
      prisma.project.delete({ where: { id } }),
    ]);
  } catch (error) {
    // 트랜잭션 롤백 시 에러 처리
    console.error("Error during project deletion transaction:", error);
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2025"
    ) {
      // 이미 삭제되었거나 존재하지 않는 경우
      throw new NotFoundError("Project not found during deletion attempt.");
    }
    throw new Error("Failed to delete project and associated data."); // 일반적인 실패 에러
  }
}
