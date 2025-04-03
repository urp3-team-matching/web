import { createProject, getProjects } from "@/services/project";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  req.nextUrl.searchParams.getAll("page");
  try {
    const projects = await getProjects(req.query);
    return NextResponse.json(projects);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const project = await createProject(data);
    return NextResponse.json(project, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
