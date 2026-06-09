import "server-only";

import {
  ocpmDemoArgumentCandidates,
  ocpmDemoConsensusConflictItems,
  ocpmDemoGapItems,
  ocpmDemoInnovationOpportunities,
  ocpmDemoPresentationPlan,
  ocpmDemoThemeClusters,
  ocpmDemoWritingPlan,
} from "@/lib/demo/ocpm-demo-data";
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
  return ocpmDemoThemeClusters.filter((cluster) => cluster.projectId === projectId);
}

export async function listConsensusConflictItems(projectId: string): Promise<ConsensusConflictItem[]> {
  return ocpmDemoConsensusConflictItems.filter((item) => item.projectId === projectId);
}

export async function listGapItems(projectId: string): Promise<GapItem[]> {
  return ocpmDemoGapItems.filter((gap) => gap.projectId === projectId);
}

export async function listArgumentCandidates(projectId: string): Promise<ArgumentCandidate[]> {
  return ocpmDemoArgumentCandidates.filter((argument) => argument.projectId === projectId);
}

export async function listInnovationOpportunities(projectId: string): Promise<InnovationOpportunity[]> {
  return ocpmDemoInnovationOpportunities.filter((opportunity) => opportunity.projectId === projectId);
}

export async function getWritingPlan(projectId: string): Promise<WritingPlan | null> {
  return ocpmDemoWritingPlan.projectId === projectId ? ocpmDemoWritingPlan : null;
}

export async function getPresentationPlan(projectId: string): Promise<PresentationPlan | null> {
  return ocpmDemoPresentationPlan.projectId === projectId ? ocpmDemoPresentationPlan : null;
}
