import { NextRequest, NextResponse } from "next/server";
import { decryptPassword, encryptPassword } from "./encryption";

export class ProjectPasswordManager {
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
   * HttpOnly 쿠키에서 암호화된 비밀번호 복호화
   */
  static getPasswordFromCookie(
    request: Request,
    projectId: number
  ): string | null {
    try {
      const cookieHeader = request.headers.get("cookie");
      if (!cookieHeader) return null;

      // 쿠키 파싱
      const cookies: Record<string, string> = {};
      cookieHeader.split("; ").forEach((cookie) => {
        const [name, value] = cookie.split("=");
        if (name && value) {
          cookies[name] = decodeURIComponent(value);
        }
      });

      const encryptedPassword = cookies[`project_auth_${projectId}`];
      if (!encryptedPassword) return null;

      return decryptPassword(encryptedPassword);
    } catch (error) {
      console.error("Failed to get password from cookie:", error);
      return null;
    }
  }

  /**
   * NextRequest에서 쿠키 읽기 (Next.js API 라우트용)
   */
  static getPasswordFromNextRequest(
    request: NextRequest,
    projectId: number
  ): string | null {
    try {
      const encryptedPassword = request.cookies.get(
        `project_auth_${projectId}`
      )?.value;
      if (!encryptedPassword) return null;

      return decryptPassword(encryptedPassword);
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
}
