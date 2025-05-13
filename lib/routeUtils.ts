// lib/routeUtils.ts
import { NextRequest, NextResponse } from "next/server";
import { z, ZodError, ZodSchema } from "zod";

/**
 * DELETE 요청 본문에서 currentPassword를 추출하고 유효성을 검사합니다.
 */
const DeletePayloadSchema = z.object({
  currentPassword: z
    .string()
    .min(1, "Current password is required for deletion."),
});

export async function extractPasswordForDelete(
  request: NextRequest
): Promise<{ currentPassword?: string; errorResponse?: NextResponse }> {
  let body;
  try {
    body = await request.json();
  } catch (e) {
    return {
      errorResponse: NextResponse.json(
        { error: "Invalid JSON body" },
        { status: 400 }
      ),
    };
  }

  try {
    const validated = DeletePayloadSchema.parse(body);
    return { currentPassword: validated.currentPassword };
  } catch (error) {
    if (error instanceof ZodError) {
      return {
        errorResponse: NextResponse.json(
          { error: "Invalid input for deletion", details: error.errors },
          { status: 400 }
        ),
      };
    }
    console.error("Unexpected error in extractPasswordForDelete:", error);
    return {
      errorResponse: NextResponse.json(
        { error: "Error processing request body for deletion" },
        { status: 500 }
      ),
    };
  }
}

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
  } catch (e) {
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
