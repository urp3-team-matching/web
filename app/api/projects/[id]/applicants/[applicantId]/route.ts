import { NotFoundError } from "@/lib/authUtils";
import { parseAndValidateRequestBody } from "@/lib/routeUtils";
import {
  deleteApplicant,
  getApplicantByIdForProject,
  updateApplicant,
} from "@/services/applicant";
import { ApplicantUpdateSchema } from "@/types/applicant";
import { NextRequest, NextResponse } from "next/server";

interface ApplicantContext {
  params: { projectId: string; applicantId: string };
}

export async function GET(request: NextRequest, { params }: ApplicantContext) {
  try {
    const projectId = parseInt(params.projectId, 10);
    const applicantId = parseInt(params.applicantId, 10);
    if (isNaN(projectId) || isNaN(applicantId))
      return NextResponse.json({ error: "Invalid ID format" }, { status: 400 });

    const applicant = await getApplicantByIdForProject(applicantId, projectId);
    if (!applicant)
      return NextResponse.json(
        { error: "Applicant not found for this project" },
        { status: 404 }
      );
    return NextResponse.json(applicant);
  } catch (error) {
    console.error(
      `Error fetching applicant ${params.applicantId} for project ${params.projectId}:`,
      error
    );
    return NextResponse.json(
      { error: "Failed to fetch applicant" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest, { params }: ApplicantContext) {
  try {
    const projectId = parseInt(params.projectId, 10);
    const applicantId = parseInt(params.applicantId, 10);
    if (isNaN(projectId) || isNaN(applicantId))
      return NextResponse.json({ error: "Invalid ID format" }, { status: 400 });

    const { data: validatedData, errorResponse } =
      await parseAndValidateRequestBody(request, ApplicantUpdateSchema);
    if (errorResponse) return errorResponse;
    if (!validatedData)
      throw new Error("Validated data is unexpectedly undefined.");

    if (Object.keys(validatedData).length <= 1) {
      return NextResponse.json(
        { error: "No update data provided" },
        { status: 400 }
      );
    }

    const applicant = await updateApplicant(
      applicantId,
      projectId,
      validatedData
    ); // 서비스에서 NotFound, Unauthorized 에러 throw
    return NextResponse.json(applicant);
  } catch (error) {
    if (error instanceof NotFoundError)
      return NextResponse.json({ error: error.message }, { status: 404 });
    console.error(
      `Error updating applicant ${params.applicantId} for project ${params.projectId}:`,
      error
    );
    if (error instanceof Error && error.message.includes("integrity error")) {
      return NextResponse.json(
        { error: "Server integrity error while updating applicant." },
        { status: 500 }
      );
    }
    return NextResponse.json(
      { error: "Failed to update applicant" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: ApplicantContext
) {
  try {
    const projectId = parseInt(params.projectId, 10);
    const applicantId = parseInt(params.applicantId, 10);
    if (isNaN(projectId) || isNaN(applicantId))
      return NextResponse.json({ error: "Invalid ID format" }, { status: 400 });

    await deleteApplicant(applicantId, projectId); // 서비스에서 NotFound, Unauthorized 에러 throw
    return NextResponse.json(null, { status: 204 });
  } catch (error) {
    if (error instanceof NotFoundError)
      return NextResponse.json({ error: error.message }, { status: 404 });
    console.error(
      `Error deleting applicant ${params.applicantId} for project ${params.projectId}:`,
      error
    );
    if (error instanceof Error && error.message.includes("integrity error")) {
      return NextResponse.json(
        { error: "Server integrity error while deleting applicant." },
        { status: 500 }
      );
    }
    return NextResponse.json(
      { error: "Failed to delete applicant" },
      { status: 500 }
    );
  }
}
