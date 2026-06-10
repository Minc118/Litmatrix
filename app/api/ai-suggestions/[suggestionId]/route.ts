import { dataResponse, errorResponse } from "@/lib/server/http";
import { updateAISuggestion } from "@/lib/server/repositories/analysisRepository";
import { isKnownReviewStatus, readJsonBody } from "@/lib/server/validators/litmatrixValidators";

type SuggestionRouteContext = {
  params: Promise<{ suggestionId: string }>;
};

export async function PATCH(request: Request, context: SuggestionRouteContext) {
  const { suggestionId } = await context.params;
  const body = await readJsonBody(request);

  if (!body) {
    return errorResponse("VALIDATION_FAILED", "A JSON request body is required.", 400);
  }

  const patch: Parameters<typeof updateAISuggestion>[1] = {};

  if (body.status !== undefined) {
    if (!isKnownReviewStatus(body.status)) {
      return errorResponse("VALIDATION_FAILED", "Invalid suggestion status.", 400);
    }
    patch.status = body.status;
  }

  if (body.content !== undefined) {
    if (typeof body.content !== "string") {
      return errorResponse("VALIDATION_FAILED", "content must be a string.", 400);
    }
    patch.content = body.content;
  }

  if (body.title !== undefined) {
    if (typeof body.title !== "string") {
      return errorResponse("VALIDATION_FAILED", "title must be a string.", 400);
    }
    patch.title = body.title;
  }

  const result = await updateAISuggestion(suggestionId, patch);

  if (!result.ok) {
    return errorResponse(result.code, result.message, result.status);
  }

  if (!result.data) {
    return errorResponse("NOT_FOUND", "AI suggestion not found.", 404);
  }

  return dataResponse(result.data);
}
