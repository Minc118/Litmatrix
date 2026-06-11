import "server-only";

import { z } from "zod";
import type {
  AnalysisSource,
  EvidenceLevel,
  ReviewStatus,
  Confidence,
  EvidenceReference,
} from "@/lib/types/litmatrix";

// Common Enums
const analysisSourceEnum = z.enum([
  "mock",
  "gemini-api",
  "antigravity-local",
  "manual",
  "imported",
  "zotero-local",
  "zotero-web",
  "pdf-parser",
]);

const evidenceLevelEnum = z.enum([
  "metadata-only",
  "abstract-based",
  "full-text",
  "user-notes",
  "mixed",
]);

const reviewStatusEnum = z.enum([
  "pending-review",
  "accepted",
  "edited",
  "rejected",
  "saved-as-idea",
]);

const confidenceEnum = z.enum(["high", "medium", "low", "tentative"]);

const suggestionTypeEnum = z.enum([
  "paper-overview",
  "extraction-field",
  "theme",
  "gap",
  "argument",
  "innovation",
  "writing-plan",
  "presentation-plan",
]);

const gapTypeEnum = z.enum([
  "method",
  "dataset",
  "evaluation",
  "theory",
  "application",
  "other",
]);

const consensusItemTypeEnum = z.enum([
  "consensus",
  "conflict",
  "complementarity",
]);

// Shared Sub-Objects
const evidenceReferenceSchema = z.object({
  paperId: z.string(),
  sourceField: z.enum(["title", "abstract", "fullText", "metadata", "userNotes", "importedNotes"]).optional(),
  quote: z.string().optional().nullable(),
  page: z.number().int().positive().optional().nullable(),
  section: z.string().optional().nullable(),
  note: z.string().optional().nullable(),
});

// Main Analysis Schemas
const paperSchema = z.object({
  id: z.string(),
  projectId: z.string(),
  title: z.string(),
  authors: z.array(z.string()).optional().default([]),
  year: z.number().int().optional().nullable(),
  venue: z.string().optional().nullable(),
  doi: z.string().optional().nullable(),
  url: z.string().optional().nullable(),
  abstract: z.string().optional().nullable(),
  zoteroItemKey: z.string().optional().nullable(),
  pdfFileId: z.string().optional().nullable(),
  tags: z.array(z.string()).optional().default([]),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
});

const paperOverviewSchema = z.object({
  id: z.string(),
  projectId: z.string(),
  paperId: z.string(),
  analysisSource: analysisSourceEnum.optional(),
  evidenceLevel: evidenceLevelEnum.optional(),
  status: reviewStatusEnum.optional(),
  confidence: confidenceEnum.optional(),
  problem: z.string().optional().nullable(),
  objective: z.string().optional().nullable(),
  method: z.string().optional().nullable(),
  dataset: z.string().optional().nullable(),
  findings: z.string().optional().nullable(),
  limitations: z.string().optional().nullable(),
  evidence: z.array(evidenceReferenceSchema).optional().default([]),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
});

const aiSuggestionSchema = z.object({
  id: z.string(),
  projectId: z.string(),
  paperId: z.string().optional(),
  analysisSource: analysisSourceEnum.optional(),
  evidenceLevel: evidenceLevelEnum.optional(),
  status: reviewStatusEnum.optional(),
  confidence: confidenceEnum.optional(),
  suggestionType: suggestionTypeEnum,
  title: z.string(),
  content: z.string(),
  targetField: z.string().optional().nullable(),
  evidence: z.array(evidenceReferenceSchema).optional().default([]),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
});

const extractionMatrixRowSchema = z.object({
  id: z.string(),
  projectId: z.string(),
  paperId: z.string(),
  analysisSource: analysisSourceEnum.optional(),
  evidenceLevel: evidenceLevelEnum.optional(),
  status: reviewStatusEnum.optional(),
  confidence: confidenceEnum.optional(),
  fieldKey: z.string(),
  fieldLabel: z.string(),
  suggestedValue: z.string().optional().nullable(),
  confirmedValue: z.string().optional().nullable(),
  confirmedByDecisionId: z.string().optional().nullable(),
  evidence: z.array(evidenceReferenceSchema).optional().default([]),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
});

const themeClusterSchema = z.object({
  id: z.string(),
  projectId: z.string(),
  paperId: z.string().optional(),
  analysisSource: analysisSourceEnum.optional(),
  evidenceLevel: evidenceLevelEnum.optional(),
  status: reviewStatusEnum.optional(),
  confidence: confidenceEnum.optional(),
  label: z.string(),
  summary: z.string(),
  supportingPaperIds: z.array(z.string()).optional().default([]),
  supportingMatrixRowIds: z.array(z.string()).optional().default([]),
  evidence: z.array(evidenceReferenceSchema).optional().default([]),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
});

