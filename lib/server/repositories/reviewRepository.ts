import "server-only";

import { ocpmDemoReviewDecisions } from "@/lib/demo/ocpm-demo-data";
import type { ReviewDecision } from "@/lib/types/litmatrix";

export async function listReviewDecisions(
  projectId: string,
  paperId?: string | null,
): Promise<ReviewDecision[]> {
  return ocpmDemoReviewDecisions.filter(
    (decision) => decision.projectId === projectId && (!paperId || decision.paperId === paperId),
  );
}
