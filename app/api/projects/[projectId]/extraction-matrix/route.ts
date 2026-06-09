import { dataResponse } from "@/lib/server/http";
import { listProjectExtractionMatrixRows } from "@/lib/server/services/matrixService";
import { isKnownReviewStatus } from "@/lib/server/validators/litmatrixValidators";

type ProjectRouteContext = {
  params: Promise<{ projectId: string }>;
};

export async function GET(request: Request, context: ProjectRouteContext) {
  const { projectId } = await context.params;
  const searchParams = new URL(request.url).searchParams;
  const status = searchParams.get("status");

  return dataResponse(
    await listProjectExtractionMatrixRows(projectId, {
      paperId: searchParams.get("paperId"),
      status: isKnownReviewStatus(status) ? status : null,
    }),
  );
}
