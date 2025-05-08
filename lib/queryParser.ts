/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";

export type QueryParams = {
  page?: number;
  limit?: number;
  search?: string;
  sort?: string;
  order?: "asc" | "desc";
  filters?: Record<string, any>;
};

/**
 * 검색 파라미터를 파싱하는 유틸리티 함수
 */
export function parseSearchParams(
  searchParams: URLSearchParams
): Record<string, any> {
  const params: Record<string, any> = {};

  searchParams.forEach((value, key) => {
    // 숫자로 변환 가능한지 확인
    if (!isNaN(Number(value)) && value.trim() !== "") {
      params[key] = Number(value);
    } else if (value.toLowerCase() === "true") {
      params[key] = true;
    } else if (value.toLowerCase() === "false") {
      params[key] = false;
    } else {
      // JSON 파싱 시도
      try {
        params[key] = JSON.parse(value);
      } catch {
        // 실패하면 원래 문자열 사용
        params[key] = value;
      }
    }
  });

  return params;
}

/**
 * 쿼리 객체를 생성하는 함수
 */
export function buildQueryObject(params: Record<string, any>): QueryParams {
  // 기본 쿼리 객체 생성
  const query: QueryParams = {
    page: params?.page,
    limit: params?.limit || 10,
    search: params?.search || "",
    sort: params?.sort || "createdDatetime",
    order: (params?.order || "desc") as "asc" | "desc",
    // 필터 객체 생성
    filters: { ...params },
  };

  // 페이징/정렬 관련 필드 제거
  const specialFields = ["page", "limit", "search", "sort", "order"];
  specialFields.forEach((field) => delete query.filters?.[field]);

  // filters 객체가 비어있으면 undefined로 설정
  if (query.filters && Object.keys(query.filters).length === 0) {
    query.filters = undefined;
  }

  return query;
}

type ApiListHandler<T> = (query: QueryParams) => Promise<T>;
type ApiPostHandler<T, U> = (data: T) => Promise<U>;
type ApiIdHandler<T> = (id: string) => Promise<T>;
type ApiUpdateHandler<T, U> = (id: string, data: T) => Promise<U>;
type ApiDeleteHandler = (id: string) => Promise<void>;

/**
 * GET 요청을 처리하는 제네릭 핸들러
 */
export function createListHandler<T>(serviceHandler: ApiListHandler<T>) {
  return async function GET(req: NextRequest) {
    try {
      const { searchParams } = req.nextUrl;
      const params = parseSearchParams(searchParams);
      const query = buildQueryObject(params);

      const result = await serviceHandler(query);
      return NextResponse.json(result);
    } catch (error) {
      console.error("API 오류:", error);
      return NextResponse.json(
        { error: error instanceof Error ? error.message : "Unknown error" },
        { status: 500 }
      );
    }
  };
}

/**
 * POST 요청을 처리하는 제네릭 핸들러
 */
export function createPostHandler<T, U>(serviceHandler: ApiPostHandler<T, U>) {
  return async function POST(req: NextRequest) {
    try {
      const data = (await req.json()) as T;
      const result = await serviceHandler(data);
      return NextResponse.json(result, { status: 201 });
    } catch (error) {
      console.error("API 오류:", error);
      return NextResponse.json(
        { error: error instanceof Error ? error.message : "Unknown error" },
        { status: 500 }
      );
    }
  };
}

/**
 * 단일 항목 GET 요청을 처리하는 핸들러
 */
export function createGetByIdHandler<T>(serviceHandler: ApiIdHandler<T>) {
  return async function GET(
    req: NextRequest,
    context: { params: { id: string } }
  ) {
    try {
      const { id } = context.params;
      if (!id) {
        return NextResponse.json(
          { error: "ID가 필요합니다." },
          { status: 400 }
        );
      }

      const result = await serviceHandler(id);
      return NextResponse.json(result);
    } catch (error) {
      console.error("API 오류:", error);
      if (error instanceof Error && error.message.includes("not found")) {
        return NextResponse.json(
          { error: "리소스를 찾을 수 없습니다." },
          { status: 404 }
        );
      }
      return NextResponse.json(
        { error: error instanceof Error ? error.message : "Unknown error" },
        { status: 500 }
      );
    }
  };
}

/**
 * 단일 항목 PUT 요청을 처리하는 핸들러
 */
export function createPutHandler<T, U>(serviceHandler: ApiUpdateHandler<T, U>) {
  return async function PUT(
    req: NextRequest,
    context: { params: { id: string } }
  ) {
    try {
      const { id } = context.params;
      if (!id) {
        return NextResponse.json(
          { error: "ID가 필요합니다." },
          { status: 400 }
        );
      }

      const data = (await req.json()) as T;
      const result = await serviceHandler(id, data);
      return NextResponse.json(result);
    } catch (error) {
      console.error("API 오류:", error);
      if (error instanceof Error && error.message.includes("not found")) {
        return NextResponse.json(
          { error: "리소스를 찾을 수 없습니다." },
          { status: 404 }
        );
      }
      return NextResponse.json(
        { error: error instanceof Error ? error.message : "Unknown error" },
        { status: 500 }
      );
    }
  };
}

/**
 * 단일 항목 PATCH 요청을 처리하는 핸들러
 */
export function createPatchHandler<T, U>(
  serviceHandler: ApiUpdateHandler<T, U>
) {
  return async function PATCH(
    req: NextRequest,
    context: { params: { id: string } }
  ) {
    try {
      const { id } = context.params;
      if (!id) {
        return NextResponse.json(
          { error: "ID가 필요합니다." },
          { status: 400 }
        );
      }

      const data = (await req.json()) as T;
      const result = await serviceHandler(id, data);
      return NextResponse.json(result);
    } catch (error) {
      console.error("API 오류:", error);
      if (error instanceof Error && error.message.includes("not found")) {
        return NextResponse.json(
          { error: "리소스를 찾을 수 없습니다." },
          { status: 404 }
        );
      }
      return NextResponse.json(
        { error: error instanceof Error ? error.message : "Unknown error" },
        { status: 500 }
      );
    }
  };
}

/**
 * 단일 항목 DELETE 요청을 처리하는 핸들러
 */
export function createDeleteHandler(serviceHandler: ApiDeleteHandler) {
  return async function DELETE(
    req: NextRequest,
    context: { params: { id: string } }
  ) {
    try {
      const { id } = context.params;
      if (!id) {
        return NextResponse.json(
          { error: "ID가 필요합니다." },
          { status: 400 }
        );
      }

      await serviceHandler(id);
      return NextResponse.json({ success: true }, { status: 200 });
    } catch (error) {
      console.error("API 오류:", error);
      if (error instanceof Error && error.message.includes("not found")) {
        return NextResponse.json(
          { error: "리소스를 찾을 수 없습니다." },
          { status: 404 }
        );
      }
      return NextResponse.json(
        { error: error instanceof Error ? error.message : "Unknown error" },
        { status: 500 }
      );
    }
  };
}
