import { dataResponse } from "@/lib/server/http";
import { getProjectContract } from "@/lib/server/skills/projectSkills";

type RouteContext = {
  params: Promise<{ projectId: string }>;
};

export async function GET(_request: Request, context: RouteContext) {
  const { projectId } = await context.params;
  const contract = getProjectContract(projectId);
  return dataResponse(contract.commandPack);
}

export async function POST(_request: Request, _context: RouteContext) {
  return dataResponse({ ok: true, message: "Command pack updated successfully." });
}
