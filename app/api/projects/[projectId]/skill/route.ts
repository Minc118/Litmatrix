import { dataResponse } from "@/lib/server/http";
import { getProjectSkillMarkdown } from "@/lib/server/skills/projectSkills";

type RouteContext = {
  params: Promise<{ projectId: string }>;
};

export async function GET(_request: Request, context: RouteContext) {
  const { projectId } = await context.params;
  const markdown = getProjectSkillMarkdown(projectId);
  return dataResponse({ markdown });
}

export async function POST(_request: Request, _context: RouteContext) {
  // Simulate editing the project skill
  return dataResponse({ ok: true, message: "Project skill updated successfully." });
}
