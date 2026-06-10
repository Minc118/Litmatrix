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
import { withDatabaseReadFallback } from "@/lib/server/db/fallback";
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
