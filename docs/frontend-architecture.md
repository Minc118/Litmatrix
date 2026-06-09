# Frontend Architecture

This document defines the target frontend structure for LitMatrix. It does not require implementation in this phase.

## Responsibilities

The frontend renders the LitMatrix workspace, calls backend API routes, and displays normalized Analysis Store data. It must never call Gemini, Zotero, Neon, Antigravity, PDF parsers, or other secret-based services directly.

## Suggested Route Structure

The exact framework may be chosen in a later implementation phase. If the app uses Next.js App Router, the suggested route structure is:

```text
/
/new
/projects
/projects/[projectId]
/projects/[projectId]/papers
/projects/[projectId]/papers/[paperId]
/projects/[projectId]/overview
/projects/[projectId]/analysis
/projects/[projectId]/review
/projects/[projectId]/matrix
/projects/[projectId]/tools
/projects/[projectId]/themes
/projects/[projectId]/gaps
/projects/[projectId]/arguments
/projects/[projectId]/innovation
/projects/[projectId]/writing-plan
/projects/[projectId]/presentation-plan
/projects/[projectId]/export
```

Required pages or page capabilities:

- Landing Page.
- New Analysis.
- Project Dashboard.
- Paper Workspace.
- Paper Overview.
- AI Analysis.
- AI Suggestion Review.
- Extraction Matrix.
- Project Tools.
- Theme Clustering.
- Gap Map.
- Argument Candidates.
- Innovation Opportunities.
- Writing Plan.
- Presentation Plan.
- Export.

The PDF upload option and future Zotero connection option must remain visible or supported in planned flows.

## Page Structure

Recommended page organization:

- `app` or `src/app`: route entries and route-level loading/error boundaries.
- `components/layout`: shell, navigation, project header, workspace tabs, side panels.
- `components/project`: project dashboard, project metadata, research question summaries.
- `components/papers`: paper list, paper card, paper detail header, metadata panels.
- `components/analysis`: overview panels, suggestion cards, evidence blocks, confidence indicators.
- `components/review`: suggestion review queue, accept/edit/reject controls, decision history.
- `components/matrix`: extraction matrix table, row editor, status filters.
- `components/synthesis`: theme clusters, consensus/conflict items, gap map, argument candidates.
- `components/plans`: writing plan and presentation plan views.
- `components/import`: PDF upload placeholder, Zotero connection placeholder, manual import form.
- `components/export`: markdown, CSV, and JSON export controls.
- `lib/api`: typed API client wrappers.
- `lib/types`: shared frontend types generated from or aligned with the data contract.

## Layout Components

Recommended layout components:

- App shell with stable navigation.
- Project workspace shell with project-level tabs.
- Paper workspace shell with paper-level navigation.
- Review queue layout for AI suggestions.
- Matrix workspace layout for extraction editing.
- Synthesis workspace layout for multi-paper analysis.
- Export workspace layout.

Layouts should keep research workflows scan-friendly and avoid marketing-style screens after the landing page.

## Reusable UI Components

Reusable components should be data-source agnostic:

- `SourceBadge` for `analysisSource`.
- `EvidenceLevelBadge` for `evidenceLevel`.
- `ConfidenceBadge` for `confidence`.
- `ReviewStatusBadge` for `status`.
- `EvidenceList`.
- `SuggestionCard`.
- `ReviewDecisionControls`.
- `PaperMetadataPanel`.
- `ExtractionMatrixTable`.
- `ThemeClusterList`.
- `GapMapList`.
- `ArgumentCandidateList`.
- `InnovationOpportunityList`.
- `PlanOutline`.
- `ProviderStatusPanel`.
- `DemoModeBanner` or subtle demo indicator.

Components must accept normalized props, not provider raw responses.

## Page-to-Data Mapping

