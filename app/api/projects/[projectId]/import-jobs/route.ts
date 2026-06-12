import { dataResponse } from "@/lib/server/http";
import { listProjectImportJobs } from "@/lib/server/services/importService";
import { withProjectOwner } from "@/lib/auth/owner";
import { NextRequest } from "next/server";

type ProjectRouteContext = {
  params: Promise<{ projectId: string }>;
};

export const GET = withProjectOwner(async (request: NextRequest, context: ProjectRouteContext) => {
  const { projectId } = await context.params;
  const jobs = await listProjectImportJobs(projectId);
  return dataResponse(jobs);
});
