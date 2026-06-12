export const dynamic = "force-dynamic";

import { dataResponse, errorResponse } from "@/lib/server/http";
import { getProject } from "@/lib/server/services/projectService";
import { verifyProjectOwner } from "@/lib/auth/owner";

type ProjectRouteContext = {
  params: Promise<{ projectId: string }>;
};

export async function GET(_request: Request, context: ProjectRouteContext) {
  const { projectId } = await context.params;
  const verify = await verifyProjectOwner(projectId);

  if (!verify.authorized) {
    return errorResponse(verify.code!, verify.message!, verify.status!);
  }

  const project = await getProject(projectId);
  if (!project) {
    return errorResponse("NOT_FOUND", "Project not found.", 404);
  }

  return dataResponse(project);
}
