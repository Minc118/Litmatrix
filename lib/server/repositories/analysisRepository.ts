import "server-only";

import { and, eq, type SQL } from "drizzle-orm";
import { ocpmDemoAISuggestions, ocpmDemoPaperOverviews } from "@/lib/demo/ocpm-demo-data";
import {
  getMutationDbState,
  type MutationResult,
} from "@/lib/server/db/fallback";
import { toAISuggestion, toPaperOverview } from "@/lib/server/db/mappers";
import { aiSuggestions, paperOverviews } from "@/lib/server/db/schema";
import { withDatabaseReadFallback } from "@/lib/server/db/fallback";
import type { AISuggestion, PaperOverview, ReviewStatus } from "@/lib/types/litmatrix";

const globalForAnalysis = globalThis as unknown as {
  inMemoryOverviews?: Map<string, PaperOverview[]>;
  inMemorySuggestions?: Map<string, AISuggestion[]>;
};

const inMemoryOverviews = globalForAnalysis.inMemoryOverviews ?? new Map<string, PaperOverview[]>();
const inMemorySuggestions = globalForAnalysis.inMemorySuggestions ?? new Map<string, AISuggestion[]>();

if (process.env.NODE_ENV !== "production") {
  globalForAnalysis.inMemoryOverviews = inMemoryOverviews;
  globalForAnalysis.inMemorySuggestions = inMemorySuggestions;
}

export async function listPaperOverviews(
  projectId: string,
  paperId?: string | null,
): Promise<PaperOverview[]> {
  const dbOverviews = await withDatabaseReadFallback(
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

  const local = inMemoryOverviews.get(projectId) ?? [];
  const filteredLocal = paperId ? local.filter((o) => o.paperId === paperId) : local;

  const merged = [...dbOverviews];
  for (const lo of filteredLocal) {
    if (!merged.some((o) => o.id === lo.id)) {
      merged.push(lo);
    }
  }
  return merged;
}

export async function listAISuggestions(
  projectId: string,
  filters: {
    paperId?: string | null;
    suggestionType?: AISuggestion["suggestionType"] | null;
    status?: ReviewStatus | null;
  } = {},
): Promise<AISuggestion[]> {
  const dbSuggestions = await withDatabaseReadFallback(
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

  const local = inMemorySuggestions.get(projectId) ?? [];
  const filteredLocal = local.filter((suggestion) => {
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

  const merged = [...dbSuggestions];
  for (const ls of filteredLocal) {
    if (!merged.some((s) => s.id === ls.id)) {
      merged.push(ls);
    }
  }
  return merged;
}

export async function getAISuggestionById(suggestionId: string): Promise<AISuggestion | null> {
  for (const list of inMemorySuggestions.values()) {
    const found = list.find((s) => s.id === suggestionId);
    if (found) {
      return found;
    }
  }

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
  let foundLocal: AISuggestion | null = null;
  for (const [projectId, list] of inMemorySuggestions.entries()) {
    const idx = list.findIndex((s) => s.id === suggestionId);
    if (idx !== -1) {
      const updated = {
        ...list[idx],
        ...patch,
        updatedAt: new Date().toISOString(),
      };
      list[idx] = updated;
      inMemorySuggestions.set(projectId, list);
      foundLocal = updated;
    }
  }

  const state = getMutationDbState();
  if (!state.ok) {
    if (foundLocal) {
      return { ok: true, data: foundLocal };
    }
    const demoSuggestion = ocpmDemoAISuggestions.find((s) => s.id === suggestionId);
    if (demoSuggestion) {
      const updated = {
        ...demoSuggestion,
        ...patch,
        updatedAt: new Date().toISOString(),
      };
      const localList = inMemorySuggestions.get(demoSuggestion.projectId) ?? [];
      const filtered = localList.filter((s) => s.id !== suggestionId);
      filtered.push(updated);
      inMemorySuggestions.set(demoSuggestion.projectId, filtered);
      return { ok: true, data: updated };
    }
    return { ok: true, data: null };
  }

  try {
    const [row] = await state.db
      .update(aiSuggestions)
      .set({
        ...patch,
        updatedAt: new Date(),
      })
      .where(eq(aiSuggestions.id, suggestionId))
      .returning();

    return { ok: true, data: row ? toAISuggestion(row) : null };
  } catch (err) {
    console.error("DB write failed in updateAISuggestion, using in-memory only:", err);
    return { ok: true, data: foundLocal };
  }
}

export async function insertPaperOverview(overview: PaperOverview): Promise<MutationResult<PaperOverview>> {
  const localList = inMemoryOverviews.get(overview.projectId) ?? [];
  const filtered = localList.filter((o) => o.id !== overview.id);
  filtered.push(overview);
  inMemoryOverviews.set(overview.projectId, filtered);

  const state = getMutationDbState();
  if (!state.ok) {
    return { ok: true, data: overview };
  }

  try {
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
  } catch (err) {
    console.error("DB write failed in insertPaperOverview, using in-memory only:", err);
    return { ok: true, data: overview };
  }
}

export async function insertAISuggestions(suggestions: AISuggestion[]): Promise<MutationResult<AISuggestion[]>> {
  return upsertAISuggestions(suggestions);
}

export async function upsertAISuggestions(suggestionsList: AISuggestion[]): Promise<MutationResult<AISuggestion[]>> {
  if (suggestionsList.length === 0) {
    return { ok: true, data: [] };
  }

  for (const suggestion of suggestionsList) {
    const localList = inMemorySuggestions.get(suggestion.projectId) ?? [];
    const filtered = localList.filter((s) => s.id !== suggestion.id);
    filtered.push(suggestion);
    inMemorySuggestions.set(suggestion.projectId, filtered);
  }

  const state = getMutationDbState();
  if (!state.ok) {
    return { ok: true, data: suggestionsList };
  }

  try {
    const results: AISuggestion[] = [];
    for (const suggestion of suggestionsList) {
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
  } catch (err) {
    console.error("DB write failed in upsertAISuggestions, using in-memory only:", err);
    return { ok: true, data: suggestionsList };
  }
}

