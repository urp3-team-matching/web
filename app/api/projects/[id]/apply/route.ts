import { NotFoundError } from "@/lib/authUtils";
import { parseAndValidateRequestBody } from "@/lib/routeUtils";
import { applyToProject } from "@/services/applicant";
import { ApplicantSchema } from "@/types/applicant";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest, params: { id: string }) {
  const { id: projectId } = params;

  try {
    const projectIdNumber = Number(projectId);
    if (isNaN(projectIdNumber)) {
      return NextResponse.json(
        { error: "Invalid project ID" },
        { status: 400 }
      );
    }
    // 요청 본문에서 지원서 정보 추출
    const requestBody = await request.json();
    if (!requestBody || typeof requestBody !== "object") {
      return NextResponse.json(
        { error: "Invalid request body" },
        { status: 400 }
      );
    }
    // 지원서 정보 유효성 검사(zod schema 기반)
    const { data: validatedData, errorResponse } =
      await parseAndValidateRequestBody(request, ApplicantSchema);
    if (!validatedData)
      throw new Error("Validated data is unexpectedly undefined.");

    if (errorResponse) {
      return NextResponse.json(errorResponse, { status: 400 });
    }
    const updatedApplicant = await applyToProject(
      projectIdNumber,
      validatedData
    );
    return NextResponse.json(updatedApplicant);
  } catch (error) {
    console.error("Error applying to project:", error);
    if (error instanceof NotFoundError) {
      return NextResponse.json({ error: error.message }, { status: 404 });
    }
    return NextResponse.json(
      { error: "Failed to apply to project" },
      { status: 500 }
    );
  }
}
