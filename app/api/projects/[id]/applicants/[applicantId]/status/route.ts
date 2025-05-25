import { NotFoundError, UnauthorizedError } from "@/lib/authUtils";
import { updateApplicantStatus } from "@/services/applicant";
import { ApplicantStatusUpdateSchema } from "@/types/applicant";
import { NextRequest, NextResponse } from "next/server";

interface RouteContext {
  params: {
    id: string;
    applicantId: string;
  };
}

export async function PATCH(request: NextRequest, { params }: RouteContext) {
  try {
    const projectId = parseInt(params.id, 10);
    const applicantId = parseInt(params.applicantId, 10);

    if (isNaN(projectId) || isNaN(applicantId)) {
      return NextResponse.json({ error: "Invalid ID format" }, { status: 400 });
    }

    // 요청 본문 검증
    const body = await request.json();
    const validationResult = ApplicantStatusUpdateSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: "Invalid request body",
          details: validationResult.error.format(),
        },
        { status: 400 }
      );
    }

    const { accepted, currentPassword } = validationResult.data;

    // 지원자 상태 업데이트
    const updatedApplicant = await updateApplicantStatus(
      applicantId,
      projectId,
      accepted,
      currentPassword
    );

    return NextResponse.json(updatedApplicant);
  } catch (error) {
    if (error instanceof NotFoundError) {
      return NextResponse.json({ error: error.message }, { status: 404 });
    }
    if (error instanceof UnauthorizedError) {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }

    console.error("Failed to update applicant status:", error);
    return NextResponse.json(
      { error: "Failed to update applicant status" },
      { status: 500 }
    );
  }
}
