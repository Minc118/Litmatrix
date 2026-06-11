import { dataResponse, errorResponse } from "@/lib/server/http";
import { listProjects, createProject } from "@/lib/server/services/projectService";
import { NextRequest } from "next/server";

export async function GET() {
  return dataResponse(await listProjects());
}

export async function POST(req: NextRequest) {
  try {
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
    });

    return dataResponse(project);
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Failed to create project";
    return errorResponse("SERVER_ERROR", msg, 500);
  }
}

