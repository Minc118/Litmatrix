import "server-only";

import type { AnalysisSource, Confidence, EvidenceLevel, ReviewStatus } from "@/lib/types/litmatrix";

export const analysisSources: AnalysisSource[] = [
  "mock",
  "gemini-api",
  "antigravity-local",
  "manual",
  "imported",
  "zotero-local",
  "zotero-web",
  "pdf-parser",
];

export const evidenceLevels: EvidenceLevel[] = [
  "metadata-only",
  "abstract-based",
  "full-text",
  "user-notes",
  "mixed",
];

export const reviewStatuses: ReviewStatus[] = [
  "pending-review",
  "accepted",
  "edited",
  "rejected",
  "saved-as-idea",
];

export const confidenceValues: Confidence[] = ["high", "medium", "low", "tentative"];

export function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

export function isKnownReviewStatus(value: unknown): value is ReviewStatus {
  return typeof value === "string" && reviewStatuses.includes(value as ReviewStatus);
}
