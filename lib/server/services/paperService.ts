import "server-only";

import * as paperRepository from "@/lib/server/repositories/paperRepository";

export async function listProjectPapers(projectId: string) {
  return paperRepository.listPapersByProjectId(projectId);
}

export async function getProjectPaper(projectId: string, paperId: string) {
  return paperRepository.getPaperById(projectId, paperId);
}
