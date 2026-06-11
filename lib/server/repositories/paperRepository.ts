import "server-only";

import { and, eq } from "drizzle-orm";
import { ocpmDemoPapers } from "@/lib/demo/ocpm-demo-data";
import {
  getMutationDbState,
  mutationUnavailableResult,
  withDatabaseReadFallback,
  type MutationResult,
} from "@/lib/server/db/fallback";
import { toPaper } from "@/lib/server/db/mappers";
import { papers } from "@/lib/server/db/schema";
import type { Paper } from "@/lib/types/litmatrix";

export async function listPapersByProjectId(projectId: string): Promise<Paper[]> {
  return withDatabaseReadFallback(
    async (db) => {
      const rows = await db.select().from(papers).where(eq(papers.projectId, projectId));
      return rows.map(toPaper);
    },
    () => ocpmDemoPapers.filter((paper) => paper.projectId === projectId),
  );
}

export async function getPaperById(projectId: string, paperId: string): Promise<Paper | null> {
  return withDatabaseReadFallback(
    async (db) => {
      const [row] = await db
        .select()
        .from(papers)
        .where(and(eq(papers.projectId, projectId), eq(papers.id, paperId)));

      return row ? toPaper(row) : null;
    },
    () => ocpmDemoPapers.find((paper) => paper.projectId === projectId && paper.id === paperId) ?? null,
  );
}

export async function upsertPapers(papersList: Paper[]): Promise<MutationResult<Paper[]>> {
  const state = getMutationDbState();
  if (!state.ok) {
    return mutationUnavailableResult(state);
  }

  if (papersList.length === 0) {
    return { ok: true, data: [] };
  }

  const results: Paper[] = [];
  for (const paper of papersList) {
    const [row] = await state.db
      .insert(papers)
      .values({
        id: paper.id,
        projectId: paper.projectId,
        title: paper.title,
        authors: paper.authors ?? [],
        year: paper.year ?? null,
        venue: paper.venue ?? null,
        doi: paper.doi ?? null,
        url: paper.url ?? null,
        abstract: paper.abstract ?? null,
        zoteroItemKey: paper.zoteroItemKey ?? null,
        pdfFileId: paper.pdfFileId ?? null,
        tags: paper.tags ?? [],
        createdAt: new Date(paper.createdAt),
        updatedAt: new Date(paper.updatedAt),
      })
      .onConflictDoUpdate({
        target: papers.id,
        set: {
          title: paper.title,
          authors: paper.authors ?? [],
          year: paper.year ?? null,
          venue: paper.venue ?? null,
          doi: paper.doi ?? null,
          url: paper.url ?? null,
          abstract: paper.abstract ?? null,
          zoteroItemKey: paper.zoteroItemKey ?? null,
          pdfFileId: paper.pdfFileId ?? null,
          tags: paper.tags ?? [],
          updatedAt: new Date(),
        },
      })
      .returning();

    if (row) {
      results.push(toPaper(row));
    }
  }

  return { ok: true, data: results };
}
