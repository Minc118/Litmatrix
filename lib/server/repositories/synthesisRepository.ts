import "server-only";

import { eq } from "drizzle-orm";
import {
  ocpmDemoArgumentCandidates,
  ocpmDemoConsensusConflictItems,
  ocpmDemoGapItems,
  ocpmDemoInnovationOpportunities,
  ocpmDemoPresentationPlan,
  ocpmDemoThemeClusters,
  ocpmDemoWritingPlan,
} from "@/lib/demo/ocpm-demo-data";
import {
  getMutationDbState,
  mutationUnavailableResult,
  withDatabaseReadFallback,
  type MutationResult,
} from "@/lib/server/db/fallback";
import {
  toArgumentCandidate,
  toConsensusConflictItem,
  toGapItem,
  toInnovationOpportunity,
  toPresentationPlan,
  toThemeCluster,
  toWritingPlan,
} from "@/lib/server/db/mappers";
import {
  argumentCandidates,
  consensusConflictItems,
  gapItems,
  innovationOpportunities,
  presentationPlans,
  themeClusters,
  writingPlans,
} from "@/lib/server/db/schema";
import type {
  ArgumentCandidate,
  ConsensusConflictItem,
  GapItem,
  InnovationOpportunity,
  PresentationPlan,
  ThemeCluster,
  WritingPlan,
} from "@/lib/types/litmatrix";

export async function listThemeClusters(projectId: string): Promise<ThemeCluster[]> {
  return withDatabaseReadFallback(
    async (db) => {
      const rows = await db.select().from(themeClusters).where(eq(themeClusters.projectId, projectId));
      return rows.map(toThemeCluster);
    },
    () => ocpmDemoThemeClusters.filter((cluster) => cluster.projectId === projectId),
  );
}

export async function listConsensusConflictItems(projectId: string): Promise<ConsensusConflictItem[]> {
  return withDatabaseReadFallback(
    async (db) => {
      const rows = await db
        .select()
        .from(consensusConflictItems)
        .where(eq(consensusConflictItems.projectId, projectId));
      return rows.map(toConsensusConflictItem);
    },
    () => ocpmDemoConsensusConflictItems.filter((item) => item.projectId === projectId),
  );
}

export async function listGapItems(projectId: string): Promise<GapItem[]> {
  return withDatabaseReadFallback(
    async (db) => {
      const rows = await db.select().from(gapItems).where(eq(gapItems.projectId, projectId));
      return rows.map(toGapItem);
    },
    () => ocpmDemoGapItems.filter((gap) => gap.projectId === projectId),
  );
}

export async function listArgumentCandidates(projectId: string): Promise<ArgumentCandidate[]> {
  return withDatabaseReadFallback(
    async (db) => {
      const rows = await db
        .select()
        .from(argumentCandidates)
        .where(eq(argumentCandidates.projectId, projectId));
      return rows.map(toArgumentCandidate);
    },
    () => ocpmDemoArgumentCandidates.filter((argument) => argument.projectId === projectId),
  );
}

export async function listInnovationOpportunities(projectId: string): Promise<InnovationOpportunity[]> {
  return withDatabaseReadFallback(
    async (db) => {
      const rows = await db
        .select()
        .from(innovationOpportunities)
        .where(eq(innovationOpportunities.projectId, projectId));
      return rows.map(toInnovationOpportunity);
    },
    () => ocpmDemoInnovationOpportunities.filter((opportunity) => opportunity.projectId === projectId),
  );
}

export async function getWritingPlan(projectId: string): Promise<WritingPlan | null> {
  return withDatabaseReadFallback(
    async (db) => {
      const [row] = await db.select().from(writingPlans).where(eq(writingPlans.projectId, projectId));
      return row ? toWritingPlan(row) : null;
    },
    () => (ocpmDemoWritingPlan.projectId === projectId ? ocpmDemoWritingPlan : null),
  );
}

export async function getPresentationPlan(projectId: string): Promise<PresentationPlan | null> {
  return withDatabaseReadFallback(
    async (db) => {
      const [row] = await db
        .select()
        .from(presentationPlans)
        .where(eq(presentationPlans.projectId, projectId));
      return row ? toPresentationPlan(row) : null;
    },
    () => (ocpmDemoPresentationPlan.projectId === projectId ? ocpmDemoPresentationPlan : null),
  );
}

