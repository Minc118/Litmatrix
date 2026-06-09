import "server-only";

import {
  ocpmDemoKeywordGroups,
  ocpmDemoProject,
  ocpmDemoProjectId,
  ocpmDemoResearchQuestions,
} from "@/lib/demo/ocpm-demo-data";
import type { Project, ProjectDetail } from "@/lib/types/litmatrix";

export async function listProjects(): Promise<Project[]> {
  return [ocpmDemoProject];
}

export async function getProjectById(projectId: string): Promise<ProjectDetail | null> {
  if (projectId !== ocpmDemoProjectId) {
    return null;
  }

  return {
    ...ocpmDemoProject,
    researchQuestions: ocpmDemoResearchQuestions,
    keywordGroups: ocpmDemoKeywordGroups,
  };
}
