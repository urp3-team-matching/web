import {
  BadRequestError,
  MaxApplicantsError,
  NotFoundError,
  UnauthorizedError,
} from "@/lib/errors";
import { acceptApplicant } from "@/services/applicant";
import { verifyProjectPermission } from "@/services/project";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string; applicantId: string } }
) {
  const { id: projectId, applicantId } = params;
  const isVerified = await verifyProjectPermission(Number(projectId), request);
  if (!isVerified) {
    return NextResponse.json(
      { error: "Invalid project password" },
      { status: 401 }
    );
  }

  try {
    const updatedApplicant = await acceptApplicant(
      Number(projectId),
      Number(applicantId)
    );
    return NextResponse.json(updatedApplicant);
  } catch (error) {
    console.error("Error accepting applicant:", error);
    if (error instanceof BadRequestError) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    if (error instanceof UnauthorizedError) {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }
    if (error instanceof NotFoundError) {
      return NextResponse.json({ error: error.message }, { status: 404 });
    }
    if (error instanceof MaxApplicantsError) {
      return NextResponse.json({ error: error.message }, { status: 409 });
    }
    return NextResponse.json(
      { error: "Failed to accept applicant" },
      { status: 500 }
    );
  }
}
