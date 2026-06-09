import "server-only";

import * as matrixRepository from "@/lib/server/repositories/matrixRepository";
import type { ReviewStatus } from "@/lib/types/litmatrix";

export async function listProjectExtractionMatrixRows(
  projectId: string,
  filters: { paperId?: string | null; status?: ReviewStatus | null } = {},
) {
  return matrixRepository.listExtractionMatrixRows(projectId, filters);
}

export async function updateExtractionMatrixRowPlaceholder() {
  return {
    status: "read-only" as const,
    message: "Extraction matrix mutations are not implemented in the skeleton phase.",
  };
}
