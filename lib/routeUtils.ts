import { NextRequest, NextResponse } from "next/server";
import { ZodError, ZodSchema } from "zod";

/**
 * 일반적인 요청 본문을 파싱하고 Zod 스키마로 유효성을 검사합니다 (주로 PUT 요청용).
 */
export async function parseAndValidateRequestBody<T>(
  request: NextRequest,
  schema: ZodSchema<T>
): Promise<{ data?: T; errorResponse?: NextResponse }> {
  let body;
  try {
    body = await request.json();
  } catch {
    return {
      errorResponse: NextResponse.json(
        { error: "Invalid JSON body" },
        { status: 400 }
      ),
    };
  }

  try {
    const validatedData = schema.parse(body);
    return { data: validatedData };
  } catch (error) {
    if (error instanceof ZodError) {
      return {
        errorResponse: NextResponse.json(
          { error: "Invalid input", details: error.errors },
          { status: 400 }
        ),
      };
    }
    console.error("Unexpected error in parseAndValidateRequestBody:", error);
    return {
      errorResponse: NextResponse.json(
        { error: "Error processing request body" },
        { status: 500 }
      ),
    };
  }
}