const consensusConflictItemSchema = z.object({
  id: z.string(),
  projectId: z.string(),
  paperId: z.string().optional(),
  analysisSource: analysisSourceEnum.optional(),
  evidenceLevel: evidenceLevelEnum.optional(),
  status: reviewStatusEnum.optional(),
  confidence: confidenceEnum.optional(),
  itemType: consensusItemTypeEnum,
  claim: z.string(),
  supportingPaperIds: z.array(z.string()).optional().default([]),
  contrastingPaperIds: z.array(z.string()).optional().default([]),
  evidence: z.array(evidenceReferenceSchema).optional().default([]),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
});

const gapItemSchema = z.object({
  id: z.string(),
  projectId: z.string(),
  paperId: z.string().optional(),
  analysisSource: analysisSourceEnum.optional(),
  evidenceLevel: evidenceLevelEnum.optional(),
  status: reviewStatusEnum.optional(),
  confidence: confidenceEnum.optional(),
  gapType: gapTypeEnum.optional().nullable(),
  title: z.string(),
  description: z.string(),
  supportingPaperIds: z.array(z.string()).optional().default([]),
  evidence: z.array(evidenceReferenceSchema).optional().default([]),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
});

const argumentCandidateSchema = z.object({
  id: z.string(),
  projectId: z.string(),
  paperId: z.string().optional(),
  analysisSource: analysisSourceEnum.optional(),
  evidenceLevel: evidenceLevelEnum.optional(),
  status: reviewStatusEnum.optional(),
  confidence: confidenceEnum.optional(),
  claim: z.string(),
  rationale: z.string(),
  supportingPaperIds: z.array(z.string()).optional().default([]),
  relatedGapIds: z.array(z.string()).optional().default([]),
  evidence: z.array(evidenceReferenceSchema).optional().default([]),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
});

const innovationOpportunitySchema = z.object({
  id: z.string(),
  projectId: z.string(),
  paperId: z.string().optional(),
  analysisSource: analysisSourceEnum.optional(),
  evidenceLevel: evidenceLevelEnum.optional(),
  status: reviewStatusEnum.optional(),
  confidence: confidenceEnum.optional(),
  title: z.string(),
  opportunity: z.string(),
  rationale: z.string(),
  supportingPaperIds: z.array(z.string()).optional().default([]),
  relatedGapIds: z.array(z.string()).optional().default([]),
  evidence: z.array(evidenceReferenceSchema).optional().default([]),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
});

const writingPlanSchema = z.object({
  id: z.string(),
  projectId: z.string(),
  paperId: z.string().optional(),
  analysisSource: analysisSourceEnum.optional(),
  evidenceLevel: evidenceLevelEnum.optional(),
  status: reviewStatusEnum.optional(),
  confidence: confidenceEnum.optional(),
  title: z.string(),
  sections: z.array(z.object({
    id: z.string(),
    heading: z.string(),
    purpose: z.string(),
    supportingPaperIds: z.array(z.string()),
    notes: z.string().optional().nullable(),
  })).optional().default([]),
  evidence: z.array(evidenceReferenceSchema).optional().default([]),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
});

const presentationPlanSchema = z.object({
  id: z.string(),
  projectId: z.string(),
  paperId: z.string().optional(),
  analysisSource: analysisSourceEnum.optional(),
  evidenceLevel: evidenceLevelEnum.optional(),
  status: reviewStatusEnum.optional(),
  confidence: confidenceEnum.optional(),
  title: z.string(),
  slides: z.array(z.object({
    id: z.string(),
    title: z.string(),
    objective: z.string(),
    supportingPaperIds: z.array(z.string()),
    speakerNotes: z.string().optional().nullable(),
  })).optional().default([]),
  evidence: z.array(evidenceReferenceSchema).optional().default([]),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
});

