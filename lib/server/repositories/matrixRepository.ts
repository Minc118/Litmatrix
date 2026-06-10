import "server-only";

import { and, eq, type SQL } from "drizzle-orm";
import { ocpmDemoExtractionMatrixRows } from "@/lib/demo/ocpm-demo-data";
import {
  getMutationDbState,
  mutationUnavailableResult,
  withDatabaseReadFallback,
  type MutationResult,
} from "@/lib/server/db/fallback";
import { toExtractionMatrixRow } from "@/lib/server/db/mappers";
import { extractionMatrixRows } from "@/lib/server/db/schema";
import type { ExtractionMatrixRow, ReviewStatus } from "@/lib/types/litmatrix";

export async function listExtractionMatrixRows(
  projectId: string,
  filters: { paperId?: string | null; status?: ReviewStatus | null } = {},
): Promise<ExtractionMatrixRow[]> {
  return withDatabaseReadFallback(
    async (db) => {
      const conditions: SQL[] = [eq(extractionMatrixRows.projectId, projectId)];
      if (filters.paperId) {
        conditions.push(eq(extractionMatrixRows.paperId, filters.paperId));
      }
      if (filters.status) {
        conditions.push(eq(extractionMatrixRows.status, filters.status));
      }

      const rows = await db.select().from(extractionMatrixRows).where(and(...conditions));
      return rows.map(toExtractionMatrixRow);
    },
    () =>
      ocpmDemoExtractionMatrixRows.filter((row) => {
        if (row.projectId !== projectId) {
          return false;
        }
        if (filters.paperId && row.paperId !== filters.paperId) {
          return false;
        }
        if (filters.status && row.status !== filters.status) {
          return false;
        }
        return true;
      }),
  );
}

export async function getExtractionMatrixRowById(rowId: string): Promise<ExtractionMatrixRow | null> {
  return withDatabaseReadFallback(
    async (db) => {
      const [row] = await db.select().from(extractionMatrixRows).where(eq(extractionMatrixRows.id, rowId));
      return row ? toExtractionMatrixRow(row) : null;
    },
    () => ocpmDemoExtractionMatrixRows.find((row) => row.id === rowId) ?? null,
  );
}

export async function updateExtractionMatrixRow(
  rowId: string,
  patch: Pick<ExtractionMatrixRow, "confirmedValue" | "status">,
): Promise<MutationResult<ExtractionMatrixRow | null>> {
  const state = getMutationDbState();
  if (!state.ok) {
    return mutationUnavailableResult(state);
  }

  const [row] = await state.db
    .update(extractionMatrixRows)
    .set({
      confirmedValue: patch.confirmedValue,
      status: patch.status,
      updatedAt: new Date(),
    })
    .where(eq(extractionMatrixRows.id, rowId))
    .returning();

  return { ok: true, data: row ? toExtractionMatrixRow(row) : null };
}

export async function upsertExtractionMatrixRowFromSuggestion(
  row: ExtractionMatrixRow,
): Promise<MutationResult<ExtractionMatrixRow>> {
  const state = getMutationDbState();
  if (!state.ok) {
    return mutationUnavailableResult(state);
  }

  const [savedRow] = await state.db
    .insert(extractionMatrixRows)
    .values({
      ...row,
      createdAt: new Date(row.createdAt),
      updatedAt: new Date(row.updatedAt),
    })
    .onConflictDoUpdate({
      target: extractionMatrixRows.id,
      set: {
        confirmedValue: row.confirmedValue,
        confirmedByDecisionId: row.confirmedByDecisionId ?? null,
        status: row.status,
        updatedAt: new Date(),
      },
    })
    .returning();

  return { ok: true, data: toExtractionMatrixRow(savedRow) };
}
