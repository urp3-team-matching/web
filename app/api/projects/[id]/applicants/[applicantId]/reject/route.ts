import {
  BadRequestError,
  NotFoundError,
  UnauthorizedError,
} from "@/lib/authUtils";
import { rejectApplicant } from "@/services/applicant";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string; applicantId: string } }
) {
  const { id: projectId, applicantId } = params;
  const body = await request.json();
  const projectProposerPassword = body.projectProposerPassword;

  try {
    const updatedApplicant = await rejectApplicant(
      Number(projectId),
      Number(applicantId),
      projectProposerPassword
    );
    return NextResponse.json(updatedApplicant);
  } catch (error) {
    console.error("Error rejecting applicant:", error);
    if (error instanceof BadRequestError) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    if (error instanceof UnauthorizedError) {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }
    if (error instanceof NotFoundError) {
      return NextResponse.json({ error: error.message }, { status: 404 });
    }
    return NextResponse.json(
      { error: "Failed to reject applicant" },
      { status: 500 }
    );
  }
}
