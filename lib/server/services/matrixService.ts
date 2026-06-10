import "server-only";

import * as matrixRepository from "@/lib/server/repositories/matrixRepository";
import { isNonEmptyString } from "@/lib/server/validators/litmatrixValidators";
import type { MutationResult } from "@/lib/server/db/fallback";
import type { ExtractionMatrixRow, ReviewStatus } from "@/lib/types/litmatrix";

export async function listProjectExtractionMatrixRows(
  projectId: string,
  filters: { paperId?: string | null; status?: ReviewStatus | null } = {},
) {
  return matrixRepository.listExtractionMatrixRows(projectId, filters);
}

export async function updateExtractionMatrixRowConfirmedValue(
  rowId: string,
  confirmedValue: string | null,
): Promise<MutationResult<ExtractionMatrixRow | null>> {
  if (!isNonEmptyString(rowId)) {
    return {
      ok: false,
      code: "VALIDATION_FAILED",
      message: "A valid rowId is required.",
      status: 400,
    };
  }

  const normalizedValue = isNonEmptyString(confirmedValue) ? confirmedValue.trim() : null;

  return matrixRepository.updateExtractionMatrixRow(rowId, {
    confirmedValue: normalizedValue,
    status: normalizedValue ? "edited" : "pending-review",
  });
}
