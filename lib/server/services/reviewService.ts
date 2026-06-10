import "server-only";

import * as analysisRepository from "@/lib/server/repositories/analysisRepository";
import * as matrixRepository from "@/lib/server/repositories/matrixRepository";
import * as reviewRepository from "@/lib/server/repositories/reviewRepository";
import { isKnownReviewDecision, isNonEmptyString } from "@/lib/server/validators/litmatrixValidators";
import type { MutationResult } from "@/lib/server/db/fallback";
import type { ExtractionMatrixRow, ReviewDecision } from "@/lib/types/litmatrix";

export async function listProjectReviewDecisions(projectId: string, paperId?: string | null) {
  return reviewRepository.listReviewDecisions(projectId, paperId);
}

export type CreateReviewDecisionInput = {
  suggestionId: string;
  decision: ReviewDecision["decision"];
  editedContent?: string | null;
  reviewerNote?: string | null;
};

export type CreateReviewDecisionResult = {
  decision: ReviewDecision;
  updatedSuggestionId: string;
  matrixRow?: ExtractionMatrixRow;
};

export async function createReviewDecision(
  input: CreateReviewDecisionInput,
): Promise<MutationResult<CreateReviewDecisionResult>> {
  if (!isNonEmptyString(input.suggestionId) || !isKnownReviewDecision(input.decision)) {
    return {
      ok: false,
      code: "VALIDATION_FAILED",
      message: "A valid suggestionId and review decision are required.",
      status: 400,
    };
  }

  const suggestion = await analysisRepository.getAISuggestionById(input.suggestionId);
  if (!suggestion) {
    return {
      ok: false,
      code: "NOT_FOUND",
      message: "AI suggestion not found.",
      status: 404,
    };
  }

  if (input.decision === "edited" && !isNonEmptyString(input.editedContent)) {
    return {
      ok: false,
      code: "VALIDATION_FAILED",
      message: "editedContent is required when decision is edited.",
      status: 400,
    };
  }

  const timestamp = new Date().toISOString();
  const reviewDecision: ReviewDecision = {
    id: crypto.randomUUID(),
    projectId: suggestion.projectId,
    paperId: suggestion.paperId,
    suggestionId: suggestion.id,
    decision: input.decision,
    editedContent: input.editedContent ?? null,
    reviewerNote: input.reviewerNote ?? null,
    createdAt: timestamp,
    updatedAt: timestamp,
  };

  const savedDecision = await reviewRepository.createReviewDecision(reviewDecision);
  if (!savedDecision.ok) {
    return savedDecision;
  }

  const updatedSuggestion = await analysisRepository.updateAISuggestion(suggestion.id, {
    status: input.decision,
  });
  if (!updatedSuggestion.ok) {
    return updatedSuggestion;
  }

  let matrixRow: ExtractionMatrixRow | undefined;

  if (
    suggestion.suggestionType === "extraction-field" &&
    suggestion.paperId &&
    suggestion.targetField &&
    (input.decision === "accepted" || input.decision === "edited")
  ) {
    const confirmedValue = input.decision === "edited" ? input.editedContent : suggestion.content;
    const matrixResult = await matrixRepository.upsertExtractionMatrixRowFromSuggestion({
      id: `matrix-${suggestion.paperId}-${suggestion.targetField}`,
      projectId: suggestion.projectId,
      paperId: suggestion.paperId,
      analysisSource: suggestion.analysisSource,
      evidenceLevel: suggestion.evidenceLevel,
      status: input.decision,
      confidence: suggestion.confidence,
      fieldKey: suggestion.targetField,
      fieldLabel: suggestion.targetField,
      suggestedValue: suggestion.content,
      confirmedValue: confirmedValue ?? null,
      confirmedByDecisionId: savedDecision.data.id,
      evidence: suggestion.evidence,
      createdAt: timestamp,
      updatedAt: timestamp,
    });

    if (!matrixResult.ok) {
      return matrixResult;
    }
    matrixRow = matrixResult.data;
  }

  return {
    ok: true,
    data: {
      decision: savedDecision.data,
      updatedSuggestionId: suggestion.id,
      matrixRow,
    },
  };
}
