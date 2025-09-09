import { NotFoundError } from "@/lib/authUtils";
import { parseAndValidateRequestBody } from "@/lib/routeUtils";
import { deletePost, getPostById, updatePost } from "@/services/post";
import { PostSchema } from "@/types/post";
import { NextRequest, NextResponse } from "next/server";

interface RouteContext {
  params: { id: string };
}

export async function GET(request: NextRequest, { params }: RouteContext) {
  try {
    const postId = parseInt(params.id, 10);
    if (isNaN(postId))
      return NextResponse.json(
        { error: "Invalid post ID format" },
        { status: 400 }
      );

    const post = await getPostById(postId);
    if (!post) {
      // NotFoundError를 서비스에서 throw하도록 통일할 수도 있음
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }
    return NextResponse.json(post);
  } catch (error) {
    // getPostById에서 NotFoundError를 throw했다면 여기서 처리 가능
    if (error instanceof NotFoundError) {
      return NextResponse.json({ error: error.message }, { status: 404 });
    }
    console.error(`Error fetching post ${params.id}:`, error);
    return NextResponse.json(
      { error: "Failed to fetch post" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest, { params }: RouteContext) {
  try {
    const postId = parseInt(params.id, 10);
    if (isNaN(postId))
      return NextResponse.json(
        { error: "Invalid post ID format" },
        { status: 400 }
      );

    const { data: validatedData, errorResponse } =
      await parseAndValidateRequestBody(request, PostSchema);
    if (errorResponse) return errorResponse;
    if (!validatedData)
      throw new Error("Validated data is unexpectedly undefined.");

    const post = await updatePost(postId, validatedData);
    return NextResponse.json(post);
  } catch (error) {
    if (error instanceof NotFoundError)
      return NextResponse.json({ error: error.message }, { status: 404 });
    // ZodError는 routeUtils에서 처리됨
    console.error(`Error updating post ${params.id}:`, error);
    if (error instanceof Error && error.message.includes("integrity error")) {
      return NextResponse.json(
        { error: "Server integrity error while updating post." },
        { status: 500 }
      );
    }
    return NextResponse.json(
      { error: "Failed to update post" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, { params }: RouteContext) {
  try {
    const postId = parseInt(params.id, 10);
    if (isNaN(postId))
      return NextResponse.json(
        { error: "Invalid post ID format" },
        { status: 400 }
      );

    await deletePost(postId);
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    if (error instanceof NotFoundError)
      return NextResponse.json({ error: error.message }, { status: 404 });
    console.error(`Error deleting post ${params.id}:`, error);
    return NextResponse.json(
      { error: "Failed to delete post" },
      { status: 500 }
    );
  }
}
