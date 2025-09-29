import {
  NotFoundError,
  UnauthorizedError,
  verifyProjectPermission,
} from "@/lib/authUtils";
import { ProjectPasswordManager } from "@/lib/projectPasswordManager";
import {
  extractPasswordForDelete,
  parseAndValidateRequestBody,
} from "@/lib/routeUtils";
import {
  deleteProject,
  getProjectById,
  updateProject,
} from "@/services/project";
import { ProjectUpdateSchema } from "@/types/project";
import { NextRequest, NextResponse } from "next/server";

interface RouteContext {
  params: { id: string };
}

export async function GET(request: NextRequest, { params }: RouteContext) {
  try {
    const projectId = parseInt(params.id, 10);
    if (isNaN(projectId))
      return NextResponse.json(
        { error: "Invalid project ID format" },
        { status: 400 }
      );

    const project = await getProjectById(projectId); // 서비스에서 NotFound 에러 throw 가능성
    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }
    return NextResponse.json(project);
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

export async function PUT(request: NextRequest, { params }: RouteContext) {
  try {
    const projectId = parseInt(params.id, 10);
    if (isNaN(projectId))
      return NextResponse.json(
        { error: "Invalid project ID format" },
        { status: 400 }
      );

    const { data: validatedData, errorResponse } =
      await parseAndValidateRequestBody(request, ProjectUpdateSchema);
    if (errorResponse) return errorResponse;
    if (!validatedData)
      throw new Error("Validated data is unexpectedly undefined.");

    const hasPermission = await verifyProjectPermission(
      request,
      projectId,
      validatedData.currentPassword
    );
    if (!hasPermission) {
      return NextResponse.json(
        { error: "Insufficient permissions for this project" },
        { status: 401 }
      );
    }

    const { currentPassword, ...updateData } = validatedData;

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        { error: "No update data provided beyond current password" },
        { status: 400 }
      );
    }

    const updatedProject = await updateProject(projectId, updateData);
    const response = NextResponse.json(updatedProject, { status: 200 });
    ProjectPasswordManager.setPasswordCookie(
      response,
      projectId,
      currentPassword
    );

    return response;
  } catch (error) {
    if (error instanceof UnauthorizedError)
      return NextResponse.json({ error: error.message }, { status: 403 });
    if (error instanceof NotFoundError)
      return NextResponse.json({ error: error.message }, { status: 404 });
    console.error(`Error updating project ${params.id}:`, error);
    if (error instanceof Error && error.message.includes("integrity error")) {
      return NextResponse.json(
        { error: "Server integrity error while updating project." },
        { status: 500 }
      );
    }
    if (
      error instanceof Error &&
      error.message.includes("Failed to delete project and associated data")
    ) {
      // 트랜잭션 에러
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json(
      { error: "Failed to update project" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, { params }: RouteContext) {
  try {
    const projectId = parseInt(params.id, 10);
    if (isNaN(projectId))
      return NextResponse.json(
        { error: "Invalid project ID format" },
        { status: 400 }
      );

    const { currentPassword, errorResponse } = await extractPasswordForDelete(
      request
    );
    if (errorResponse) return errorResponse;

    const hasPermission = await verifyProjectPermission(
      request,
      projectId,
      currentPassword
    );
    if (!hasPermission) {
      return NextResponse.json(
        { error: "Insufficient permissions for this project" },
        { status: 401 }
      );
    }

    await deleteProject(projectId);

    const response = new NextResponse(null, { status: 204 });
    ProjectPasswordManager.removePasswordCookie(response, projectId);

    return response;
  } catch (error) {
    if (error instanceof UnauthorizedError)
      return NextResponse.json({ error: error.message }, { status: 403 });
    if (error instanceof NotFoundError)
      return NextResponse.json({ error: error.message }, { status: 404 });
    console.error(`Error deleting project ${params.id}:`, error);
    if (error instanceof Error && error.message.includes("integrity error")) {
      return NextResponse.json(
        { error: "Server integrity error while deleting project." },
        { status: 500 }
      );
    }
    if (
      error instanceof Error &&
      error.message.includes("Failed to delete project and associated data")
    ) {
      // 트랜잭션 에러
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json(
      { error: "Failed to delete project" },
      { status: 500 }
    );
  }
}
