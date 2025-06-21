import { getApplicantsByProjectId } from "@/services/applicant";
import { NextRequest, NextResponse } from "next/server";

interface ProjectContext {
  params: { id: string };
}

export async function GET(request: NextRequest, { params }: ProjectContext) {
  try {
    const projectId = parseInt(params.id, 10);
    if (isNaN(projectId))
      return NextResponse.json(
        { error: "Invalid project ID format" },
        { status: 400 }
      );

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
