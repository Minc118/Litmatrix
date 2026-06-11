import "server-only";

import { and, eq, type SQL } from "drizzle-orm";
import { ocpmDemoAISuggestions, ocpmDemoPaperOverviews } from "@/lib/demo/ocpm-demo-data";
import {
  getMutationDbState,
  mutationUnavailableResult,
  type MutationResult,
} from "@/lib/server/db/fallback";
import { toAISuggestion, toPaperOverview } from "@/lib/server/db/mappers";
import { aiSuggestions, paperOverviews } from "@/lib/server/db/schema";
import { withDatabaseReadFallback } from "@/lib/server/db/fallback";
import type { AISuggestion, PaperOverview, ReviewStatus } from "@/lib/types/litmatrix";

export async function listPaperOverviews(
  projectId: string,
  paperId?: string | null,
): Promise<PaperOverview[]> {
  return withDatabaseReadFallback(
    async (db) => {
      const conditions: SQL[] = [eq(paperOverviews.projectId, projectId)];
      if (paperId) {
        conditions.push(eq(paperOverviews.paperId, paperId));
      }

      const rows = await db.select().from(paperOverviews).where(and(...conditions));
      return rows.map(toPaperOverview);
    },
    () =>
      ocpmDemoPaperOverviews.filter(
        (overview) => overview.projectId === projectId && (!paperId || overview.paperId === paperId),
      ),
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
  return withDatabaseReadFallback(
    async (db) => {
      const conditions: SQL[] = [eq(aiSuggestions.projectId, projectId)];
      if (filters.paperId) {
        conditions.push(eq(aiSuggestions.paperId, filters.paperId));
      }
      if (filters.suggestionType) {
        conditions.push(eq(aiSuggestions.suggestionType, filters.suggestionType));
      }
      if (filters.status) {
        conditions.push(eq(aiSuggestions.status, filters.status));
      }

      const rows = await db.select().from(aiSuggestions).where(and(...conditions));
      return rows.map(toAISuggestion);
    },
    () =>
      ocpmDemoAISuggestions.filter((suggestion) => {
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
      }),
  );
}

export async function getAISuggestionById(suggestionId: string): Promise<AISuggestion | null> {
  return withDatabaseReadFallback(
    async (db) => {
      const [row] = await db.select().from(aiSuggestions).where(eq(aiSuggestions.id, suggestionId));
      return row ? toAISuggestion(row) : null;
    },
    () => ocpmDemoAISuggestions.find((suggestion) => suggestion.id === suggestionId) ?? null,
  );
}

export async function updateAISuggestion(
  suggestionId: string,
  patch: Partial<Pick<AISuggestion, "status" | "content" | "title">>,
): Promise<MutationResult<AISuggestion | null>> {
  const state = getMutationDbState();
  if (!state.ok) {
    return mutationUnavailableResult(state);
  }

  const [row] = await state.db
    .update(aiSuggestions)
    .set({
      ...patch,
      updatedAt: new Date(),
    })
    .where(eq(aiSuggestions.id, suggestionId))
    .returning();

  return { ok: true, data: row ? toAISuggestion(row) : null };
}

export async function insertPaperOverview(overview: PaperOverview): Promise<MutationResult<PaperOverview>> {
  const state = getMutationDbState();
  if (!state.ok) {
    return mutationUnavailableResult(state);
  }

  const [row] = await state.db
    .insert(paperOverviews)
    .values({
      ...overview,
      createdAt: new Date(overview.createdAt),
      updatedAt: new Date(overview.updatedAt),
    })
    .onConflictDoUpdate({
      target: paperOverviews.id,
      set: {
        projectId: overview.projectId,
        paperId: overview.paperId,
        analysisSource: overview.analysisSource,
        evidenceLevel: overview.evidenceLevel,
        status: overview.status,
        confidence: overview.confidence,
        problem: overview.problem ?? null,
        objective: overview.objective ?? null,
        method: overview.method ?? null,
        dataset: overview.dataset ?? null,
        findings: overview.findings ?? null,
        limitations: overview.limitations ?? null,
        evidence: overview.evidence,
        updatedAt: new Date(),
      },
    })
    .returning();

  return { ok: true, data: toPaperOverview(row) };
}

export async function insertAISuggestions(suggestions: AISuggestion[]): Promise<MutationResult<AISuggestion[]>> {
  const state = getMutationDbState();
  if (!state.ok) {
    return mutationUnavailableResult(state);
  }

  if (suggestions.length === 0) {
    return { ok: true, data: [] };
  }

  const rows = await state.db
    .insert(aiSuggestions)
    .values(
      suggestions.map((suggestion) => ({
        ...suggestion,
        paperId: suggestion.paperId ?? null,
        targetField: suggestion.targetField ?? null,
        createdAt: new Date(suggestion.createdAt),
        updatedAt: new Date(suggestion.updatedAt),
      })),
    )
    .onConflictDoNothing()
    .returning();

  return { ok: true, data: rows.map(toAISuggestion) };
}

export async function upsertAISuggestions(suggestions: AISuggestion[]): Promise<MutationResult<AISuggestion[]>> {
  const state = getMutationDbState();
  if (!state.ok) {
    return mutationUnavailableResult(state);
  }

  if (suggestions.length === 0) {
    return { ok: true, data: [] };
  }

  const results: AISuggestion[] = [];
  for (const suggestion of suggestions) {
    const [row] = await state.db
      .insert(aiSuggestions)
      .values({
        id: suggestion.id,
        projectId: suggestion.projectId,
        paperId: suggestion.paperId ?? null,
        analysisSource: suggestion.analysisSource,
        evidenceLevel: suggestion.evidenceLevel,
        status: suggestion.status,
        confidence: suggestion.confidence,
        suggestionType: suggestion.suggestionType,
        title: suggestion.title,
        content: suggestion.content,
        targetField: suggestion.targetField ?? null,
        evidence: suggestion.evidence,
        createdAt: new Date(suggestion.createdAt),
        updatedAt: new Date(suggestion.updatedAt),
      })
      .onConflictDoUpdate({
        target: aiSuggestions.id,
        set: {
          title: suggestion.title,
          content: suggestion.content,
          targetField: suggestion.targetField ?? null,
          evidence: suggestion.evidence,
          confidence: suggestion.confidence,
          evidenceLevel: suggestion.evidenceLevel,
          status: suggestion.status,
          updatedAt: new Date(),
        },
      })
      .returning();
    if (row) {
      results.push(toAISuggestion(row));
    }
  }

  return { ok: true, data: results };
}
