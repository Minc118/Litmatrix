import "server-only";

import * as projectRepository from "@/lib/server/repositories/projectRepository";

export async function listProjects() {
  return projectRepository.listProjects();
}

export async function getProject(projectId: string) {
  return projectRepository.getProjectById(projectId);
}
