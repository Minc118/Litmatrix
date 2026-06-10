import "server-only";

import type { AnalysisSource, Confidence, EvidenceLevel, ReviewDecision, ReviewStatus } from "@/lib/types/litmatrix";

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

export function isKnownReviewDecision(value: unknown): value is ReviewDecision["decision"] {
  return (
    typeof value === "string" &&
    (value === "accepted" || value === "edited" || value === "rejected" || value === "saved-as-idea")
  );
}

export async function readJsonBody(request: Request): Promise<Record<string, unknown> | null> {
  try {
    const body = (await request.json()) as unknown;
    return body && typeof body === "object" && !Array.isArray(body) ? (body as Record<string, unknown>) : null;
  } catch {
    return null;
  }
}
