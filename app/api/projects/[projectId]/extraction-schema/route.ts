import { dataResponse } from "@/lib/server/http";
import { getProjectContract } from "@/lib/server/skills/projectSkills";

type RouteContext = {
  params: Promise<{ projectId: string }>;
};

export async function GET(_request: Request, context: RouteContext) {
  const { projectId } = await context.params;
  const contract = getProjectContract(projectId);
  return dataResponse(contract.extractionFields);
}

export async function POST() {
  return dataResponse({ ok: true, message: "Extraction schema updated successfully." });
}
