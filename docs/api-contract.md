# API Contract

This document defines planned backend API routes. Do not implement these routes in the architecture phase.

All routes return JSON unless a future export route explicitly returns a file response. Frontend code should call these backend routes and should not import provider, importer, or database modules.

## Common Response Shapes

Success:

```json
{
  "data": {}
}
```

List success:

```json
{
  "data": []
}
```

Error:

```json
{
  "error": {
    "code": "VALIDATION_FAILED",
    "message": "Request validation failed.",
    "details": {}
  }
}
```

Errors must not expose secrets, database URLs, API keys, raw provider payloads, or stack traces in production.

## Read Routes

### GET /api/projects

- Purpose: List projects visible to the current user or demo context.
- Input: Optional query filters such as `status`.
- Output: `Project[]`.
- Security: Later auth should restrict projects by user or workspace.
- Demo-safe: Yes.
- External configuration: No.

### GET /api/projects/:projectId

- Purpose: Read one project with research questions and keyword groups if needed.
- Input: `projectId`.
- Output: `Project` plus optional `researchQuestions` and `keywordGroups`.
- Security: Validate access to project.
- Demo-safe: Yes.
- External configuration: No.

### GET /api/projects/:projectId/papers

- Purpose: List papers in a project.
- Input: `projectId`.
- Output: `Paper[]`.
- Security: Validate access to project.
- Demo-safe: Yes.
- External configuration: No.

### GET /api/projects/:projectId/overviews

- Purpose: List paper overviews for a project.
- Input: `projectId`, optional `paperId`.
- Output: `PaperOverview[]`.
- Security: Validate access to project.
- Demo-safe: Yes.
- External configuration: No.

### GET /api/projects/:projectId/suggestions

- Purpose: List AI suggestions for review.
- Input: `projectId`, optional filters `paperId`, `suggestionType`, `status`.
- Output: `AISuggestion[]`.
- Security: Validate access to project.
- Demo-safe: Yes.
- External configuration: No.

### GET /api/projects/:projectId/review-decisions

- Purpose: List review decisions for suggestions.
- Input: `projectId`, optional `paperId`.
- Output: `ReviewDecision[]`.
- Security: Validate access to project.
- Demo-safe: Yes.
- External configuration: No.

### GET /api/projects/:projectId/extraction-matrix

- Purpose: List extraction matrix rows.
- Input: `projectId`, optional `paperId`, `status`.
- Output: `ExtractionMatrixRow[]`.
- Security: Validate access to project.
- Demo-safe: Yes.
- External configuration: No.

### GET /api/projects/:projectId/theme-clusters

- Purpose: List theme clusters generated from confirmed extraction values.
- Input: `projectId`.
- Output: `ThemeCluster[]`.
- Security: Validate access to project.
- Demo-safe: Yes.
- External configuration: No.

### GET /api/projects/:projectId/consensus-conflict

- Purpose: List consensus, conflict, and complementarity items.
- Input: `projectId`.
- Output: `ConsensusConflictItem[]`.
- Security: Validate access to project.
- Demo-safe: Yes.
- External configuration: No.

### GET /api/projects/:projectId/gaps

- Purpose: List research gaps backed by confirmed evidence.
- Input: `projectId`.
- Output: `GapItem[]`.
- Security: Validate access to project.
- Demo-safe: Yes.
- External configuration: No.

### GET /api/projects/:projectId/arguments

- Purpose: List argument candidates backed by confirmed extraction and synthesis records.
- Input: `projectId`.
- Output: `ArgumentCandidate[]`.
- Security: Validate access to project.
- Demo-safe: Yes.
- External configuration: No.

### GET /api/projects/:projectId/innovation-opportunities

- Purpose: List innovation opportunities tied to supporting papers and gaps.
- Input: `projectId`.
- Output: `InnovationOpportunity[]`.
- Security: Validate access to project.
- Demo-safe: Yes.
- External configuration: No.

### GET /api/projects/:projectId/writing-plan

- Purpose: Read writing plan for a project.
- Input: `projectId`.
- Output: `WritingPlan | null`.
- Security: Validate access to project.
- Demo-safe: Yes.
- External configuration: No.

### GET /api/projects/:projectId/presentation-plan

- Purpose: Read presentation plan for a project.
- Input: `projectId`.
- Output: `PresentationPlan | null`.
- Security: Validate access to project.
- Demo-safe: Yes.
- External configuration: No.

### GET /api/providers/status

- Purpose: Report provider and importer availability without exposing secrets.
- Input: None.
- Output: Provider status object, for example configured/reachable booleans and safe messages.
- Security: Must not return API keys, database URLs, or token fragments.
- Demo-safe: Yes.
- External configuration: No for route availability; yes for configured provider statuses.

## Mutation Routes For Later Implementation

### POST /api/projects

- Purpose: Create a project.
- Input: Project title, optional description, research questions, keyword groups.
- Output: Created `Project`.
- Security: Later auth should attach owner/workspace.
- Demo-safe: Maybe read-only in demo; product decision required.
- External configuration: Database required outside mock mode.

