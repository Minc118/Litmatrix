import { dataResponse } from "@/lib/server/http";
import { getProjectSkillMarkdown } from "@/lib/server/skills/projectSkills";
import { withProjectOwner } from "@/lib/auth/owner";
import { NextRequest } from "next/server";

type RouteContext = {
  params: Promise<{ projectId: string }>;
};

export const GET = withProjectOwner(async (_request: NextRequest, context: RouteContext) => {
  const { projectId } = await context.params;
  const markdown = getProjectSkillMarkdown(projectId);
  return dataResponse({ markdown });
});

export const POST = withProjectOwner(async () => {
  return dataResponse({ ok: true, message: "Project skill updated successfully." });
});
