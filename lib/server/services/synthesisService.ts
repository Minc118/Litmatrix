import "server-only";

import * as synthesisRepository from "@/lib/server/repositories/synthesisRepository";

export async function listProjectThemeClusters(projectId: string) {
  return synthesisRepository.listThemeClusters(projectId);
}

export async function listProjectConsensusConflictItems(projectId: string) {
  return synthesisRepository.listConsensusConflictItems(projectId);
}

export async function listProjectGaps(projectId: string) {
  return synthesisRepository.listGapItems(projectId);
}

export async function listProjectArguments(projectId: string) {
  return synthesisRepository.listArgumentCandidates(projectId);
}

export async function listProjectInnovationOpportunities(projectId: string) {
  return synthesisRepository.listInnovationOpportunities(projectId);
}

export async function getProjectWritingPlan(projectId: string) {
  return synthesisRepository.getWritingPlan(projectId);
}

export async function getProjectPresentationPlan(projectId: string) {
  return synthesisRepository.getPresentationPlan(projectId);
}
