import {
  BadRequestError,
  NotFoundError,
  UnauthorizedError,
} from "@/lib/authUtils";
import { reopenProject } from "@/services/project";
import { NextRequest, NextResponse } from "next/server";

interface RouteContext {
  params: { id: string };
}

export async function POST(request: NextRequest, { params }: RouteContext) {
  try {
    const projectId = parseInt(params.id, 10);
    if (isNaN(projectId)) {
      return NextResponse.json(
        { error: "Invalid project ID format" },
        { status: 400 }
      );
    }

    const { currentPassword } = await request.json();
    if (!currentPassword) {
      return NextResponse.json(
        { error: "Current password is required" },
        { status: 400 }
      );
    }

    const project = await reopenProject(projectId, currentPassword);
    return NextResponse.json(project);
  } catch (error) {
    if (error instanceof NotFoundError) {
      return NextResponse.json({ error: error.message }, { status: 404 });
    }

    if (error instanceof UnauthorizedError) {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }

    if (error instanceof BadRequestError) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    console.error(`Error reopening project ${params.id}:`, error);
    return NextResponse.json(
      { error: "Failed to reopen project" },
      { status: 500 }
    );
  }
}
