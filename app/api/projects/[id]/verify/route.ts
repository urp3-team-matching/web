import { NotFoundError } from "@/lib/errors";
import { ProjectPasswordManager } from "@/lib/projectPasswordManager";
import { verifyProjectPermission } from "@/services/project";
import { NextRequest, NextResponse } from "next/server";

interface RouteContext {
  params: { id: string };
}

/**
 * 프로젝트 비밀번호를 검증
 * 요청 바디에 { password: string } 형식으로 비밀번호를 전달한 경우: 해당 비밀번호로 검증
 * 요청 바디에 비밀번호가 없는 경우: 쿠키에 저장된 비밀번호로 검증
 */
export async function POST(request: NextRequest, { params }: RouteContext) {
  try {
    const projectId = parseInt(params.id, 10);
    const password = (await request.json()).password as string | undefined;
    if (isNaN(projectId))
      return NextResponse.json(
        { error: "Invalid project ID format" },
        { status: 400 }
      );

    // 명시적으로 패스워드가 주어진 경우: 해당 비밀번호로 검증
    if (typeof password === "string" && password.length > 0) {
      const isPasswordValid =
        await ProjectPasswordManager.validateProjectPassword(
          projectId,
          password
        );
      if (!isPasswordValid) {
        console.debug(
          `Project ${projectId} verification failed via provided password`
        );
        return NextResponse.json(
          { error: "Invalid project password" },
          { status: 401 }
        );
      }
      const response = NextResponse.json(
        { message: "Project validation successful" },
        { status: 200 }
      );
      ProjectPasswordManager.setPasswordCookie(response, projectId, password);
      console.debug(`Project ${projectId} verified via provided password`);
      return response;
    }

    // 패스워드가 주어지지 않은 경우: 쿠키에 저장된 패스워드로 검증
    const isVerified = await verifyProjectPermission(projectId, request);
    if (!isVerified) {
      console.debug(`Project ${projectId} verification failed via cookie`);
      return NextResponse.json(
        { error: "Invalid project password" },
        { status: 401 }
      );
    }
    console.debug(`Project ${projectId} verified via cookie`);

    return NextResponse.json(
      { message: "Project validation successful" },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof NotFoundError)
      return NextResponse.json({ error: error.message }, { status: 404 });
    console.error(`Error fetching project ${params.id}:`, error);
    return NextResponse.json(
      { error: "Failed to fetch project" },
      { status: 500 }
    );
  }
}
