export const dynamic = "force-dynamic";

import { dataResponse, errorResponse } from "@/lib/server/http";
import { listProjects, createProject } from "@/lib/server/services/projectService";
import { NextRequest } from "next/server";
import { auth } from "@/lib/auth/server";

export async function GET() {
  const { data: session } = await auth.getSession();
  const userId = session?.user?.id || null;
  return dataResponse(await listProjects(userId));
}

export async function POST(req: NextRequest) {
  try {
    const { data: session } = await auth.getSession();
    const userId = session?.user?.id || null;
    const email = session?.user?.email;

    // Signup Allowlist check
    if (process.env.AUTH_ALLOWLIST_ENABLED === "true") {
      const allowedEmails = (process.env.AUTH_ALLOWED_EMAILS || "")
        .split(",")
        .map((e) => e.trim().toLowerCase())
        .filter(Boolean);

      if (!email || !allowedEmails.includes(email.toLowerCase())) {
        return errorResponse("FORBIDDEN", "Your email is not on the allowlist for creating projects.", 403);
      }
    }

    const body = await req.json();
    const { title, topic, reviewType, writingGoal, researchQuestions, extractionFields } = body;

    if (!title || !topic) {
      return errorResponse("INVALID_INPUT", "Title and topic are required.", 400);
    }

    const project = await createProject({
      title,
      topic,
      reviewType: reviewType || "Systematic Literature Review",
      writingGoal: writingGoal || "Survey Paper",
      researchQuestions: researchQuestions || [],
      extractionFields: extractionFields || [],
    }, userId);

    return dataResponse(project);
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Failed to create project";
    return errorResponse("SERVER_ERROR", msg, 500);
  }
}

