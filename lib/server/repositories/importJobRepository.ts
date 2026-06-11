import "server-only";

import { eq } from "drizzle-orm";
import { ocpmDemoImportJobs } from "@/lib/demo/ocpm-demo-data";
import {
  getMutationDbState,
  mutationUnavailableResult,
  withDatabaseReadFallback,
  type MutationResult,
} from "@/lib/server/db/fallback";
import { toImportJob } from "@/lib/server/db/mappers";
import { importJobs } from "@/lib/server/db/schema";
import type { ImportJob } from "@/lib/types/litmatrix";

export async function listImportJobs(projectId: string): Promise<ImportJob[]> {
  return withDatabaseReadFallback(
    async (db) => {
      const rows = await db.select().from(importJobs).where(eq(importJobs.projectId, projectId));
      return rows.map(toImportJob);
    },
    () => ocpmDemoImportJobs.filter((job) => job.projectId === projectId),
  );
}

export async function createImportJob(job: ImportJob): Promise<MutationResult<ImportJob>> {
  const state = getMutationDbState();
  if (!state.ok) {
    return mutationUnavailableResult(state);
  }

  const [row] = await state.db
    .insert(importJobs)
    .values({
      id: job.id,
      projectId: job.projectId,
      importType: job.importType,
      analysisSource: job.analysisSource,
      status: job.status,
      inputSummary: job.inputSummary ?? null,
      recordsCreated: job.recordsCreated ?? 0,
      recordsRejected: job.recordsRejected ?? 0,
      validationErrors: job.validationErrors ?? [],
      createdAt: new Date(job.createdAt),
      updatedAt: new Date(job.updatedAt),
    })
    .returning();

  return { ok: true, data: toImportJob(row) };
}

export async function updateImportJob(
  jobId: string,
  patch: Partial<Pick<ImportJob, "status" | "recordsCreated" | "recordsRejected" | "validationErrors" | "inputSummary">>
): Promise<MutationResult<ImportJob | null>> {
  const state = getMutationDbState();
  if (!state.ok) {
    return mutationUnavailableResult(state);
  }

  const [row] = await state.db
    .update(importJobs)
    .set({
      ...patch,
      updatedAt: new Date(),
    })
    .where(eq(importJobs.id, jobId))
    .returning();

  return { ok: true, data: row ? toImportJob(row) : null };
}
