export type AnalysisSource =
  | "mock"
  | "gemini-api"
  | "antigravity-local"
  | "manual"
  | "imported"
  | "zotero-local"
  | "zotero-web"
  | "pdf-parser";

export type EvidenceLevel =
  | "metadata-only"
  | "abstract-based"
  | "full-text"
  | "user-notes"
  | "mixed";

export type ReviewStatus =
  | "pending-review"
  | "accepted"
  | "edited"
  | "rejected"
  | "saved-as-idea";

export type Confidence = "high" | "medium" | "low" | "tentative";

export type AnalysisMetadata = {
  id: string;
  projectId: string;
  paperId?: string;
  analysisSource: AnalysisSource;
  evidenceLevel: EvidenceLevel;
  status: ReviewStatus;
  confidence: Confidence;
  createdAt: string;
  updatedAt: string;
};

export type EvidenceReference = {
  paperId: string;
  sourceField?: "title" | "abstract" | "fullText" | "metadata" | "userNotes" | "importedNotes";
  quote?: string;
  page?: number;
  section?: string;
  note?: string;
};

export type Project = {
  id: string;
  title: string;
  description?: string | null;
  status?: "draft" | "active" | "archived";
  demo?: boolean;
  userId?: string | null;
  createdAt: string;
  updatedAt: string;
};

export type ResearchQuestion = {
  id: string;
  projectId: string;
  text: string;
  rationale?: string | null;
  createdAt: string;
  updatedAt: string;
};

export type KeywordGroup = {
  id: string;
  projectId: string;
  label: string;
  keywords: string[];
  createdAt: string;
  updatedAt: string;
};

export type Paper = {
  id: string;
  projectId: string;
  title: string;
  authors?: string[];
  year?: number | null;
  venue?: string | null;
  doi?: string | null;
  url?: string | null;
  abstract?: string | null;
  zoteroItemKey?: string | null;
  pdfFileId?: string | null;
  tags?: string[];
  createdAt: string;
  updatedAt: string;
};

export type PaperOverview = AnalysisMetadata & {
  paperId: string;
  problem?: string | null;
  objective?: string | null;
  method?: string | null;
  dataset?: string | null;
  findings?: string | null;
  limitations?: string | null;
  evidence: EvidenceReference[];
};

export type AISuggestion = AnalysisMetadata & {
  suggestionType:
    | "paper-overview"
    | "extraction-field"
    | "theme"
    | "gap"
    | "argument"
    | "innovation"
    | "writing-plan"
    | "presentation-plan";
  title: string;
  content: string;
  targetField?: string | null;
  evidence: EvidenceReference[];
};

export type ReviewDecision = {
  id: string;
  projectId: string;
  paperId?: string;
  suggestionId: string;
  decision: "accepted" | "edited" | "rejected" | "saved-as-idea";
  editedContent?: string | null;
  reviewerNote?: string | null;
  createdAt: string;
  updatedAt: string;
};

export type ExtractionMatrixRow = AnalysisMetadata & {
  paperId: string;
  fieldKey: string;
  fieldLabel: string;
  suggestedValue?: string | null;
  confirmedValue?: string | null;
  confirmedByDecisionId?: string | null;
  evidence: EvidenceReference[];
};

export type ThemeCluster = AnalysisMetadata & {
  label: string;
  summary: string;
  supportingPaperIds: string[];
  supportingMatrixRowIds: string[];
  evidence: EvidenceReference[];
};

export type ConsensusConflictItem = AnalysisMetadata & {
  itemType: "consensus" | "conflict" | "complementarity";
  claim: string;
  supportingPaperIds: string[];
  contrastingPaperIds?: string[];
  evidence: EvidenceReference[];
};

export type GapItem = AnalysisMetadata & {
  gapType?: "method" | "dataset" | "evaluation" | "theory" | "application" | "other";
  title: string;
  description: string;
  supportingPaperIds: string[];
  evidence: EvidenceReference[];
};

export type ArgumentCandidate = AnalysisMetadata & {
  claim: string;
  rationale: string;
  supportingPaperIds: string[];
  relatedGapIds?: string[];
  evidence: EvidenceReference[];
};

export type InnovationOpportunity = AnalysisMetadata & {
  title: string;
  opportunity: string;
  rationale: string;
  supportingPaperIds: string[];
  relatedGapIds?: string[];
  evidence: EvidenceReference[];
};

export type WritingPlan = AnalysisMetadata & {
  title: string;
  sections: Array<{
    id: string;
    heading: string;
    purpose: string;
    supportingPaperIds: string[];
    notes?: string | null;
  }>;
  evidence: EvidenceReference[];
};

export type PresentationPlan = AnalysisMetadata & {
  title: string;
  slides: Array<{
    id: string;
    title: string;
    objective: string;
    supportingPaperIds: string[];
    speakerNotes?: string | null;
  }>;
  evidence: EvidenceReference[];
};

export type AnalysisRun = {
  id: string;
  projectId: string;
  paperId?: string;
  runType: "overview" | "extraction" | "synthesis" | "import" | "export";
  analysisSource: AnalysisSource;
  status: "queued" | "running" | "completed" | "failed" | "cancelled";
  startedAt?: string | null;
  completedAt?: string | null;
  errorCode?: string | null;
  errorMessage?: string | null;
  createdAt: string;
  updatedAt: string;
};

export type ImportJob = {
  id: string;
  projectId: string;
  importType:
    | "antigravity-json"
    | "manual-notes"
    | "zotero-local"
    | "zotero-web"
    | "pdf-parser"
    | "notebooklm-notes";
  analysisSource: AnalysisSource;
  status: "pending" | "validating" | "imported" | "failed";
  inputSummary?: string | null;
  recordsCreated?: number;
  recordsRejected?: number;
  validationErrors?: Array<{
    path?: string;
    message: string;
  }>;
  createdAt: string;
  updatedAt: string;
};

export type ProjectDetail = Project & {
  researchQuestions: ResearchQuestion[];
  keywordGroups: KeywordGroup[];
};

export type ApiSuccess<T> = {
  data: T;
};

export type ApiError = {
  error: {
    code: string;
    message: string;
    details?: Record<string, unknown>;
  };
};

export type ProviderCapability = {
  id: "gemini" | "zotero-local" | "zotero-web" | "antigravity-import" | "pdf-parser";
  label: string;
  configured: boolean;
  available: boolean;
  requiresExternalConfiguration: boolean;
  message: string;
};

export type ProviderStatusResponse = {
  demoMode: boolean;
  providers: ProviderCapability[];
  importers: ProviderCapability[];
  generatedAt: string;
};

export interface ExtractionField {
  key: string;
  label: string;
  required: boolean;
  description?: string;
}

export interface AnalysisCommand {
  id: string;
  label: string;
  purpose: string;
  inputRecordTypes: string[];
  outputResultType: string;
  evidenceRequirements: string;
  promptTemplate: string;
}

export interface ProjectContract {
  projectId: string;
  skillVersion: string;
  contractVersion: string;
  extractionSchemaVersion: string;
  commandPackVersion: string;
  researchQuestionIds: string[];
  extractionFields: ExtractionField[];
  commandPack: AnalysisCommand[];
}

