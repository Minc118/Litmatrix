# Data Contract

This document defines shared LitMatrix data models for frontend, backend, providers, importers, and future database schemas. It is provider-agnostic and should be treated as the source of truth for implementation.

## Common Analysis Metadata

Every AI-generated or imported analysis object must include:

```ts
type AnalysisSource =
  | "mock"
  | "gemini-api"
  | "antigravity-local"
  | "manual"
  | "imported"
  | "zotero-local"
  | "zotero-web"
  | "pdf-parser";

type EvidenceLevel =
  | "metadata-only"
  | "abstract-based"
  | "full-text"
  | "user-notes"
  | "mixed";

type ReviewStatus =
  | "pending-review"
  | "accepted"
  | "edited"
  | "rejected"
  | "saved-as-idea";

type Confidence =
  | "high"
  | "medium"
  | "low"
  | "tentative";

type AnalysisMetadata = {
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
```

For project-level synthesis objects, `paperId` is optional. For paper-scoped objects, `paperId` is required.

## Evidence Representation

Evidence should be represented as structured references, not unsupported prose.

```ts
type EvidenceReference = {
  paperId: string;
  sourceField?: "title" | "abstract" | "fullText" | "metadata" | "userNotes" | "importedNotes";
  quote?: string;
  page?: number;
  section?: string;
  note?: string;
};
```

Rules:

- Do not fabricate quotes or page numbers.
- If page is unknown, omit `page`.
- If exact quote support is unavailable, use `note` and set lower confidence where appropriate.
- If information is missing, use `null` for unknown structured fields or the phrase `Not specified in the provided text.` for user-facing analysis text.

## Missing Information

Use:

- `null` for missing scalar values.
- Empty arrays for known-empty lists.
- `Not specified in the provided text.` for generated text fields where a missing claim must be explicit.
- `confidence: "low"` or `confidence: "tentative"` where evidence is incomplete.

Do not infer full methods, datasets, findings, page numbers, or citations from metadata alone.

## Reviewed Values vs AI Suggestions

AI outputs are suggestions until reviewed. Reviewed or confirmed values are represented by accepted or edited `ReviewDecision` records and by confirmed `ExtractionMatrixRow` values.

Rules:

- `AISuggestion.status` begins as `pending-review`.
- Accepted suggestions may become confirmed extraction values.
- Edited suggestions should preserve original suggestion provenance and store edited confirmed text separately.
- Rejected suggestions must not feed final synthesis.
- Saved-as-idea suggestions may remain visible but must not be treated as confirmed extraction values.

## Synthesis Input Rule

Only confirmed extraction values should be used for final synthesis, final gap maps, final argument candidates, final innovation opportunities, final writing plans, and final presentation plans.

## Models

### Project

Required:

- `id`
- `title`
- `createdAt`
- `updatedAt`

Optional:

- `description`
- `status`
- `demo`

```ts
type Project = {
  id: string;
  title: string;
  description?: string | null;
  status?: "draft" | "active" | "archived";
  demo?: boolean;
  createdAt: string;
  updatedAt: string;
};
```

### ResearchQuestion

```ts
type ResearchQuestion = {
  id: string;
  projectId: string;
  text: string;
  rationale?: string | null;
  createdAt: string;
  updatedAt: string;
};
```

### KeywordGroup

```ts
type KeywordGroup = {
  id: string;
  projectId: string;
  label: string;
  keywords: string[];
  createdAt: string;
  updatedAt: string;
};
```

### Paper

Required:

- `id`
- `projectId`
- `title`
- `createdAt`
- `updatedAt`

Optional:

- bibliographic metadata and file/import references.

```ts
type Paper = {
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
```

### PaperOverview

```ts
type PaperOverview = AnalysisMetadata & {
  paperId: string;
  problem?: string | null;
  objective?: string | null;
  method?: string | null;
  dataset?: string | null;
  findings?: string | null;
  limitations?: string | null;
  evidence: EvidenceReference[];
};
```

### AISuggestion

```ts
type AISuggestion = AnalysisMetadata & {
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
```

### ReviewDecision

```ts
type ReviewDecision = {
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
```

### ExtractionMatrixRow

```ts
type ExtractionMatrixRow = AnalysisMetadata & {
  paperId: string;
  fieldKey: string;
  fieldLabel: string;
  suggestedValue?: string | null;
  confirmedValue?: string | null;
  confirmedByDecisionId?: string | null;
  evidence: EvidenceReference[];
};
```

`confirmedValue` is the only value eligible for final synthesis.

### ThemeCluster

```ts
type ThemeCluster = AnalysisMetadata & {
  label: string;
  summary: string;
  supportingPaperIds: string[];
  supportingMatrixRowIds: string[];
  evidence: EvidenceReference[];
};
```

### ConsensusConflictItem

```ts
type ConsensusConflictItem = AnalysisMetadata & {
  itemType: "consensus" | "conflict" | "complementarity";
  claim: string;
  supportingPaperIds: string[];
  contrastingPaperIds?: string[];
  evidence: EvidenceReference[];
};
```

### GapItem

```ts
type GapItem = AnalysisMetadata & {
  gapType?: "method" | "dataset" | "evaluation" | "theory" | "application" | "other";
  title: string;
  description: string;
  supportingPaperIds: string[];
  evidence: EvidenceReference[];
};
```

### ArgumentCandidate

```ts
type ArgumentCandidate = AnalysisMetadata & {
  claim: string;
  rationale: string;
  supportingPaperIds: string[];
  relatedGapIds?: string[];
  evidence: EvidenceReference[];
};
```

### InnovationOpportunity

```ts
type InnovationOpportunity = AnalysisMetadata & {
  title: string;
  opportunity: string;
  rationale: string;
  supportingPaperIds: string[];
  relatedGapIds?: string[];
  evidence: EvidenceReference[];
};
```

### WritingPlan

```ts
type WritingPlan = AnalysisMetadata & {
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
```

### PresentationPlan

```ts
type PresentationPlan = AnalysisMetadata & {
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
```

### AnalysisRun

```ts
type AnalysisRun = {
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
```

### ImportJob

```ts
type ImportJob = {
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
```
