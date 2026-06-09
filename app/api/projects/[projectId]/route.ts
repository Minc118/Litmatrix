import { dataResponse, errorResponse } from "@/lib/server/http";
import { getProject } from "@/lib/server/services/projectService";

type ProjectRouteContext = {
  params: Promise<{ projectId: string }>;
};

export async function GET(_request: Request, context: ProjectRouteContext) {
  const { projectId } = await context.params;
  const project = await getProject(projectId);

  if (!project) {
    return errorResponse("NOT_FOUND", "Project not found.", 404);
  }

  return dataResponse(project);
}
