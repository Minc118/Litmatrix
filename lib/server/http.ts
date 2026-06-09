import "server-only";

import { NextResponse } from "next/server";
import type { ApiError, ApiSuccess } from "@/lib/types/litmatrix";

export function dataResponse<T>(data: T, init?: ResponseInit): NextResponse<ApiSuccess<T>> {
  return NextResponse.json({ data }, init);
}

export function errorResponse(
  code: string,
  message: string,
  status = 400,
  details: Record<string, unknown> = {},
): NextResponse<ApiError> {
  return NextResponse.json(
    {
      error: {
        code,
        message,
        details,
      },
    },
    { status },
  );
}

export function demoModeReadOnlyResponse(message = "This skeleton route is read-only in demo mode.") {
  return errorResponse("DEMO_MODE_READ_ONLY", message, 403);
}