```text
Landing Page
  -> app metadata and demo mode state

New Analysis
  -> provider status, import options, project creation contract

Project Dashboard
  -> Project, ResearchQuestion, KeywordGroup, Paper summaries, AnalysisRun summaries

Paper Workspace
  -> Paper, PaperOverview, paper-scoped AISuggestion, ReviewDecision

Paper Overview
  -> PaperOverview records and supporting evidence

AI Analysis
  -> AISuggestion records grouped by paper, task, and evidence level

AI Suggestion Review
  -> AISuggestion plus ReviewDecision mutation contract

Extraction Matrix
  -> ExtractionMatrixRow records; confirmed values only

Project Tools
  -> provider status, import status, export entry points

Theme Clustering
  -> ThemeCluster records generated from confirmed extraction values

Gap Map
  -> GapItem records with supporting paper IDs

Argument Candidates
  -> ArgumentCandidate records with evidence links

Innovation Opportunities
  -> InnovationOpportunity records with supporting gaps and papers

Writing Plan
  -> WritingPlan generated from confirmed synthesis inputs

Presentation Plan
  -> PresentationPlan generated from confirmed synthesis inputs

Export
  -> export API contracts for markdown, CSV, and JSON
```

## State Management Strategy

Prefer server-state tooling or framework-native data fetching for API data. Local component state should be limited to UI concerns such as filters, selected tabs, draft edits, modal state, and optimistic review controls.

Guidelines:

- Treat backend API responses as the source of truth.
- Cache read routes by project and paper IDs where appropriate.
- Invalidate or refresh relevant queries after review decisions and matrix edits.
- Keep provider status separate from analysis data.
- Do not store secrets or provider credentials in client state.

## API Client Strategy

Create a small typed API client that wraps `fetch` calls to `/api/*` routes. The client should:

- Return normalized data contract objects.
- Handle demo mode responses the same as production responses.
- Convert HTTP and validation errors into UI-safe error objects.
- Avoid importing server-only provider code.
- Avoid coupling components to route URL construction.

## Loading States

Loading states should match the page purpose:

- Project lists: skeleton rows or compact list placeholders.
- Paper workspace: metadata skeleton and analysis panel skeleton.
- Matrix: stable table skeleton with fixed columns.
- Synthesis pages: section-level skeletons for clusters, gaps, and arguments.
- Provider status: small pending indicators.

Loading text should not shift stable layouts.

## Empty States

Empty states should be actionable but not misleading:

- No projects: offer to start a new analysis.
- No papers: preserve PDF upload and future Zotero connection options.
- No AI suggestions: explain that analysis has not run or no provider is configured.
- No confirmed extraction rows: prompt review before synthesis.
- No synthesis outputs: state that confirmed extraction values are required.

## Error States

Error states should distinguish:

- Demo data unavailable.
- Backend unavailable.
- Provider unconfigured.
- Provider failed.
- Import validation failed.
- Database unavailable.
- Authorization failure, if auth is later added.

Errors should not display secrets, raw provider payloads, stack traces, or full connection strings.

## Demo Mode Behavior

In demo mode, the frontend still calls backend API routes. The backend may return mock or seed records. The UI should clearly but subtly indicate demo mode and avoid presenting mock analysis as real research evidence.

Demo mode must support browsing:

- Project dashboard.
- Papers.
- Overviews.
- AI suggestions.
- Review states.
- Extraction matrix.
- Theme clusters.
- Gap map.
- Argument candidates.
- Innovation opportunities.
- Writing plan.
- Presentation plan.
- Export placeholders.

## Existing Prototype Mapping

Future implementation should map the existing UI prototype into the final architecture instead of rewriting it by default:

- Existing landing or home screen maps to Landing Page.
- Existing upload or start flow maps to New Analysis.
- Existing project summary screen maps to Project Dashboard.
- Existing paper detail views map to Paper Workspace and Paper Overview.
- Existing AI analysis panels map to AI Analysis and AI Suggestion Review.
- Existing table or spreadsheet-like views map to Extraction Matrix.
- Existing synthesis or insights screens map to Theme Clustering, Gap Map, Argument Candidates, and Innovation Opportunities.
- Existing plan or export screens map to Writing Plan, Presentation Plan, and Export.

The UI direction should be preserved unless the user explicitly approves redesign work.
