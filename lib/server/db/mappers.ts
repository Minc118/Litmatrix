import "server-only";

import type { InferSelectModel } from "drizzle-orm";
import {
  aiSuggestions,
  argumentCandidates,
  consensusConflictItems,
  extractionMatrixRows,
  gapItems,
  importJobs,
  innovationOpportunities,
  keywordGroups,
  papers,
  paperOverviews,
  presentationPlans,
  projects,
  researchQuestions,
  reviewDecisions,
  themeClusters,
  writingPlans,
} from "@/lib/server/db/schema";
import type {
  AISuggestion,
  ArgumentCandidate,
  ConsensusConflictItem,
  EvidenceReference,
  ExtractionMatrixRow,
  GapItem,
  ImportJob,
  InnovationOpportunity,
  KeywordGroup,
  Paper,
  PaperOverview,
  PresentationPlan,
  Project,
  ResearchQuestion,
  ReviewDecision,
  ThemeCluster,
  WritingPlan,
} from "@/lib/types/litmatrix";

type ProjectRow = InferSelectModel<typeof projects>;
type ResearchQuestionRow = InferSelectModel<typeof researchQuestions>;
type KeywordGroupRow = InferSelectModel<typeof keywordGroups>;
type PaperRow = InferSelectModel<typeof papers>;
type PaperOverviewRow = InferSelectModel<typeof paperOverviews>;
type AISuggestionRow = InferSelectModel<typeof aiSuggestions>;
type ReviewDecisionRow = InferSelectModel<typeof reviewDecisions>;
type ExtractionMatrixRowRow = InferSelectModel<typeof extractionMatrixRows>;
type ThemeClusterRow = InferSelectModel<typeof themeClusters>;
type ConsensusConflictRow = InferSelectModel<typeof consensusConflictItems>;
type GapItemRow = InferSelectModel<typeof gapItems>;
type ArgumentCandidateRow = InferSelectModel<typeof argumentCandidates>;
type InnovationOpportunityRow = InferSelectModel<typeof innovationOpportunities>;
type WritingPlanRow = InferSelectModel<typeof writingPlans>;
type PresentationPlanRow = InferSelectModel<typeof presentationPlans>;
type ImportJobRow = InferSelectModel<typeof importJobs>;

function iso(value: Date | string | null): string | null {
  if (!value) {
    return null;
  }
  return value instanceof Date ? value.toISOString() : new Date(value).toISOString();
}

function requiredIso(value: Date | string): string {
  return iso(value) ?? new Date().toISOString();
}

function textArray(value: unknown): string[] {
  return Array.isArray(value) ? value.filter((item): item is string => typeof item === "string") : [];
}

function evidenceArray(value: unknown): EvidenceReference[] {
  return Array.isArray(value) ? (value as EvidenceReference[]) : [];
}

export function toProject(row: ProjectRow): Project {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    status: row.status,
    demo: row.demo,
    userId: row.userId,
    createdAt: requiredIso(row.createdAt),
    updatedAt: requiredIso(row.updatedAt),
  };
}

export function toResearchQuestion(row: ResearchQuestionRow): ResearchQuestion {
  return {
    id: row.id,
    projectId: row.projectId,
    text: row.text,
    rationale: row.rationale,
    createdAt: requiredIso(row.createdAt),
    updatedAt: requiredIso(row.updatedAt),
  };
}

export function toKeywordGroup(row: KeywordGroupRow): KeywordGroup {
  return {
    id: row.id,
    projectId: row.projectId,
    label: row.label,
    keywords: textArray(row.keywords),
    createdAt: requiredIso(row.createdAt),
    updatedAt: requiredIso(row.updatedAt),
  };
}

