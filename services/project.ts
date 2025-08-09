import {
  BadRequestError,
  NotFoundError,
  UnauthorizedError,
  verifyResourcePassword,
} from "@/lib/authUtils";
import sendEmail from "@/lib/email";
import emailTemplates from "@/lib/email/templates";
import { prisma } from "@/lib/prisma";
import {
  ApplicantForProject,
  GetProjectsQueryInput,
  ProjectInput,
  projectPublicSelection,
  ProjectUpdateInput,
  Semester,
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

  if (data.proposerType === "STUDENT") {
    // 학생이 제안하는 경우 자동으로 해당 학생을 지원자로도 등록
    if (!data.proposerMajor) {
      throw new BadRequestError(
        "Proposer major is required when proposer type is STUDENT."
      );
    }
    const project = await prisma.project.create({
      data: {
        ...projectDataRest,
        passwordHash: projectPasswordHash,
        applicants: {
          create: {
            name: data.proposerName,
            email: data.email || "", // 본인 이메일은 저장할 필요 없음
            major: data.proposerMajor,
            introduction: "",
            status: "APPROVED",
          },
        },
      },
      select: projectPublicSelection, // passwordHash 제외 확인
    });

    const newProjectCreatedEmail = emailTemplates.newProjectCreated(project);
    sendEmail({
      to: process.env.EMAIL_SERVER_USER,
      subject: newProjectCreatedEmail.subject,
      html: newProjectCreatedEmail.html,
    });
    return project;
  } else {
    const project = await prisma.project.create({
      data: {
        ...projectDataRest,
        passwordHash: projectPasswordHash,
      },
      select: projectPublicSelection, // passwordHash 제외 확인
    });
    if (data.proposerType === "HOST") {
      return project;
    }

    const newProjectCreatedEmail = emailTemplates.newProjectCreated(project);
    sendEmail({
      to: process.env.EMAIL_SERVER_USER,
      subject: newProjectCreatedEmail.subject,
      html: newProjectCreatedEmail.html,
    });
    return project;
  }
}

