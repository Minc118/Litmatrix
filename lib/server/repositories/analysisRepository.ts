import "server-only";

import { ocpmDemoAISuggestions, ocpmDemoPaperOverviews } from "@/lib/demo/ocpm-demo-data";
import type { AISuggestion, PaperOverview, ReviewStatus } from "@/lib/types/litmatrix";

export async function listPaperOverviews(
  projectId: string,
  paperId?: string | null,
): Promise<PaperOverview[]> {
  return ocpmDemoPaperOverviews.filter(
    (overview) => overview.projectId === projectId && (!paperId || overview.paperId === paperId),
  );
}

export async function listAISuggestions(
  projectId: string,
  filters: {
    paperId?: string | null;
    suggestionType?: AISuggestion["suggestionType"] | null;
    status?: ReviewStatus | null;
  } = {},
): Promise<AISuggestion[]> {
  return ocpmDemoAISuggestions.filter((suggestion) => {
    if (suggestion.projectId !== projectId) {
      return false;
    }
    if (filters.paperId && suggestion.paperId !== filters.paperId) {
      return false;
    }
    if (filters.suggestionType && suggestion.suggestionType !== filters.suggestionType) {
      return false;
    }
    if (filters.status && suggestion.status !== filters.status) {
      return false;
    }
    return true;
  });
}
