import { dataResponse } from "@/lib/server/http";
import { listProjectSuggestions } from "@/lib/server/services/analysisService";
import { isKnownReviewStatus } from "@/lib/server/validators/litmatrixValidators";
import type { AISuggestion } from "@/lib/types/litmatrix";

type ProjectRouteContext = {
  params: Promise<{ projectId: string }>;
};

const suggestionTypes: AISuggestion["suggestionType"][] = [
  "paper-overview",
  "extraction-field",
  "theme",
  "gap",
  "argument",
  "innovation",
  "writing-plan",
  "presentation-plan",
];

export async function GET(request: Request, context: ProjectRouteContext) {
  const { projectId } = await context.params;
  const searchParams = new URL(request.url).searchParams;
  const status = searchParams.get("status");
  const suggestionType = searchParams.get("suggestionType");

  return dataResponse(
    await listProjectSuggestions(projectId, {
      paperId: searchParams.get("paperId"),
      status: isKnownReviewStatus(status) ? status : null,
      suggestionType: suggestionTypes.includes(suggestionType as AISuggestion["suggestionType"])
        ? (suggestionType as AISuggestion["suggestionType"])
        : null,
    }),
  );
}
