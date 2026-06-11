# LitMatrix PRD & Gap Analysis

This document outlines the product vision (PRD) for LitMatrix and analyzes the gaps between the current implementation and this vision.

---

## 1. PRD Reconstruction

### Product Goal
LitMatrix is an active workspace for systematic literature reviews (SLRs). It separates raw intake, AI extraction, human review, and synthesis so that every literature claim in a research project remains traceable to verified evidence snippets.

### Target User
Academics, researchers, and students writing review papers or doing research synthesis who need to organize papers, verify AI extractions, and plan out writing structures.

### Core Workflow
1. **Intake**: Import paper metadata and attachments (PDFs, Zotero RDFs, or structured Antigravity JSON payloads).
2. **Review**: Check and refine AI-generated paper-level overviews and extraction matrix rows.
3. **Refine**: Accept, edit, or reject extraction details, generating a verified spreadsheet of literature findings.
4. **Synthesize**: Cluster confirmed extractions into themes, document consensus/conflicts, and map research gaps.
5. **Formulate**: Derive new research arguments and innovation opportunities, linking each directly back to supporting papers.
6. **Plan & Export**: Draft section-by-section writing structures and export them as Markdown, CSV, or JSON.

### MVP Scope (Current Phase)
* Active workspace navigation for a single project boundary (`ocpm-demo`).
* Loading and processing Antigravity JSON payloads.
* Core interactive review workflow (accept/reject/edit extractions).
* Tabular extraction matrix with inline value editing.
* Populated read-only boards for themes, gaps, arguments, and plans.
* Local demo capability without requiring live Neon DB or Gemini credentials.

### Non-Goals
* Fully implementing live PDF layout extraction or Zotero web synchronization in this local code-development window.
* Calling external LLMs (e.g., live Gemini calls) — all calculations are provider-agnostic or loaded via static mock configurations.

### Key Pages & Visible Layout
* **Dashboard**: Workspace entry, displaying status and stats.
* **Paper Library**: Scrollable grid of papers.
* **Paper Workspace**: Master view with StageTabs linking Overview, Analysis, and Review, alongside a PDF viewer.
* **Extraction Matrix**: A clean grid for comparing papers and editing cells.
* **Synthesis & Plans**: Grouped boards for Themes, Gaps, Arguments, and Outlines.

---

## 2. Gap Analysis Table

| Desired Feature | Current Status | Existing Files Involved | Missing Work / Bug Details | Priority | Risk & Complexity |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Preserve Paper Context in Tabs** | ❌ **Broken**. Navigating to Overview, Analysis, or Review from a paper page drops the selected `paperId` and hardcodes the first paper. | `StageTabs.tsx`<br>`PaperOverviewWorkspaceView.tsx`<br>`AIAnalysisWorkspaceView.tsx`<br>`ReviewWorkspaceView.tsx` | Update `StageTabs` links to append `?paperId=[id]`. Parse query parameters in page views and display matching paper/overview/suggestions instead of hardcoded `papers[0]`. | **P0** | Low Risk / Low Complexity |
| **Synthesis Review Action Integration** | ❌ **Missing**. Accepting suggestions of types `"theme"`, `"gap"`, etc., only updates suggestion status; it does not write them into synthesis tables. | `reviewService.ts` | Extend `createReviewDecision` backend service to map accepted `"theme"`, `"gap"`, `"argument"`, and `"innovation"` suggestions to their respective DB repositories. | **P0** | Medium Risk / Medium Complexity |
| **Synthesis Inline Editing** | ❌ **Missing**. Themes, Gaps, Arguments, and Innovations are fully static read-only cards. | `SynthesisRouteView.tsx` | Add inline editing for synthesis summaries or edit buttons to update values in the database. | **P1** | Low Risk / Medium Complexity |
| **Interactive "Run Analysis" Simulation** | ❌ **Missing**. Button is disabled. User cannot simulate how raw PDFs get processed into suggestions. | `AIAnalysisPanel.tsx`<br>`analysisService.ts` | Provide a "Demo Run" simulation that creates suggestions from static templates when clicked, giving the user feedback. | **P1** | Low Risk / Low Complexity |
| **Interactive Export** | ❌ **Missing**. Markdown, CSV, and JSON download buttons are fully disabled. | `ExportWorkspaceView.tsx`<br>`litmatrixClient.ts` | Implement frontend CSV and Markdown builders to download the verified extraction matrix and writing plan outline. | **P1** | Low Risk / Low Complexity |
