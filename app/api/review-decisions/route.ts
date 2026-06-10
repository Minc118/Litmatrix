import { dataResponse, errorResponse } from "@/lib/server/http";
import { createReviewDecision } from "@/lib/server/services/reviewService";
import { isKnownReviewDecision, readJsonBody } from "@/lib/server/validators/litmatrixValidators";

export async function POST(request: Request) {
  const body = await readJsonBody(request);

  if (!body) {
    return errorResponse("VALIDATION_FAILED", "A JSON request body is required.", 400);
  }

  const decision = body.decision;
  if (!isKnownReviewDecision(decision)) {
    return errorResponse("VALIDATION_FAILED", "A valid review decision is required.", 400);
  }

  const result = await createReviewDecision({
    suggestionId: typeof body.suggestionId === "string" ? body.suggestionId : "",
    decision,
    editedContent: typeof body.editedContent === "string" ? body.editedContent : null,
    reviewerNote: typeof body.reviewerNote === "string" ? body.reviewerNote : null,
  });

  if (!result.ok) {
    return errorResponse(result.code, result.message, result.status);
  }

  return dataResponse(result.data);
}
