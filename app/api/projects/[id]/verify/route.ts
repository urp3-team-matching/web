import { NotFoundError } from "@/lib/authUtils";
import { supabase } from "@/lib/supabaseClient";
import { validateProjectPassword as verifyProjectPassword } from "@/services/project";
import { NextRequest, NextResponse } from "next/server";

interface RouteContext {
  params: { id: string };
}

export async function POST(request: NextRequest, { params }: RouteContext) {
  try {
    const projectId = parseInt(params.id, 10);
    if (isNaN(projectId))
      return NextResponse.json(
        { error: "Invalid project ID format" },
        { status: 400 }
      );

    const { password } = await request.json();
    if (!password) {
      return NextResponse.json(
        { error: "Password is required" },
        { status: 400 }
      );
    }

    const isPasswordVerified = await verifyProjectPassword(projectId, password);
    const isAdminVerified = await supabase.auth
      .getUser()
      .then(({ data }) => !!data.user);
    if (!isPasswordVerified && !isAdminVerified) {
      return NextResponse.json({ error: "Invalid password" }, { status: 401 });
    }
    return NextResponse.json(
      { message: "Project validation successful" },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof NotFoundError)
      return NextResponse.json({ error: error.message }, { status: 404 });
    console.error(`Error fetching project ${params.id}:`, error);
    return NextResponse.json(
      { error: "Failed to fetch project" },
      { status: 500 }
    );
  }
}
