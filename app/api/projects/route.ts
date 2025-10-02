import { BadRequestError } from "@/lib/errors";
import { ProjectPasswordManager } from "@/lib/projectPasswordManager";
import { parseAndValidateRequestBody } from "@/lib/routeUtils";
import { createProject, getAllProjects } from "@/services/project";
import { GetProjectsQuerySchema, ProjectSchema } from "@/types/project";
import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";

export async function POST(request: NextRequest) {
  try {
    const { data: validatedData, errorResponse } =
      await parseAndValidateRequestBody(request, ProjectSchema);
    if (errorResponse) return errorResponse;
    if (!validatedData)
      throw new Error("Validated data is unexpectedly undefined.");

    const project = await createProject(validatedData);
    const response = NextResponse.json(project, { status: 201 });
    ProjectPasswordManager.setPasswordCookie(
      response,
      project.id,
      validatedData.password
    );
    return response;
  } catch (error) {
    console.error("Error creating project:", error);
    if (error instanceof BadRequestError) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return NextResponse.json(
      { error: "Failed to create project" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const queryAsObject = Object.fromEntries(searchParams.entries());
    const validatedQuery = GetProjectsQuerySchema.parse(queryAsObject);

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
