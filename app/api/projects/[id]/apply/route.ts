import { NotFoundError } from "@/lib/authUtils";
import { validateRequestBody } from "@/lib/routeUtils";
import { applyToProject } from "@/services/applicant";
import { ApplicantSchema } from "@/types/applicant";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id: projectId } = params;

  try {
    const projectIdNumber = Number(projectId);
    if (isNaN(projectIdNumber)) {
      return NextResponse.json(
        { error: "Invalid project ID" },
        { status: 400 }
      );
    }

    const requestBody = await request.json();

    const { data: validatedData, errorResponse } = validateRequestBody(
      requestBody,
      ApplicantSchema
    );

    if (!validatedData) {
      return errorResponse!;
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