// Complete Antigravity Payload Schema
export const antigravityPayloadSchema = z.object({
  projectId: z.string(),
  papers: z.array(paperSchema).optional().default([]),
  paperOverviews: z.array(paperOverviewSchema).optional().default([]),
  aiSuggestions: z.array(aiSuggestionSchema).optional().default([]),
  extractionMatrixRows: z.array(extractionMatrixRowSchema).optional().default([]),
  themeClusters: z.array(themeClusterSchema).optional().default([]),
  consensusConflictItems: z.array(consensusConflictItemSchema).optional().default([]),
  gapItems: z.array(gapItemSchema).optional().default([]),
  argumentCandidates: z.array(argumentCandidateSchema).optional().default([]),
  innovationOpportunities: z.array(innovationOpportunitySchema).optional().default([]),
  writingPlans: z.array(writingPlanSchema).optional().default([]),
  presentationPlans: z.array(presentationPlanSchema).optional().default([]),
});

export type AntigravityImportPayload = z.infer<typeof antigravityPayloadSchema>;

/**
 * Normalizes evidenceLevel strictly based on actual evidence field usage.
 */
export function normalizeEvidenceLevel(
  claimedLevel: string | undefined,
  evidence: EvidenceReference[] = []
): EvidenceLevel {
  const hasFullTextEvidence = evidence.some(
    (ev) =>
      ev.sourceField === "fullText" &&
      ((ev.quote && ev.quote.trim().length > 0) || (ev.page !== undefined && ev.page !== null) || (ev.section && ev.section.trim().length > 0))
  );

  if (claimedLevel === "full-text" && !hasFullTextEvidence) {
    // Demote because full-text quote/page is not found in the evidence array.
    const hasAbstractEvidence = evidence.some((ev) => ev.sourceField === "abstract");
    return hasAbstractEvidence ? "abstract-based" : "metadata-only";
  }

  if (claimedLevel === "full-text") {
    return "full-text";
  }

  if (claimedLevel === "abstract-based" || evidence.some((ev) => ev.sourceField === "abstract")) {
    return "abstract-based";
  }

  if (claimedLevel === "user-notes" || evidence.some((ev) => ev.sourceField === "userNotes")) {
    return "user-notes";
  }

  if (claimedLevel === "mixed") {
    return "mixed";
  }

  return "metadata-only";
}

/**
 * Normalizes confidence conservatively.
 */
export function normalizeConfidence(claimedConfidence: string | undefined): Confidence {
  if (claimedConfidence === "high") return "high";
  if (claimedConfidence === "medium") return "medium";
  if (claimedConfidence === "low") return "low";
  return "tentative"; // Default conservative confidence
}

/**
 * Helper to normalize metadata for any imported analysis record.
 */
export function normalizeAnalysisMetadata<T extends {
  id: string;
  projectId: string;
  analysisSource?: string;
  status?: string;
  evidenceLevel?: string;
  confidence?: string;
  evidence?: Array<{
    paperId: string;
    sourceField?: string;
    quote?: string | null;
    page?: number | null;
    section?: string | null;
    note?: string | null;
  }>;
  createdAt?: string;
  updatedAt?: string;
}>(
  record: T,
  projectId: string
): Omit<T, "analysisSource" | "status" | "evidenceLevel" | "confidence" | "evidence" | "createdAt" | "updatedAt"> & {
  projectId: string;
  analysisSource: AnalysisSource;
  evidenceLevel: EvidenceLevel;
  status: ReviewStatus;
  confidence: Confidence;
  evidence: EvidenceReference[];
  createdAt: string;
  updatedAt: string;
} {
  const normalizedEvidence: EvidenceReference[] = (record.evidence || []).map((ev) => ({
    paperId: ev.paperId,
    sourceField: ev.sourceField as EvidenceReference["sourceField"],
    quote: ev.quote?.trim() || undefined,
    page: ev.page || undefined,
    section: ev.section?.trim() || undefined,
    note: ev.note?.trim() || undefined,
  }));

  const {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    analysisSource,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    status,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    evidenceLevel,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    confidence,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    evidence,
    createdAt,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    updatedAt,
    ...rest
  } = record;

  return {
    ...rest,
    projectId,
    analysisSource: "antigravity-local" as AnalysisSource,
    status: "pending-review" as ReviewStatus,
    evidenceLevel: normalizeEvidenceLevel(record.evidenceLevel, normalizedEvidence),
    confidence: normalizeConfidence(record.confidence),
    evidence: normalizedEvidence,
    createdAt: createdAt || new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  } as Omit<T, "analysisSource" | "status" | "evidenceLevel" | "confidence" | "evidence" | "createdAt" | "updatedAt"> & {
    projectId: string;
    analysisSource: AnalysisSource;
    evidenceLevel: EvidenceLevel;
    status: ReviewStatus;
    confidence: Confidence;
    evidence: EvidenceReference[];
    createdAt: string;
    updatedAt: string;
  };
}
