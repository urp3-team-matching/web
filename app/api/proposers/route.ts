import { getAllProposers } from "@/services/proposer";
import { GetProposersQuerySchema } from "@/types/proposer";
import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";
// import { createStandaloneProposer } from '@/services/proposerService'; // 독립 생성 필요시 주석 해제
// import { CreateProposerSchema } from '@/types/proposerTypes'; // 독립 생성 필요시 주석 해제
// import { parseAndValidateRequestBody } from '@/lib/routeUtils'; // 독립 생성 필요시 주석 해제
// import { NotFoundError } from '@/lib/authUtils'; // 독립 생성 필요시 주석 해제

// POST 핸들러 (일반적이지 않으므로 주석 처리 또는 삭제 권장)
/*
export async function POST(request: NextRequest) {
  try {
    const { data: validatedData, errorResponse } = await parseAndValidateRequestBody(request, CreateProposerSchema);
    if (errorResponse) return errorResponse;
    if (!validatedData) throw new Error("Validated data is unexpectedly undefined.");

    const proposer = await createStandaloneProposer(validatedData);
    return NextResponse.json(proposer, { status: 201 });
  } catch (error) {
    if (error instanceof NotFoundError) return NextResponse.json({ error: error.message }, { status: 404 }); // 연결할 프로젝트 없음
     if (error instanceof Error && error.message.includes('already exists for project')) {
         return NextResponse.json({ error: error.message }, { status: 409 }); // Conflict
     }
     if (error instanceof Error && error.message.includes('integrity error')) {
        return NextResponse.json({ error: 'Server integrity error while creating proposer.' }, { status: 500 });
    }
    console.error("Error creating standalone proposer:", error);
    return NextResponse.json({ error: 'Failed to create proposer' }, { status: 500 });
  }
}
*/

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const queryParams = Object.fromEntries(searchParams.entries());

    const validatedQuery = GetProposersQuerySchema.parse(queryParams);

    const result = await getAllProposers(validatedQuery);
    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: "Invalid query parameters", details: error.errors },
        { status: 400 }
      );
    }
    console.error("Error fetching proposers:", error);
    return NextResponse.json(
      { error: "Failed to fetch proposers" },
      { status: 500 }
    );
  }
}
