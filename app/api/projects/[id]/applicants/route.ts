import { MaxApplicantsError, NotFoundError } from "@/lib/authUtils"; // Project ID 관련 에러 처리용
import { parseAndValidateRequestBody } from "@/lib/routeUtils";
import {
  createApplicant,
  getApplicantsByProjectId,
} from "@/services/applicant";
import { CreateApplicantSchema } from "@/types/applicant";
import { NextRequest, NextResponse } from "next/server";

interface ProjectContext {
  params: { id: string };
}

export async function POST(request: NextRequest, { params }: ProjectContext) {
  try {
    const projectId = parseInt(params.id, 10);
    if (isNaN(projectId))
      return NextResponse.json(
        { error: "Invalid project ID format" },
        { status: 400 }
      );

    const { data: validatedData, errorResponse } =
      await parseAndValidateRequestBody(request, CreateApplicantSchema);
    if (errorResponse) return errorResponse;
    if (!validatedData)
      throw new Error("Validated data is unexpectedly undefined.");

    const applicant = await createApplicant(projectId, validatedData); // 서비스에서 NotFound 에러 throw 가능
    return NextResponse.json(applicant, { status: 201 });
  } catch (error) {
    if (error instanceof NotFoundError)
      return NextResponse.json({ error: error.message }, { status: 404 }); // 연결할 프로젝트 없음
    if (error instanceof MaxApplicantsError)
      return NextResponse.json({ error: error.message }, { status: 409 });
    if (error instanceof Error && error.message.includes("integrity error")) {
      return NextResponse.json(
        { error: "Server integrity error while creating applicant." },
        { status: 500 }
      );
    }
    return NextResponse.json(
      { error: "Failed to create applicant" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest, { params }: ProjectContext) {
  try {
    const projectId = parseInt(params.id, 10);
    if (isNaN(projectId))
      return NextResponse.json(
        { error: "Invalid project ID format" },
        { status: 400 }
      );

    // 프로젝트 존재 여부 확인 로직 추가 가능
    // const projectExists = await prisma.project.findUnique({ where: { id: projectId } });
    // if (!projectExists) return NextResponse.json({ error: 'Project not found' }, { status: 404 });

    const applicants = await getApplicantsByProjectId(projectId);
    return NextResponse.json(applicants);
  } catch (error) {
    console.error(`Error fetching applicants for project ${params.id}:`, error);
    return NextResponse.json(
      { error: "Failed to fetch applicants" },
      { status: 500 }
    );
  }
}
