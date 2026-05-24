import sendEmail from "@/lib/email";
import emailTemplates from "@/lib/email/templates";
import { BadRequestError, NotFoundError } from "@/lib/errors";
import { prisma } from "@/lib/prisma";
import { ProjectPasswordManager } from "@/lib/projectPasswordManager";
import {
  ApplicantForProject,
  GetProjectsQueryInput,
  projectAdminSelection,
  ProjectInput,
  projectPublicSelection,
  ProjectUpdateInput,
  Semester,
  STATUS_FILTER_ALL,
} from "@/types/project";
import { PaginatedType, PasswordOmittedType } from "@/types/utils";
import { getServerSupabase } from "@/utils/supabase/server";
import { Prisma, Project } from "@prisma/client";
import bcrypt from "bcryptjs";
import { NextRequest } from "next/server";

const SALT_ROUNDS = 10;
type PasswordOmittedProject = PasswordOmittedType<Project>;
type ProjectWithForeignKeys = Project & {
  applicants: ApplicantForProject[];
};

/**
 * 프로젝트 권한을 검증하는 통합 가드 함수
 */
export async function verifyProjectPermission(
  projectId: number,
  request: NextRequest
): Promise<boolean>;
export async function verifyProjectPermission(
  projectId: number,
  password: string
): Promise<boolean>;
export async function verifyProjectPermission(
  projectId: number,
  requestOrPassword: NextRequest | string
): Promise<boolean> {
  try {
    const supabase = await getServerSupabase();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user) return true;

    if (typeof requestOrPassword === "string") {
      return await ProjectPasswordManager.validateProjectPassword(
        projectId,
        requestOrPassword
      );
    }

    const cookiePassword = ProjectPasswordManager.getPasswordFromNextRequest(
      requestOrPassword,
      projectId
    );
    if (cookiePassword) {
      return await ProjectPasswordManager.validateProjectPassword(
        projectId,
        cookiePassword
      );
    }

    return false;
  } catch (error) {
    console.error("Permission verification failed:", error);
    return false;
  }
}

export async function createProject(data: ProjectInput): Promise<PasswordOmittedProject> {
  const { password: projectPlainTextPassword, ...projectDataRest } = data;

  const projectPasswordHash = await bcrypt.hash(
    projectPlainTextPassword,
    SALT_ROUNDS
  );

  if (data.proposerType === "STUDENT") {
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
            email: data.email || "",
            major: data.proposerMajor,
            introduction: "",
            status: "APPROVED",
          },
        },
      },
      select: projectPublicSelection,
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
      select: projectPublicSelection,
    });
    // HOST(운영진)가 직접 만든 프로젝트는 관리자 자기알림 메일을 생략
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
    page = 1,
    limit = 10,
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
  if (status && status !== STATUS_FILTER_ALL) whereConditions.status = status;
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
      if (relation === "applicants") {
        orderByConditions.applicants = { [field]: sortOrder };
      } else {
        orderByConditions.createdDatetime = "desc";
      }
    } else {
      orderByConditions[sortBy as keyof Prisma.ProjectOrderByWithRelationInput] = sortOrder;
    }
  } else {
    orderByConditions.createdDatetime = "desc";
  }

  // --- [중요] 학기 날짜 로직 (9월~2월: 차년도 1학기 / 3월~8월: 당해 2학기) ---
  // URP3는 이번 학기에 모집해 다음 학기에 진행할 팀원을 매칭하므로,
  // 글 작성 시기가 아니라 모집 대상(다음) 학기로 분류한다.
  let startDate: Date;
  let endDate: Date;
  const targetYear = year ?? new Date().getFullYear();

  if (semester === Semester.FIRST) {
    // 1학기 기준: 전년도 9월 1일 ~ 해당 연도 2월 말일
    // 예: 2026년 1학기 조회 시 -> 2025년 9월 1일 ~ 2026년 2월 28/29일
    startDate = new Date(targetYear - 1, 8, 1); // 전년도 9월(8) 1일
    endDate = new Date(targetYear, 2, 0, 23, 59, 59, 999); // 당해 3월 0일 = 2월 말일
  } else if (semester === Semester.SECOND) {
    // 2학기 기준: 해당 연도 3월 1일 ~ 해당 연도 8월 31일
    // 예: 2026년 2학기 조회 시 -> 2026년 3월 1일 ~ 2026년 8월 31일
    startDate = new Date(targetYear, 2, 1); // 당해 3월(2) 1일
    endDate = new Date(targetYear, 8, 0, 23, 59, 59, 999); // 당해 9월 0일 = 8월 31일
  } else {
    // 전체 학년도: 전년도 9월 1일 ~ 당해 8월 31일
    startDate = new Date(targetYear - 1, 8, 1);
    endDate = new Date(targetYear, 8, 0, 23, 59, 59, 999);
  }

  whereConditions.createdDatetime = {
    gte: startDate,
    lte: endDate,
  };

  const totalCount = await prisma.project.count({ where: whereConditions });

  const projectsFromDb = await prisma.project.findMany({
    where: whereConditions,
    select: projectPublicSelection,
    orderBy: orderByConditions,
    skip: skip,
    take: take,
  });

  return {
    data: projectsFromDb as PasswordOmittedProject[],
    totalItems: totalCount,
    totalPages: Math.ceil(totalCount / limit),
    currentPage: page,
    itemsPerPage: limit,
  };
}

