import sendEmail from "@/lib/email";
import emailTemplates from "@/lib/email/templates";
import { BadRequestError, NotFoundError } from "@/lib/errors";
import { prisma } from "@/lib/prisma";
import { ProjectPasswordManager } from "@/lib/projectPasswordManager";
import {
  ApplicantForProject,
  GetProjectsQueryInput,
  ProjectInput,
  projectPublicSelection,
  ProjectUpdateInput,
  Semester,
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

export async function createProject(data: ProjectInput): Promise<Project> {
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
