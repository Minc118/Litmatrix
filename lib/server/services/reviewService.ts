import "server-only";

import * as reviewRepository from "@/lib/server/repositories/reviewRepository";

export async function listProjectReviewDecisions(projectId: string, paperId?: string | null) {
  return reviewRepository.listReviewDecisions(projectId, paperId);
}

export async function createReviewDecisionPlaceholder() {
  return {
    status: "read-only" as const,
    message: "Review mutations are not implemented in the skeleton phase.",
  };
}
