import {
  NotFoundError,
  UnauthorizedError,
  verifyResourcePassword,
} from "@/lib/authUtils";
import { prisma } from "@/lib/prisma";
import {
  ApplicantForProject,
  GetProjectsQueryInput,
  ProjectInput,
  projectPublicSelection,
  ProjectUpdateInput,
} from "@/types/project";
import { PaginatedType, PasswordOmittedType } from "@/types/utils";
import { Prisma, Project } from "@prisma/client";
import bcrypt from "bcryptjs";

const SALT_ROUNDS = 10;
type PasswordOmittedProject = PasswordOmittedType<Project>;
type ProjectWithForeignKeys = Project & {
  applicants: ApplicantForProject[];
};

export async function createProject(data: ProjectInput): Promise<Project> {
  const { password: projectPlainTextPassword, ...projectDataRest } = data;

  const projectPasswordHash = await bcrypt.hash(
    projectPlainTextPassword,
    SALT_ROUNDS
  );

  const createdProject = await prisma.project.create({
    data: {
      ...projectDataRest,
      passwordHash: projectPasswordHash,
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
  if (proposerType) whereConditions.proposerType = proposerType;
  if (searchTerm) {
    whereConditions.OR = [
      { name: { contains: searchTerm, mode: "insensitive" } },
      { background: { contains: searchTerm, mode: "insensitive" } },
      { objective: { contains: searchTerm, mode: "insensitive" } },
      { keywords: { has: searchTerm } },
    ];
  }

  if (sortBy) {
    if (sortBy.includes(".")) {
      const [relation, field] = sortBy.split(".");

      // 관계형 필드 정렬을 위한 적절한 객체 구조 생성
      if (relation === "applicants") {
        orderByConditions.applicants = { [field]: sortOrder };
      } else {
        // 다른 관계가 있다면 여기에 추가
        console.warn(`Unsupported relation for sorting: ${relation}`);
        // 기본값 설정
        orderByConditions.createdDatetime = "desc";
      }
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

// 프로젝트 수정 (비밀번호 검증)
export async function updateProject(
  id: number,
  data: ProjectUpdateInput
): Promise<Project> {
  const {
    currentPassword,
    password: newPlainTextPassword,
    ...projectDataRest
  } = data;

  const projectToUpdate = await prisma.project.findUnique({
    where: { id },
    select: {
      ...projectPublicSelection,
      passwordHash: true, // 비밀번호 해시 포함
    },
  });

  if (!projectToUpdate) {
    throw new NotFoundError("Project not found.");
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

  const updatedProject = await prisma.project.update({
    where: { id },
    data: {
      ...projectDataRest,
      ...(projectPasswordHashToUpdate && {
        passwordHash: projectPasswordHashToUpdate,
      }),
    },
    select: projectPublicSelection, // passwordHash 제외 확인
  });

  return updatedProject;
}

// 프로젝트 삭제 (비밀번호 검증, 관련 Applicant 동시 삭제)
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

  // 관련 레코드(Applicant) 삭제 후 프로젝트 삭제 (onDelete: Cascade 미설정 시)
  try {
    await prisma.$transaction([
      prisma.applicant.deleteMany({ where: { projectId: id } }),
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