export async function upsertThemeClusters(clusters: ThemeCluster[]): Promise<MutationResult<ThemeCluster[]>> {
  const state = getMutationDbState();
  if (!state.ok) return mutationUnavailableResult(state);
  if (clusters.length === 0) return { ok: true, data: [] };
  const results: ThemeCluster[] = [];
  for (const cluster of clusters) {
    const [row] = await state.db
      .insert(themeClusters)
      .values({
        id: cluster.id,
        projectId: cluster.projectId,
        paperId: cluster.paperId ?? null,
        analysisSource: cluster.analysisSource,
        evidenceLevel: cluster.evidenceLevel,
        status: cluster.status,
        confidence: cluster.confidence,
        label: cluster.label,
        summary: cluster.summary,
        supportingPaperIds: cluster.supportingPaperIds,
        supportingMatrixRowIds: cluster.supportingMatrixRowIds,
        evidence: cluster.evidence,
        createdAt: new Date(cluster.createdAt),
        updatedAt: new Date(cluster.updatedAt),
      })
      .onConflictDoUpdate({
        target: themeClusters.id,
        set: {
          label: cluster.label,
          summary: cluster.summary,
          supportingPaperIds: cluster.supportingPaperIds,
          supportingMatrixRowIds: cluster.supportingMatrixRowIds,
          evidence: cluster.evidence,
          confidence: cluster.confidence,
          evidenceLevel: cluster.evidenceLevel,
          status: cluster.status,
          updatedAt: new Date(),
        },
      })
      .returning();
    if (row) results.push(toThemeCluster(row));
  }
  return { ok: true, data: results };
}

export async function upsertConsensusConflictItems(ccItems: ConsensusConflictItem[]): Promise<MutationResult<ConsensusConflictItem[]>> {
  const state = getMutationDbState();
  if (!state.ok) return mutationUnavailableResult(state);
  if (ccItems.length === 0) return { ok: true, data: [] };
  const results: ConsensusConflictItem[] = [];
  for (const item of ccItems) {
    const [row] = await state.db
      .insert(consensusConflictItems)
      .values({
        id: item.id,
        projectId: item.projectId,
        paperId: item.paperId ?? null,
        analysisSource: item.analysisSource,
        evidenceLevel: item.evidenceLevel,
        status: item.status,
        confidence: item.confidence,
        itemType: item.itemType,
        claim: item.claim,
        supportingPaperIds: item.supportingPaperIds,
        contrastingPaperIds: item.contrastingPaperIds ?? [],
        evidence: item.evidence,
        createdAt: new Date(item.createdAt),
        updatedAt: new Date(item.updatedAt),
      })
      .onConflictDoUpdate({
        target: consensusConflictItems.id,
        set: {
          itemType: item.itemType,
          claim: item.claim,
          supportingPaperIds: item.supportingPaperIds,
          contrastingPaperIds: item.contrastingPaperIds ?? [],
          evidence: item.evidence,
          confidence: item.confidence,
          evidenceLevel: item.evidenceLevel,
          status: item.status,
          updatedAt: new Date(),
        },
      })
      .returning();
    if (row) results.push(toConsensusConflictItem(row));
  }
  return { ok: true, data: results };
}

export async function upsertGapItems(gapsList: GapItem[]): Promise<MutationResult<GapItem[]>> {
  const state = getMutationDbState();
  if (!state.ok) return mutationUnavailableResult(state);
  if (gapsList.length === 0) return { ok: true, data: [] };
  const results: GapItem[] = [];
  for (const gap of gapsList) {
    const [row] = await state.db
      .insert(gapItems)
      .values({
        id: gap.id,
        projectId: gap.projectId,
        paperId: gap.paperId ?? null,
        analysisSource: gap.analysisSource,
        evidenceLevel: gap.evidenceLevel,
        status: gap.status,
        confidence: gap.confidence,
        gapType: gap.gapType ?? null,
        title: gap.title,
        description: gap.description,
        supportingPaperIds: gap.supportingPaperIds,
        evidence: gap.evidence,
        createdAt: new Date(gap.createdAt),
        updatedAt: new Date(gap.updatedAt),
      })
      .onConflictDoUpdate({
        target: gapItems.id,
        set: {
          gapType: gap.gapType ?? null,
          title: gap.title,
          description: gap.description,
          supportingPaperIds: gap.supportingPaperIds,
          evidence: gap.evidence,
          confidence: gap.confidence,
          evidenceLevel: gap.evidenceLevel,
          status: gap.status,
          updatedAt: new Date(),
        },
      })
      .returning();
    if (row) results.push(toGapItem(row));
  }
  return { ok: true, data: results };
}

