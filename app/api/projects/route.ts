import { dataResponse, demoModeReadOnlyResponse } from "@/lib/server/http";
import { listProjects } from "@/lib/server/services/projectService";

export async function GET() {
  return dataResponse(await listProjects());
}

export async function POST() {
  return demoModeReadOnlyResponse("Project creation is not implemented in the skeleton phase.");
}
