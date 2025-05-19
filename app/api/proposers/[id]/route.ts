import { NotFoundError, UnauthorizedError } from "@/lib/authUtils";
import {
  extractPasswordForDelete,
  parseAndValidateRequestBody,
} from "@/lib/routeUtils";
import {
  deleteProposer,
  getProposerById,
  updateProposer,
} from "@/services/proposer";
import { UpdateProposerSchema } from "@/types/proposer";
import { NextRequest, NextResponse } from "next/server";

interface RouteContext {
  params: { id: string };
}

export async function GET(request: NextRequest, { params }: RouteContext) {
  try {
    const proposerId = parseInt(params.id, 10);
    if (isNaN(proposerId))
      return NextResponse.json(
        { error: "Invalid proposer ID format" },
        { status: 400 }
      );

    const proposer = await getProposerById(proposerId);
    if (!proposer)
      return NextResponse.json(
        { error: "Proposer not found" },
        { status: 404 }
      );
    return NextResponse.json(proposer);
  } catch (error) {
    console.error(`Error fetching proposer ${params.id}:`, error);
    return NextResponse.json(
      { error: "Failed to fetch proposer" },
      { status: 500 }
    );
  }
}

// 독립적인 Proposer 업데이트 API (필요한 경우)
export async function PUT(request: NextRequest, { params }: RouteContext) {
  try {
    const proposerId = parseInt(params.id, 10);
    if (isNaN(proposerId))
      return NextResponse.json(
        { error: "Invalid proposer ID format" },
        { status: 400 }
      );

    const { data: validatedData, errorResponse } =
      await parseAndValidateRequestBody(request, UpdateProposerSchema);
    if (errorResponse) return errorResponse;
    if (!validatedData)
      throw new Error("Validated data is unexpectedly undefined.");

    if (
      Object.keys(validatedData).length <= 1 &&
      validatedData.currentPassword
    ) {
      return NextResponse.json(
        { error: "No update data provided beyond current password" },
        { status: 400 }
      );
    }

    const proposer = await updateProposer(proposerId, validatedData);
    return NextResponse.json(proposer);
  } catch (error) {
    if (error instanceof UnauthorizedError)
      return NextResponse.json({ error: error.message }, { status: 403 });
    if (error instanceof NotFoundError)
      return NextResponse.json({ error: error.message }, { status: 404 });
    console.error(`Error updating proposer ${params.id}:`, error);
    if (error instanceof Error && error.message.includes("integrity error")) {
      return NextResponse.json(
        { error: "Server integrity error while updating proposer." },
        { status: 500 }
      );
    }
    return NextResponse.json(
      { error: "Failed to update proposer" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, { params }: RouteContext) {
  try {
    const proposerId = parseInt(params.id, 10);
    if (isNaN(proposerId))
      return NextResponse.json(
        { error: "Invalid proposer ID format" },
        { status: 400 }
      );

    const { currentPassword, errorResponse } = await extractPasswordForDelete(
      request
    );
    if (errorResponse) return errorResponse;
    if (!currentPassword)
      throw new UnauthorizedError("Current password is required for deletion.");

    await deleteProposer(proposerId, currentPassword);
    return NextResponse.json(null, { status: 204 });
  } catch (error) {
    if (error instanceof UnauthorizedError)
      return NextResponse.json({ error: error.message }, { status: 403 });
    if (error instanceof NotFoundError)
      return NextResponse.json({ error: error.message }, { status: 404 });
    console.error(`Error deleting proposer ${params.id}:`, error);
    if (error instanceof Error && error.message.includes("integrity error")) {
      return NextResponse.json(
        { error: "Server integrity error while deleting proposer." },
        { status: 500 }
      );
    }
    return NextResponse.json(
      { error: "Failed to delete proposer" },
      { status: 500 }
    );
  }
}