// 모든 프로젝트 조회 (페이지네이션, 필터링, 정렬)
export async function getAllProjects(
  query: GetProjectsQueryInput
): Promise<PaginatedType<PasswordOmittedProject>> {
  const {
    page = 1, // 기본값 설정
    limit = 10, // 기본값 설정
    sortBy = "createdDatetime",
    sortOrder = "desc",
    name,
    keyword,
    proposerType,
    searchTerm,
    status,
    year,
    semester,
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

  const inputYearOrCurrentYear = year ?? new Date().getFullYear();
  console.log(inputYearOrCurrentYear, semester);

  if (inputYearOrCurrentYear) {
    let startDate: Date;
    let endDate: Date;

    if (semester) {
      // 1학기: 3월 1일 ~ 8월 31일
      // 2학기: 9월 1일 ~ 다음 해 2월 28/29일
      if (semester === Semester.FIRST) {
        startDate = new Date(inputYearOrCurrentYear, 2, 1); // 3월 1일
        endDate = new Date(inputYearOrCurrentYear, 7, 31, 23, 59, 59, 999); // 8월 31일
      } else {
        startDate = new Date(inputYearOrCurrentYear, 8, 1); // 9월 1일
        endDate = new Date(inputYearOrCurrentYear + 1, 2, 28, 23, 59, 59, 999); // 2월 28일
      }
    } else {
      // semester가 없으면 해당 연도 전체
      startDate = new Date(inputYearOrCurrentYear, 0, 1); // 1월 1일
      endDate = new Date(inputYearOrCurrentYear + 1, 2, 28, 23, 59, 59, 999); // 2월 28일
    }

    whereConditions.createdDatetime = {
      gte: startDate,
      lte: endDate,
    };
  }

  // 먼저 총 항목 수를 계산하기 위해 카운트 쿼리 실행
  const totalCount = await prisma.project.count({
    where: whereConditions,
  });

  // 그 다음 페이지네이션된 데이터 조회
  const projectsFromDb = await prisma.project.findMany({
    where: whereConditions,
    select: projectPublicSelection, // passwordHash 제외 확인
    orderBy: orderByConditions,
    skip: skip,
    take: take,
  });

  let filteredProjects: PasswordOmittedProject[] =
    projectsFromDb as PasswordOmittedProject[];

  // recruiting 필터링이 있는 경우, 전체 데이터를 대상으로 다시 계산 필요
  let finalTotalCount = totalCount;

  if (status) {
    // 이 경우에는 모든 프로젝트를 가져와서 applicants 수로 필터링해야 함
    const allProjects = await prisma.project.findMany({
      where: whereConditions,
      select: projectPublicSelection,
    });

    // 필터링 로직 적용
    const filteredAllProjects = allProjects.filter((project) => {
      return project.status === status;
    });

    // 총 항목 수 업데이트
    finalTotalCount = filteredAllProjects.length;

    // 현재 페이지의 데이터만 추출 (메모리에서 페이지네이션)
    filteredProjects = filteredAllProjects.slice(skip, skip + take);
  }

  return {
    data: filteredProjects,
    totalItems: finalTotalCount, // 전체 항목 수 반영
    totalPages: Math.ceil(finalTotalCount / limit), // 전체 항목 수 기준으로 계산
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
  const projectToDelete = await prisma.project.findUnique({
    where: { id },
    select: projectPublicSelection,
  });
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
    const deletedProject = await prisma.$transaction([
      prisma.applicant.deleteMany({ where: { projectId: id } }),
      prisma.project.delete({ where: { id } }),
    ]);

    const projectStatusChangedEmail = emailTemplates.projectStatusChanged(
      deletedProject[1],
      projectToDelete.status,
      "DELETED"
    );
    projectToDelete.applicants.map((applicant) => {
      sendEmail({
        to: applicant.email,
        subject: projectStatusChangedEmail.subject,
        html: projectStatusChangedEmail.html,
      });
    });
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

// 비밀번호 검증
export async function validateProjectPassword(
  id: number,
  password: string
): Promise<boolean> {
  const project = await prisma.project.findUnique({
    where: { id },
    select: { passwordHash: true },
  });

  if (!project) {
    throw new NotFoundError("Project not found.");
  }

  return await verifyResourcePassword(password, project.passwordHash);
}

export async function reopenProject(
  id: number,
  currentPassword: string
): Promise<Project> {
  const projectToReopen = await prisma.project.findUnique({
    where: { id },
    select: {
      ...projectPublicSelection,
      passwordHash: true, // 비밀번호 해시 포함
    },
  });

  if (!projectToReopen) {
    throw new NotFoundError("Project not found for reopening.");
  }

  const isAuthorized = await verifyResourcePassword(
    currentPassword,
    projectToReopen.passwordHash
  );
  if (!isAuthorized) {
    throw new UnauthorizedError("Incorrect current password for reopening.");
  }

  const reopenedProject = await prisma.project.update({
    where: { id },
    data: { status: "RECRUITING" },
    select: projectPublicSelection, // passwordHash 제외 확인
  });

  const projectStatusChangedEmail = emailTemplates.projectStatusChanged(
    reopenedProject,
    projectToReopen.status,
    reopenedProject.status
  );
  reopenedProject.applicants.map((applicant) => {
    sendEmail({
      to: applicant.email,
      subject: projectStatusChangedEmail.subject,
      html: projectStatusChangedEmail.html,
    });
  });
  return reopenedProject;
}

export async function closeProject(
  id: number,
  currentPassword: string
): Promise<Project> {
  const projectToClose = await prisma.project.findUnique({
    where: { id },
    select: {
      ...projectPublicSelection,
      passwordHash: true, // 비밀번호 해시 포함
    },
  });

  if (!projectToClose) {
    throw new NotFoundError("Project not found for closing.");
  }

  const isAuthorized = await verifyResourcePassword(
    currentPassword,
    projectToClose.passwordHash
  );
  if (!isAuthorized) {
    throw new UnauthorizedError("Incorrect current password for closing.");
  }

  const closedProject = await prisma.project.update({
    where: { id },
    data: { status: "CLOSED" },
    select: projectPublicSelection, // passwordHash 제외 확인
  });

  const projectStatusChangedEmail = emailTemplates.projectStatusChanged(
    closedProject,
    projectToClose.status,
    closedProject.status
  );
  closedProject.applicants.map((applicant) => {
    sendEmail({
      to: applicant.email,
      subject: projectStatusChangedEmail.subject,
      html: projectStatusChangedEmail.html,
    });
  });
  return closedProject;
}
