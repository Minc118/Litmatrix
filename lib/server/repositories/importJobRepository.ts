import "server-only";

import { ocpmDemoImportJobs } from "@/lib/demo/ocpm-demo-data";
import type { ImportJob } from "@/lib/types/litmatrix";

export async function listImportJobs(projectId: string): Promise<ImportJob[]> {
  return ocpmDemoImportJobs.filter((job) => job.projectId === projectId);
}
