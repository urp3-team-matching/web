import { parseAndValidateRequestBody } from "@/lib/routeUtils"; // GET에는 필요 없음
import { createPost, getAllPosts } from "@/services/post";
import { GetPostsQuerySchema, PostSchema } from "@/types/post";
import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const session = await supabase.auth.getSession();

  if (!session.data.session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { data: validatedData, errorResponse } =
      await parseAndValidateRequestBody(request, PostSchema);
    if (errorResponse) return errorResponse;
    if (!validatedData)
      throw new Error("Validated data is unexpectedly undefined.");

    const post = await createPost(validatedData);
    return NextResponse.json(post, { status: 201 });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: "Invalid input", details: error.errors },
        { status: 400 }
      );
    }
    console.error("Error creating post:", error);
    // 일반적인 에러 처리
    if (error instanceof Error && error.message.includes("integrity error")) {
      // 예: 비밀번호 해시 누락 등 내부 문제
      return NextResponse.json(
        { error: "Server integrity error while creating post." },
        { status: 500 }
      );
    }
    return NextResponse.json(
      { error: "Failed to create post" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const queryParams = Object.fromEntries(searchParams.entries());

    // Zod로 쿼리 파라미터 검증 및 기본값 적용
    const validatedQuery = GetPostsQuerySchema.parse(queryParams);

    const result = await getAllPosts(validatedQuery);
    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: "Invalid query parameters", details: error.errors },
        { status: 400 }
      );
    }
    console.error("Error fetching posts:", error);
    return NextResponse.json(
      { error: "Failed to fetch posts" },
      { status: 500 }
    );
  }
}
