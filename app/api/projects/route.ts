import { createProject, getProjects } from "@/services/project";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const page = searchParams.get("page") || "1";
  const limit = searchParams.get("limit") || "10";
  const search = searchParams.get("search") || "";
  const sort = searchParams.get("sort") || "createdDatetime";
  const order = searchParams.get("order") || "desc";
  const filters = searchParams.get("filters") || "";
  const query = {
    page: Number(page),
    limit: Number(limit),
    search,
    sort,
    order,
    filters: filters ? JSON.parse(filters) : undefined,
  };

  try {
    const projects = await getProjects(query);
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
