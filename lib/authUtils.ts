import { getProjectForPasswordVerification } from "@/services/project";
import { createClient } from "@/utils/supabase/server";
import bcrypt from "bcryptjs";
import { NextRequest } from "next/server";
import { ProjectPasswordManager } from "./projectPasswordManager";

/**
 * 평문 비밀번호와 저장된 해시를 비교합니다.
 */
export async function verifyResourcePassword(
  plainPassword: string,
  hashedPassword: string | null
): Promise<boolean> {
  if (!plainPassword || !hashedPassword) {
    // "모든 리소스는 비밀번호 설정되어있을거야" 원칙에 따라, hashedPassword가 null이면 안됨.
    // plainPassword (currentPassword)가 없는 경우도 실패 처리.
    return false;
  }
  return bcrypt.compare(plainPassword, hashedPassword);
}

export class BadRequestError extends Error {
  constructor(message = "Bad Request") {
    super(message);
    this.name = "BadRequestError";
  }
}

export class UnauthorizedError extends Error {
  constructor(message = "Unauthorized: Incorrect or missing credentials.") {
    super(message);
    this.name = "UnauthorizedError";
  }
}

export class NotFoundError extends Error {
  constructor(message = "Resource not found.") {
    super(message);
    this.name = "NotFoundError";
  }
}

export class ForbiddenError extends Error {
  constructor(
    message = "Forbidden: You do not have permission to perform this action."
  ) {
    super(message);
    this.name = "ForbiddenError";
  }
}

export class MaxApplicantsError extends Error {
  constructor(message = "Maximum number of applicants reached.") {
    super(message);
    this.name = "MaxApplicantsError";
  }
}

export class InternalServerError extends Error {
  constructor(message = "Internal Server Error") {
    super(message);
    this.name = "InternalServerError";
  }
}

/**
 * 프로젝트 권한을 검증하는 통합 가드 함수
 */
export async function verifyProjectPermission(
  request: Request | NextRequest,
  projectId: number,
  providedPassword?: string
): Promise<boolean> {
  try {
    // Supabase 인증 사용자 확인
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user) return true;

    // HttpOnly 쿠키에서 암호화된 비밀번호 확인
    let cookiePassword: string | null = null;

    if (request instanceof NextRequest) {
      cookiePassword = ProjectPasswordManager.getPasswordFromNextRequest(
        request,
        projectId
      );
    } else {
      cookiePassword = ProjectPasswordManager.getPasswordFromCookie(
        request,
        projectId
      );
    }

    if (cookiePassword) {
      const project = await getProjectForPasswordVerification(projectId);
      if (
        project &&
        (await verifyResourcePassword(cookiePassword, project.passwordHash))
      ) {
        return true;
      }
    }

    // 4. 제공된 비밀번호로 검증 (최후 수단)
    if (providedPassword) {
      const project = await getProjectForPasswordVerification(projectId);
      if (
        project &&
        (await verifyResourcePassword(providedPassword, project.passwordHash))
      ) {
        return true;
      }
    }

    return false;
  } catch (error) {
    console.error("Permission verification failed:", error);
    return false;
  }
}
