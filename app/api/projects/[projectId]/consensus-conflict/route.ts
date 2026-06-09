import { dataResponse } from "@/lib/server/http";
import { listProjectConsensusConflictItems } from "@/lib/server/services/synthesisService";

type ProjectRouteContext = {
  params: Promise<{ projectId: string }>;
};

export async function GET(_request: Request, context: ProjectRouteContext) {
  const { projectId } = await context.params;
  return dataResponse(await listProjectConsensusConflictItems(projectId));
}
