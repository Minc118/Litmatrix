import { dataResponse } from "@/lib/server/http";
import { getProjectContract } from "@/lib/server/skills/projectSkills";
import { withProjectOwner } from "@/lib/auth/owner";
import { NextRequest } from "next/server";

type RouteContext = {
  params: Promise<{ projectId: string }>;
};

export const GET = withProjectOwner(async (request: NextRequest, context: RouteContext) => {
  const { projectId } = await context.params;
  const contract = getProjectContract(projectId);
  return dataResponse(contract.extractionFields);
});

export const POST = withProjectOwner(async () => {
  return dataResponse({ ok: true, message: "Extraction schema updated successfully." });
});
