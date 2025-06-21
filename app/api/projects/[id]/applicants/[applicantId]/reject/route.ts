import { BadRequestError, NotFoundError } from "@/lib/authUtils";
import { rejectApplicant } from "@/services/applicant";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  request: NextRequest,
  params: { id: string; applicantId: string }
) {
  const { id: projectId, applicantId } = params;

  try {
    const updatedApplicant = await rejectApplicant(
      Number(projectId),
      Number(applicantId)
    );
    return NextResponse.json(updatedApplicant);
  } catch (error) {
    console.error("Error rejecting applicant:", error);
    if (error instanceof BadRequestError) {
      return NextResponse.json({ error: error.message }, { status: 400 });
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