export function toPaper(row: PaperRow): Paper {
  return {
    id: row.id,
    projectId: row.projectId,
    title: row.title,
    authors: textArray(row.authors),
    year: row.year,
    venue: row.venue,
    doi: row.doi,
    url: row.url,
    abstract: row.abstract,
    zoteroItemKey: row.zoteroItemKey,
    pdfFileId: row.pdfFileId,
    tags: textArray(row.tags),
    createdAt: requiredIso(row.createdAt),
    updatedAt: requiredIso(row.updatedAt),
  };
}

export function toPaperOverview(row: PaperOverviewRow): PaperOverview {
  return {
    id: row.id,
    projectId: row.projectId,
    paperId: row.paperId,
    analysisSource: row.analysisSource,
    evidenceLevel: row.evidenceLevel,
    status: row.status,
    confidence: row.confidence,
    problem: row.problem,
    objective: row.objective,
    method: row.method,
    dataset: row.dataset,
    findings: row.findings,
    limitations: row.limitations,
    evidence: evidenceArray(row.evidence),
    createdAt: requiredIso(row.createdAt),
    updatedAt: requiredIso(row.updatedAt),
  };
}

export function toAISuggestion(row: AISuggestionRow): AISuggestion {
  return {
    id: row.id,
    projectId: row.projectId,
    paperId: row.paperId ?? undefined,
    analysisSource: row.analysisSource,
    evidenceLevel: row.evidenceLevel,
    status: row.status,
    confidence: row.confidence,
    suggestionType: row.suggestionType,
    title: row.title,
    content: row.content,
    targetField: row.targetField,
    evidence: evidenceArray(row.evidence),
    createdAt: requiredIso(row.createdAt),
    updatedAt: requiredIso(row.updatedAt),
  };
}

export function toReviewDecision(row: ReviewDecisionRow): ReviewDecision {
  return {
    id: row.id,
    projectId: row.projectId,
    paperId: row.paperId ?? undefined,
    suggestionId: row.suggestionId,
    decision: row.decision,
    editedContent: row.editedContent,
    reviewerNote: row.reviewerNote,
    createdAt: requiredIso(row.createdAt),
    updatedAt: requiredIso(row.updatedAt),
  };
}

export function toExtractionMatrixRow(row: ExtractionMatrixRowRow): ExtractionMatrixRow {
  return {
    id: row.id,
    projectId: row.projectId,
    paperId: row.paperId,
    analysisSource: row.analysisSource,
    evidenceLevel: row.evidenceLevel,
    status: row.status,
    confidence: row.confidence,
    fieldKey: row.fieldKey,
    fieldLabel: row.fieldLabel,
    suggestedValue: row.suggestedValue,
    confirmedValue: row.confirmedValue,
    confirmedByDecisionId: row.confirmedByDecisionId,
    evidence: evidenceArray(row.evidence),
    createdAt: requiredIso(row.createdAt),
    updatedAt: requiredIso(row.updatedAt),
  };
}

export function toThemeCluster(row: ThemeClusterRow): ThemeCluster {
  return {
    id: row.id,
    projectId: row.projectId,
    paperId: row.paperId ?? undefined,
    analysisSource: row.analysisSource,
    evidenceLevel: row.evidenceLevel,
    status: row.status,
    confidence: row.confidence,
    label: row.label,
    summary: row.summary,
    supportingPaperIds: textArray(row.supportingPaperIds),
    supportingMatrixRowIds: textArray(row.supportingMatrixRowIds),
    evidence: evidenceArray(row.evidence),
    createdAt: requiredIso(row.createdAt),
    updatedAt: requiredIso(row.updatedAt),
  };
}

export function toConsensusConflictItem(row: ConsensusConflictRow): ConsensusConflictItem {
  return {
    id: row.id,
    projectId: row.projectId,
    paperId: row.paperId ?? undefined,
    analysisSource: row.analysisSource,
    evidenceLevel: row.evidenceLevel,
    status: row.status,
    confidence: row.confidence,
    itemType: row.itemType,
    claim: row.claim,
    supportingPaperIds: textArray(row.supportingPaperIds),
    contrastingPaperIds: textArray(row.contrastingPaperIds),
    evidence: evidenceArray(row.evidence),
    createdAt: requiredIso(row.createdAt),
    updatedAt: requiredIso(row.updatedAt),
  };
}

