import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";

import { NotFoundError } from "@/lib/errors";
import { prisma } from "@/lib/prisma";

import { decryptPassword, encryptPassword } from "./encryption";

export class ProjectPasswordManager {
  static async validateProjectPassword(
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

    if (!password) {
      console.debug("Password is missing");
      return false;
    }
    if (!project.passwordHash) {
      throw new Error(
        `Data integrity error: Project ${id} is missing a password hash.`
      );
    }

    const isValid = await bcrypt.compare(password, project.passwordHash);
    console.debug(`Password validation for project ${id}:`, isValid);
    return isValid;
  }

  /**
   * 암호화된 비밀번호를 HttpOnly 쿠키에 저장
   */
  static setPasswordCookie(
    response: NextResponse,
    projectId: number,
    password: string
  ): void {
    try {
      const encryptedPassword = encryptPassword(password);

      response.cookies.set(`project_auth_${projectId}`, encryptedPassword, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 60 * 60 * 24, // 24시간
        path: "/",
      });
    } catch (error) {
      console.error("Failed to set password cookie:", error);
    }
  }

  /**
   * NextRequest에서 쿠키 읽기 (Next.js API 라우트용)
   */
  static getPasswordFromNextRequest(
    request: NextRequest,
    projectId: number
  ): string | null {
    console.debug("Getting password from NextRequest for project:", projectId);
    try {
      const encryptedPassword = request.cookies.get(
        `project_auth_${projectId}`
      )?.value;
      if (!encryptedPassword) {
        console.debug("No password cookie found for project:", projectId);
        return null;
      }

      const decryptedPassword = decryptPassword(encryptedPassword);
      console.debug("Decrypted password for project:", projectId);
      return decryptedPassword;
    } catch (error) {
      console.error("Failed to get password from NextRequest:", error);
      return null;
    }
  }

  /**
   * 프로젝트 비밀번호 쿠키 제거
   */
  static removePasswordCookie(response: NextResponse, projectId: number): void {
    response.cookies.delete(`project_auth_${projectId}`);
  }

  /**
   * 모든 프로젝트 비밀번호 쿠키 제거
   */
  static removeAllPasswordCookies(
    response: NextResponse,
    request: Request
  ): void {
    const cookieHeader = request.headers.get("cookie");
    if (!cookieHeader) return;

    cookieHeader.split("; ").forEach((cookie) => {
      const [name] = cookie.split("=");
      if (name && name.startsWith("project_auth_")) {
        response.cookies.delete(name);
      }
    });
  }

  /**
   * 쿠키에서 가져온 비밀번호로 프로젝트 권한 검증
   */
  static async validateProjectPasswordFromCookie(
    request: NextRequest,
    projectId: number
  ): Promise<boolean> {
    try {
      const cookiePassword = this.getPasswordFromNextRequest(
        request,
        projectId
      );

      if (!cookiePassword) {
        console.debug("No password found in cookie for project:", projectId);
        return false;
      }

      // 🔹 쿠키의 평문 비밀번호를 validateProjectPassword로 검증
      return await this.validateProjectPassword(projectId, cookiePassword);
    } catch (error) {
      console.error("Cookie password validation failed:", error);
      return false;
    }
  }
}
