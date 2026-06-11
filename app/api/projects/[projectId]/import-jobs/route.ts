import { dataResponse } from "@/lib/server/http";
import { listProjectImportJobs } from "@/lib/server/services/importService";

type ProjectRouteContext = {
  params: Promise<{ projectId: string }>;
};

export async function GET(request: Request, context: ProjectRouteContext) {
  const { projectId } = await context.params;
  const jobs = await listProjectImportJobs(projectId);
  return dataResponse(jobs);
}
