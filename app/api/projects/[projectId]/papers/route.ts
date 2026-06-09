import { dataResponse, demoModeReadOnlyResponse } from "@/lib/server/http";
import { listProjectPapers } from "@/lib/server/services/paperService";

type ProjectRouteContext = {
  params: Promise<{ projectId: string }>;
};

export async function GET(_request: Request, context: ProjectRouteContext) {
  const { projectId } = await context.params;
  return dataResponse(await listProjectPapers(projectId));
}

export async function POST() {
  return demoModeReadOnlyResponse("Paper creation/import is not implemented in the skeleton phase.");
}