### POST /api/projects/:projectId/papers

- Purpose: Add paper metadata manually or from an already validated import.
- Input: `projectId`, paper metadata.
- Output: Created `Paper`.
- Security: Validate access and input.
- Demo-safe: Maybe read-only in demo.
- External configuration: Database required outside mock mode.

### POST /api/analysis/overview

- Purpose: Request paper overview analysis.
- Input: `projectId`, `paperId`, requested provider or default provider.
- Output: `AnalysisRun` and resulting `PaperOverview` or `AISuggestion[]` when complete.
- Security: Server-side provider call only.
- Demo-safe: Yes if it returns mock analysis; otherwise read-only.
- External configuration: Gemini or another provider required for real analysis.

### POST /api/analysis/extraction

- Purpose: Request extraction suggestions for one or more papers.
- Input: `projectId`, `paperIds`, extraction schema or default fields.
- Output: `AnalysisRun` and `AISuggestion[]` or `ExtractionMatrixRow[]` candidates.
- Security: Server-side provider call only.
- Demo-safe: Yes if mock-backed.
- External configuration: Gemini or another provider required for real analysis.

### POST /api/analysis/synthesis

- Purpose: Generate synthesis from confirmed extraction values.
- Input: `projectId`, synthesis options.
- Output: `AnalysisRun` and generated theme clusters, gaps, arguments, opportunities, and plans.
- Security: Must use confirmed extraction values only.
- Demo-safe: Yes if mock-backed.
- External configuration: Gemini or another provider required for real synthesis.

### POST /api/review-decisions

- Purpose: Record accept, edit, reject, or save-as-idea decisions.
- Input: `suggestionId`, `decision`, optional `editedContent`, optional note.
- Output: `ReviewDecision` and updated `AISuggestion`.
- Security: Validate access and allowed transitions.
- Demo-safe: Maybe read-only in demo.
- External configuration: Database required outside mock mode.

### PATCH /api/ai-suggestions/:suggestionId

- Purpose: Update suggestion status or safe editable metadata.
- Input: `suggestionId`, patch fields.
- Output: Updated `AISuggestion`.
- Security: Validate access; do not allow raw provider payload changes from UI.
- Demo-safe: Maybe read-only in demo.
- External configuration: Database required outside mock mode.

### PATCH /api/extraction-matrix/:rowId

- Purpose: Edit confirmed extraction values.
- Input: `rowId`, `confirmedValue`, optional evidence or note updates.
- Output: Updated `ExtractionMatrixRow`.
- Security: Validate access and preserve provenance.
- Demo-safe: Maybe read-only in demo.
- External configuration: Database required outside mock mode.

### POST /api/import/antigravity-json

- Purpose: Import Antigravity local JSON output.
- Input: `projectId`, JSON payload or server-side import job reference.
- Output: `ImportJob` and created normalized records summary.
- Security: Validate schema; do not allow frontend to read arbitrary local files.
- Demo-safe: No for real import; mock validation can be demo-safe.
- External configuration: `ANTIGRAVITY_IMPORT_ENABLED` and server-side import capability.

### POST /api/import/manual-notes

- Purpose: Import user-provided notes.
- Input: `projectId`, optional `paperId`, note content, evidence level.
- Output: `ImportJob` and created suggestions or extraction candidates.
- Security: Validate size and ownership.
- Demo-safe: Maybe read-only in demo.
- External configuration: Database required outside mock mode.

### POST /api/import/zotero-local

- Purpose: Import metadata from Zotero Local API.
- Input: `projectId`, collection or item selection.
- Output: `ImportJob` and created `Paper[]`.
- Security: Server-side local API call only.
- Demo-safe: No for real local import; status can be demo-safe.
- External configuration: Reachable Zotero Local API.

### POST /api/import/zotero-web

- Purpose: Import metadata from Zotero Web API.
- Input: `projectId`, collection or item selection.
- Output: `ImportJob` and created `Paper[]`.
- Security: Server-side Zotero API key only.
- Demo-safe: No for real web import; mock import can be demo-safe.
- External configuration: Zotero Web API credentials.

### POST /api/export/markdown

- Purpose: Export project synthesis or selected content as Markdown.
- Input: `projectId`, export options.
- Output: Markdown content or file response.
- Security: Validate project access.
- Demo-safe: Yes.
- External configuration: No.

### POST /api/export/csv

- Purpose: Export extraction matrix or selected tables as CSV.
- Input: `projectId`, export options.
- Output: CSV content or file response.
- Security: Validate project access.
- Demo-safe: Yes.
- External configuration: No.

### POST /api/export/json

- Purpose: Export normalized project data as JSON.
- Input: `projectId`, export options.
- Output: JSON content or file response.
- Security: Validate project access and avoid secrets/raw provider payloads.
- Demo-safe: Yes.
- External configuration: No.