export function toGapItem(row: GapItemRow): GapItem {
  return {
    id: row.id,
    projectId: row.projectId,
    paperId: row.paperId ?? undefined,
    analysisSource: row.analysisSource,
    evidenceLevel: row.evidenceLevel,
    status: row.status,
    confidence: row.confidence,
    gapType: row.gapType ?? undefined,
    title: row.title,
    description: row.description,
    supportingPaperIds: textArray(row.supportingPaperIds),
    evidence: evidenceArray(row.evidence),
    createdAt: requiredIso(row.createdAt),
    updatedAt: requiredIso(row.updatedAt),
  };
}

export function toArgumentCandidate(row: ArgumentCandidateRow): ArgumentCandidate {
  return {
    id: row.id,
    projectId: row.projectId,
    paperId: row.paperId ?? undefined,
    analysisSource: row.analysisSource,
    evidenceLevel: row.evidenceLevel,
    status: row.status,
    confidence: row.confidence,
    claim: row.claim,
    rationale: row.rationale,
    supportingPaperIds: textArray(row.supportingPaperIds),
    relatedGapIds: textArray(row.relatedGapIds),
    evidence: evidenceArray(row.evidence),
    createdAt: requiredIso(row.createdAt),
    updatedAt: requiredIso(row.updatedAt),
  };
}

export function toInnovationOpportunity(row: InnovationOpportunityRow): InnovationOpportunity {
  return {
    id: row.id,
    projectId: row.projectId,
    paperId: row.paperId ?? undefined,
    analysisSource: row.analysisSource,
    evidenceLevel: row.evidenceLevel,
    status: row.status,
    confidence: row.confidence,
    title: row.title,
    opportunity: row.opportunity,
    rationale: row.rationale,
    supportingPaperIds: textArray(row.supportingPaperIds),
    relatedGapIds: textArray(row.relatedGapIds),
    evidence: evidenceArray(row.evidence),
    createdAt: requiredIso(row.createdAt),
    updatedAt: requiredIso(row.updatedAt),
  };
}

export function toWritingPlan(row: WritingPlanRow): WritingPlan {
  return {
    id: row.id,
    projectId: row.projectId,
    paperId: row.paperId ?? undefined,
    analysisSource: row.analysisSource,
    evidenceLevel: row.evidenceLevel,
    status: row.status,
    confidence: row.confidence,
    title: row.title,
    sections: Array.isArray(row.sections) ? row.sections : [],
    evidence: evidenceArray(row.evidence),
    createdAt: requiredIso(row.createdAt),
    updatedAt: requiredIso(row.updatedAt),
  };
}

export function toPresentationPlan(row: PresentationPlanRow): PresentationPlan {
  return {
    id: row.id,
    projectId: row.projectId,
    paperId: row.paperId ?? undefined,
    analysisSource: row.analysisSource,
    evidenceLevel: row.evidenceLevel,
    status: row.status,
    confidence: row.confidence,
    title: row.title,
    slides: Array.isArray(row.slides) ? row.slides : [],
    evidence: evidenceArray(row.evidence),
    createdAt: requiredIso(row.createdAt),
    updatedAt: requiredIso(row.updatedAt),
  };
}

export function toImportJob(row: ImportJobRow): ImportJob {
  return {
    id: row.id,
    projectId: row.projectId,
    importType: row.importType,
    analysisSource: row.analysisSource,
    status: row.status,
    inputSummary: row.inputSummary,
    recordsCreated: row.recordsCreated,
    recordsRejected: row.recordsRejected,
    validationErrors: Array.isArray(row.validationErrors) ? row.validationErrors : [],
    createdAt: requiredIso(row.createdAt),
    updatedAt: requiredIso(row.updatedAt),
  };
}
