import { dataResponse } from "@/lib/server/http";
import { listProjectExtractionMatrixRows } from "@/lib/server/services/matrixService";
import { isKnownReviewStatus } from "@/lib/server/validators/litmatrixValidators";
import { withProjectOwner } from "@/lib/auth/owner";
import { NextRequest } from "next/server";

type ProjectRouteContext = {
  params: Promise<{ projectId: string }>;
};

export const GET = withProjectOwner(async (request: NextRequest, context: ProjectRouteContext) => {
  const { projectId } = await context.params;
  const searchParams = new URL(request.url).searchParams;
  const status = searchParams.get("status");

  return dataResponse(
    await listProjectExtractionMatrixRows(projectId, {
      paperId: searchParams.get("paperId"),
      status: isKnownReviewStatus(status) ? status : null,
    }),
  );
});
