import { parseAndValidateRequestBody } from "@/lib/routeUtils";
import { createProject, getAllProjects } from "@/services/project";
import { CreateProjectSchema, GetProjectsQuerySchema } from "@/types/project";
import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";

export async function POST(request: NextRequest) {
  try {
    const { data: validatedData, errorResponse } =
      await parseAndValidateRequestBody(request, CreateProjectSchema);
    if (errorResponse) return errorResponse;
    if (!validatedData)
      throw new Error("Validated data is unexpectedly undefined.");

    const project = await createProject(validatedData);
    return NextResponse.json(project, { status: 201 });
  } catch (error) {
    console.error("Error creating project:", error);
    if (error instanceof Error && error.message.includes("integrity error")) {
      return NextResponse.json(
        { error: "Server integrity error while creating project." },
        { status: 500 }
      );
    }
    // 예: createStandaloneProposer 같은 함수에서 발생하는 NotFoundError 처리 (현재 createProject에는 없음)
    // if (error instanceof NotFoundError) {
    //     return NextResponse.json({ error: error.message }, { status: 404 });
    // }
    return NextResponse.json(
      { error: "Failed to create project" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const queryParams = Object.fromEntries(searchParams.entries());

    const validatedQuery = GetProjectsQuerySchema.parse(queryParams);

    const result = await getAllProjects(validatedQuery);
    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: "Invalid query parameters", details: error.errors },
        { status: 400 }
      );
    }
    console.error("Error fetching projects:", error);
    return NextResponse.json(
      { error: "Failed to fetch projects" },
      { status: 500 }
    );
  }
}
