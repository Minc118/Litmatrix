import { dataResponse } from "@/lib/server/http";
import { getProjectWritingPlan } from "@/lib/server/services/synthesisService";
import { withProjectOwner } from "@/lib/auth/owner";
import { NextRequest } from "next/server";

type ProjectRouteContext = {
  params: Promise<{ projectId: string }>;
};

export const GET = withProjectOwner(async (_request: NextRequest, context: ProjectRouteContext) => {
  const { projectId } = await context.params;
  return dataResponse(await getProjectWritingPlan(projectId));
});
