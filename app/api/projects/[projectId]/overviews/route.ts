import { dataResponse } from "@/lib/server/http";
import { listProjectOverviews } from "@/lib/server/services/analysisService";
import { withProjectOwner } from "@/lib/auth/owner";
import { NextRequest } from "next/server";

type ProjectRouteContext = {
  params: Promise<{ projectId: string }>;
};

export const GET = withProjectOwner(async (request: NextRequest, context: ProjectRouteContext) => {
  const { projectId } = await context.params;
  const paperId = new URL(request.url).searchParams.get("paperId");
  return dataResponse(await listProjectOverviews(projectId, paperId));
});
