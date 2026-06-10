import "server-only";

import { eq } from "drizzle-orm";
import { ocpmDemoImportJobs } from "@/lib/demo/ocpm-demo-data";
import { withDatabaseReadFallback } from "@/lib/server/db/fallback";
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
