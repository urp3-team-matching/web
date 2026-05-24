import { NextRequest, NextResponse } from "next/server";

import { getApplicantsByProjectId } from "@/services/applicant";
import { verifyProjectPermission } from "@/services/project";

interface ProjectContext {
  params: Promise<{ id: string }>;
}

export async function GET(request: NextRequest, props: ProjectContext) {
  const params = await props.params;
  try {
    const projectId = parseInt(params.id, 10);
    if (isNaN(projectId))
      return NextResponse.json(
        { error: "Invalid project ID format" },
        { status: 400 }
      );

    // 인증된 owner에게만 PII(email, introduction) 포함해서 반환
    const isOwner = await verifyProjectPermission(projectId, request);
    const applicants = await getApplicantsByProjectId(projectId, isOwner);
    return NextResponse.json(applicants);
  } catch (error) {
    console.error(`Error fetching applicants for project ${params.id}:`, error);
    return NextResponse.json(
      { error: "Failed to fetch applicants" },
      { status: 500 }
    );
  }
}
