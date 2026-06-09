import "server-only";

import { ocpmDemoExtractionMatrixRows } from "@/lib/demo/ocpm-demo-data";
import type { ExtractionMatrixRow, ReviewStatus } from "@/lib/types/litmatrix";

export async function listExtractionMatrixRows(
  projectId: string,
  filters: { paperId?: string | null; status?: ReviewStatus | null } = {},
): Promise<ExtractionMatrixRow[]> {
  return ocpmDemoExtractionMatrixRows.filter((row) => {
    if (row.projectId !== projectId) {
      return false;
    }
    if (filters.paperId && row.paperId !== filters.paperId) {
      return false;
    }
    if (filters.status && row.status !== filters.status) {
      return false;
    }
    return true;
  });
}
