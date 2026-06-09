import "server-only";

import * as analysisRepository from "@/lib/server/repositories/analysisRepository";
import type { AISuggestion, ReviewStatus } from "@/lib/types/litmatrix";

export async function listProjectOverviews(projectId: string, paperId?: string | null) {
  return analysisRepository.listPaperOverviews(projectId, paperId);
}

export async function listProjectSuggestions(
  projectId: string,
  filters: {
    paperId?: string | null;
    suggestionType?: AISuggestion["suggestionType"] | null;
    status?: ReviewStatus | null;
  } = {},
) {
  return analysisRepository.listAISuggestions(projectId, filters);
}

export async function requestOverviewAnalysisPlaceholder() {
  return {
    status: "not-implemented" as const,
    message: "Overview analysis providers are intentionally disabled in the skeleton phase.",
  };
}
