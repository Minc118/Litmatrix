import "server-only";

import { and, eq, type SQL } from "drizzle-orm";
import { ocpmDemoReviewDecisions } from "@/lib/demo/ocpm-demo-data";
import {
  getMutationDbState,
  mutationUnavailableResult,
  withDatabaseReadFallback,
  type MutationResult,
} from "@/lib/server/db/fallback";
import { toReviewDecision } from "@/lib/server/db/mappers";
import { reviewDecisions } from "@/lib/server/db/schema";
import type { ReviewDecision } from "@/lib/types/litmatrix";

export async function listReviewDecisions(
  projectId: string,
  paperId?: string | null,
): Promise<ReviewDecision[]> {
  return withDatabaseReadFallback(
    async (db) => {
      const conditions: SQL[] = [eq(reviewDecisions.projectId, projectId)];
      if (paperId) {
        conditions.push(eq(reviewDecisions.paperId, paperId));
      }

      const rows = await db.select().from(reviewDecisions).where(and(...conditions));
      return rows.map(toReviewDecision);
    },
    () =>
      ocpmDemoReviewDecisions.filter(
        (decision) => decision.projectId === projectId && (!paperId || decision.paperId === paperId),
      ),
  );
}

export async function createReviewDecision(
  decision: ReviewDecision,
): Promise<MutationResult<ReviewDecision>> {
  const state = getMutationDbState();
  if (!state.ok) {
    return mutationUnavailableResult(state);
  }

  const [row] = await state.db
    .insert(reviewDecisions)
    .values({
      ...decision,
      paperId: decision.paperId ?? null,
      editedContent: decision.editedContent ?? null,
      reviewerNote: decision.reviewerNote ?? null,
      createdAt: new Date(decision.createdAt),
      updatedAt: new Date(decision.updatedAt),
    })
    .returning();

  return { ok: true, data: toReviewDecision(row) };
}
