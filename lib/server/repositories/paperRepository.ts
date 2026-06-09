import "server-only";

import { ocpmDemoPapers } from "@/lib/demo/ocpm-demo-data";
import type { Paper } from "@/lib/types/litmatrix";

export async function listPapersByProjectId(projectId: string): Promise<Paper[]> {
  return ocpmDemoPapers.filter((paper) => paper.projectId === projectId);
}

export async function getPaperById(projectId: string, paperId: string): Promise<Paper | null> {
  return ocpmDemoPapers.find((paper) => paper.projectId === projectId && paper.id === paperId) ?? null;
}
