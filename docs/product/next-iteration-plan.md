# LitMatrix Next-Iteration Plan

This document proposes a step-by-step implementation plan for the next product development iteration.

---

## Step 1: Fix Workspace Navigation & Preserve Paper Context (P0)

### Objective
Ensure that selecting a paper in the library and clicking through its Overview, AI Analysis, and Review tabs does not lose the paper context.

### Proposed Changes
1. **`StageTabs.tsx`**: Update the component to accept a `selectedPaperId?: string` prop. If provided, append `?paperId=${selectedPaperId}` to all tab navigation links.
2. **Page & View Updates**:
   * Update the route wrappers (`overview/page.tsx`, `analysis/page.tsx`, `review/page.tsx`) to extract the `paperId` search parameter.
   * Update the view components (`PaperOverviewWorkspaceView`, `AIAnalysisWorkspaceView`, `ReviewWorkspaceView`) to use the selected paper instead of defaulting to the first paper (`papers[0]`).
   * Add a paper-switching dropdown in the top bar of these workspaces so the user can easily hop between papers in the overview/analysis views without going back to the Library.

---

## Step 2: Integrate Synthesis Review Suggestions (P0)

### Objective
Make the review decisions functional for all suggestion types. When a user approves a theme, gap, or writing outline suggestion, it should materialize in the database.

### Proposed Changes
* Update `lib/server/services/reviewService.ts`:
  * Expand the upsert logic in `createReviewDecision` beyond `"extraction-field"`.
  * If the suggestion type is `"theme"`, call `synthesisRepository.upsertThemeClusters`.
  * If the suggestion type is `"gap"`, call `synthesisRepository.upsertGapItems`.
  * If the suggestion type is `"argument"`, call `synthesisRepository.upsertArgumentCandidates`.
  * If the suggestion type is `"innovation"`, call `synthesisRepository.upsertInnovationOpportunities`.
  * If the suggestion type is `"writing-plan"`, call `synthesisRepository.upsertWritingPlan`.
  * If the suggestion type is `"presentation-plan"`, call `synthesisRepository.upsertPresentationPlan`.

---

## Step 3: Enable Synthesis Editing (P1)

### Objective
Ensure that clustered themes and outline plans can be refined by the user before writing.

### Proposed Changes
* Update `SynthesisRouteView.tsx` to support edit dialogs. Double-clicking or clicking an edit pencil on cards should open an input popup allowing summaries/rationales to be changed and saved to the database.

---

## Step 4: Implement Client-Side Workspace Exporter (P1)

### Objective
Allow the user to download their verified review matrix and writing outlines for seminar composition.

### Proposed Changes
* Update `ExportWorkspaceView.tsx` to build client-side download payloads:
  * **CSV Export**: Combines matrix fields (Paper Title, Field Key, Suggested Value, Confirmed Value, Provenance) into a download-safe string.
  * **Markdown Export**: Generates a clean Markdown review report, organizing papers by their problem/methods, and writing sections by headings and details.