// isOwner=true(verifyProjectPermission 통과)일 때만 임베드된 applicants에
// PII(email, introduction)를 포함한다. 미인증 호출은 PII 제외.
export async function getProjectById(
  id: number,
  isOwner: boolean = false
): Promise<ProjectWithForeignKeys | null> {
  const select = isOwner ? projectAdminSelection : projectPublicSelection;
  const project = await prisma.project.findUnique({
    where: { id },
    select,
  });

  if (project) {
    try {
      await prisma.project.update({
        where: { id },
        data: { viewCount: { increment: 1 } },
      });
      return {
        ...project,
        viewCount: project.viewCount + 1,
      } as ProjectWithForeignKeys;
    } catch (error) {
      console.error(`Failed to increment view count for project ${id}:`, error);
      return project as ProjectWithForeignKeys;
    }
  }
  return null;
}

export async function updateProject(
  id: number,
  data: Omit<ProjectUpdateInput, "currentPassword">
): Promise<PasswordOmittedProject> {
  const { password: newPlainTextPassword, ...projectDataRest } = data;
  const projectToUpdate = await prisma.project.findUnique({ where: { id } });

  if (!projectToUpdate) throw new NotFoundError("Project not found.");

  let projectPasswordHashToUpdate;
  if (newPlainTextPassword) {
    projectPasswordHashToUpdate = await bcrypt.hash(newPlainTextPassword, SALT_ROUNDS);
  }

  return await prisma.project.update({
    where: { id },
    data: {
      ...projectDataRest,
      ...(projectPasswordHashToUpdate && { passwordHash: projectPasswordHashToUpdate }),
    },
    select: projectAdminSelection,
  });
}

export async function deleteProject(id: number): Promise<void> {
  const projectToDelete = await prisma.project.findUnique({
    where: { id },
    include: { applicants: true }
  });

  if (!projectToDelete) throw new NotFoundError("Project not found for deletion.");

  try {
    const [_, deletedProject] = await prisma.$transaction([
      prisma.applicant.deleteMany({ where: { projectId: id } }),
      prisma.project.delete({ where: { id } }),
    ]);

    const projectStatusChangedEmail = emailTemplates.projectStatusChanged(
      deletedProject,
      projectToDelete.status,
      "DELETED"
    );
    projectToDelete.applicants.forEach((applicant) => {
      sendEmail({
        to: applicant.email,
        subject: projectStatusChangedEmail.subject,
        html: projectStatusChangedEmail.html,
      });
    });
  } catch (error) {
    console.error("Error during project deletion transaction:", error);
    throw new Error("Failed to delete project and associated data.");
  }
}

export async function reopenProject(id: number): Promise<PasswordOmittedProject> {
  const projectToReopen = await prisma.project.findUnique({
    where: { id },
    include: { applicants: true }
  });

  if (!projectToReopen) throw new NotFoundError("Project not found for reopening.");

  const reopenedProject = await prisma.project.update({
    where: { id },
    data: { status: "RECRUITING" },
    select: projectAdminSelection,
  });

  const projectStatusChangedEmail = emailTemplates.projectStatusChanged(
    reopenedProject,
    projectToReopen.status,
    reopenedProject.status
  );
  reopenedProject.applicants.forEach((applicant: any) => {
    sendEmail({
      to: applicant.email,
      subject: projectStatusChangedEmail.subject,
      html: projectStatusChangedEmail.html,
    });
  });
  return reopenedProject;
}

export async function closeProject(id: number): Promise<PasswordOmittedProject> {
  const projectToClose = await prisma.project.findUnique({
    where: { id },
    include: { applicants: true }
  });

  if (!projectToClose) throw new NotFoundError("Project not found for closing.");

  const closedProject = await prisma.project.update({
    where: { id },
    data: { status: "CLOSED" },
    select: projectAdminSelection,
  });

  const projectStatusChangedEmail = emailTemplates.projectStatusChanged(
    closedProject,
    projectToClose.status,
    closedProject.status
  );
  closedProject.applicants.forEach((applicant: any) => {
    sendEmail({
      to: applicant.email,
      subject: projectStatusChangedEmail.subject,
      html: projectStatusChangedEmail.html,
    });
  });
  return closedProject;
}
