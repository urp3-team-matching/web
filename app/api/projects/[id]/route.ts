import {
  deleteProject,
  getProjectById,
  updateProject,
} from "@/services/project";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { id } = req.query;

  try {
    const project = await getProjectById(Number(id));
    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }
    return NextResponse.json(project, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  const { id } = req.query;

  try {
    const data = await req.json();
    const project = await updateProject(Number(id), data);
    return NextResponse.json(project, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const { id } = req.query;

  try {
    await deleteProject(Number(id));
    return NextResponse.json({}, { status: 204 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
