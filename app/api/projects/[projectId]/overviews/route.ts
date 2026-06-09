import { dataResponse } from "@/lib/server/http";
import { listProjectOverviews } from "@/lib/server/services/analysisService";

type ProjectRouteContext = {
  params: Promise<{ projectId: string }>;
};

export async function GET(request: Request, context: ProjectRouteContext) {
  const { projectId } = await context.params;
  const paperId = new URL(request.url).searchParams.get("paperId");
  return dataResponse(await listProjectOverviews(projectId, paperId));
}
