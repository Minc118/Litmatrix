import "server-only";

import { and, eq } from "drizzle-orm";
import { ocpmDemoPapers } from "@/lib/demo/ocpm-demo-data";
import { withDatabaseReadFallback } from "@/lib/server/db/fallback";
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
