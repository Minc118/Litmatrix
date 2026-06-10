import { dataResponse, errorResponse } from "@/lib/server/http";
import { updateExtractionMatrixRowConfirmedValue } from "@/lib/server/services/matrixService";
import { readJsonBody } from "@/lib/server/validators/litmatrixValidators";

type MatrixRouteContext = {
  params: Promise<{ rowId: string }>;
};

export async function PATCH(request: Request, context: MatrixRouteContext) {
  const { rowId } = await context.params;
  const body = await readJsonBody(request);

  if (!body) {
    return errorResponse("VALIDATION_FAILED", "A JSON request body is required.", 400);
  }

  if (body.confirmedValue !== null && typeof body.confirmedValue !== "string") {
    return errorResponse("VALIDATION_FAILED", "confirmedValue must be a string or null.", 400);
  }

  const result = await updateExtractionMatrixRowConfirmedValue(rowId, body.confirmedValue);

  if (!result.ok) {
    return errorResponse(result.code, result.message, result.status);
  }

  if (!result.data) {
    return errorResponse("NOT_FOUND", "Extraction matrix row not found.", 404);
  }

  return dataResponse(result.data);
}