export async function upsertArgumentCandidates(candidates: ArgumentCandidate[]): Promise<MutationResult<ArgumentCandidate[]>> {
  const state = getMutationDbState();
  if (!state.ok) return mutationUnavailableResult(state);
  if (candidates.length === 0) return { ok: true, data: [] };
  const results: ArgumentCandidate[] = [];
  for (const cand of candidates) {
    const [row] = await state.db
      .insert(argumentCandidates)
      .values({
        id: cand.id,
        projectId: cand.projectId,
        paperId: cand.paperId ?? null,
        analysisSource: cand.analysisSource,
        evidenceLevel: cand.evidenceLevel,
        status: cand.status,
        confidence: cand.confidence,
        claim: cand.claim,
        rationale: cand.rationale,
        supportingPaperIds: cand.supportingPaperIds,
        relatedGapIds: cand.relatedGapIds ?? [],
        evidence: cand.evidence,
        createdAt: new Date(cand.createdAt),
        updatedAt: new Date(cand.updatedAt),
      })
      .onConflictDoUpdate({
        target: argumentCandidates.id,
        set: {
          claim: cand.claim,
          rationale: cand.rationale,
          supportingPaperIds: cand.supportingPaperIds,
          relatedGapIds: cand.relatedGapIds ?? [],
          evidence: cand.evidence,
          confidence: cand.confidence,
          evidenceLevel: cand.evidenceLevel,
          status: cand.status,
          updatedAt: new Date(),
        },
      })
      .returning();
    if (row) results.push(toArgumentCandidate(row));
  }
  return { ok: true, data: results };
}

export async function upsertInnovationOpportunities(opportunities: InnovationOpportunity[]): Promise<MutationResult<InnovationOpportunity[]>> {
  const state = getMutationDbState();
  if (!state.ok) return mutationUnavailableResult(state);
  if (opportunities.length === 0) return { ok: true, data: [] };
  const results: InnovationOpportunity[] = [];
  for (const opp of opportunities) {
    const [row] = await state.db
      .insert(innovationOpportunities)
      .values({
        id: opp.id,
        projectId: opp.projectId,
        paperId: opp.paperId ?? null,
        analysisSource: opp.analysisSource,
        evidenceLevel: opp.evidenceLevel,
        status: opp.status,
        confidence: opp.confidence,
        title: opp.title,
        opportunity: opp.opportunity,
        rationale: opp.rationale,
        supportingPaperIds: opp.supportingPaperIds,
        relatedGapIds: opp.relatedGapIds ?? [],
        evidence: opp.evidence,
        createdAt: new Date(opp.createdAt),
        updatedAt: new Date(opp.updatedAt),
      })
      .onConflictDoUpdate({
        target: innovationOpportunities.id,
        set: {
          title: opp.title,
          opportunity: opp.opportunity,
          rationale: opp.rationale,
          supportingPaperIds: opp.supportingPaperIds,
          relatedGapIds: opp.relatedGapIds ?? [],
          evidence: opp.evidence,
          confidence: opp.confidence,
          evidenceLevel: opp.evidenceLevel,
          status: opp.status,
          updatedAt: new Date(),
        },
      })
      .returning();
    if (row) results.push(toInnovationOpportunity(row));
  }
  return { ok: true, data: results };
}

export async function upsertWritingPlan(plan: WritingPlan): Promise<MutationResult<WritingPlan>> {
  const state = getMutationDbState();
  if (!state.ok) return mutationUnavailableResult(state);
  const [row] = await state.db
    .insert(writingPlans)
    .values({
      id: plan.id,
      projectId: plan.projectId,
      paperId: plan.paperId ?? null,
      analysisSource: plan.analysisSource,
      evidenceLevel: plan.evidenceLevel,
      status: plan.status,
      confidence: plan.confidence,
      title: plan.title,
      sections: plan.sections,
      evidence: plan.evidence,
      createdAt: new Date(plan.createdAt),
      updatedAt: new Date(plan.updatedAt),
    })
    .onConflictDoUpdate({
      target: writingPlans.id,
      set: {
        title: plan.title,
        sections: plan.sections,
        evidence: plan.evidence,
        confidence: plan.confidence,
        evidenceLevel: plan.evidenceLevel,
        status: plan.status,
        updatedAt: new Date(),
      },
    })
    .returning();
  return { ok: true, data: toWritingPlan(row) };
}

export async function upsertPresentationPlan(plan: PresentationPlan): Promise<MutationResult<PresentationPlan>> {
  const state = getMutationDbState();
  if (!state.ok) return mutationUnavailableResult(state);
  const [row] = await state.db
    .insert(presentationPlans)
    .values({
      id: plan.id,
      projectId: plan.projectId,
      paperId: plan.paperId ?? null,
      analysisSource: plan.analysisSource,
      evidenceLevel: plan.evidenceLevel,
      status: plan.status,
      confidence: plan.confidence,
      title: plan.title,
      slides: plan.slides,
      evidence: plan.evidence,
      createdAt: new Date(plan.createdAt),
      updatedAt: new Date(plan.updatedAt),
    })
    .onConflictDoUpdate({
      target: presentationPlans.id,
      set: {
        title: plan.title,
        slides: plan.slides,
        evidence: plan.evidence,
        confidence: plan.confidence,
        evidenceLevel: plan.evidenceLevel,
        status: plan.status,
        updatedAt: new Date(),
      },
    })
    .returning();
  return { ok: true, data: toPresentationPlan(row) };
}
