# LitMatrix P0 Implementation Plan

This plan outlines the technical changes, file modifications, and new features to implement the LitMatrix P0 workflow end-to-end.

---

## 1. Data Model & Configurations

To avoid running database migrations on Neon, we will define Project Skill, Contract, Extraction Schema, and Command Pack configurations in a structured, extensible TypeScript/JSON system. This system will serve default settings for any project ID and specialized configurations for the `ocpm-demo` project.

### Files to Modify / Create
* `[NEW] lib/server/skills/projectSkills.ts`: Holds default and project-specific configs.
* `[MODIFY] lib/server/repositories/projectRepository.ts`: Expose project skill/contract metadata.

---

## 2. API Routes to Add / Update

We will add API routes to serve and modify the project skills, contracts, extraction schemas, and command packs:
* `[NEW] app/api/projects/[projectId]/skill/route.ts`: GET / POST for `project-skill.md`.
* `[NEW] app/api/projects/[projectId]/contract/route.ts`: GET for `project-contract.json`.
* `[NEW] app/api/projects/[projectId]/extraction-schema/route.ts`: GET / POST for `extraction-schema.json`.
* `[NEW] app/api/projects/[projectId]/command-pack/route.ts`: GET / POST for `command-pack.json`.

---

## 3. UI Pages & Components to Implement

### Project Skill & Configuration Page (P0.1)
* `[NEW] app/projects/[projectId]/skill/page.tsx`: Sidebar integration and layout.
* `[NEW] components/project/ProjectSkillView.tsx`: Interactive editor for Project Skill Markdown, Research Questions, Extraction Schema, and Command Pack. Supports downloading the `.md` and `.json` assets.

### Workspace Context & Selection persistence (P0.3, P0.5, P0.6)
* `[MODIFY] components/analysis/StageTabs.tsx`: Add optional `selectedPaperId` prop and append `?paperId=${selectedPaperId}` to links.
* `[MODIFY] components/analysis/PaperOverviewWorkspaceView.tsx`: Read `paperId` from query search parameters, render a paper-switching dropdown, and show decision screening buttons.
* `[MODIFY] components/analysis/AIAnalysisWorkspaceView.tsx`: Read `paperId` query param and render paper dropdown.
* `[MODIFY] components/review/ReviewWorkspaceView.tsx`: Read `paperId` query param, filter suggestions by paper if specified, and render dropdown.
* `[MODIFY] components/matrix/MatrixWorkspaceView.tsx`: Add filtering/search UI, column mapping based on Project Extraction Schema, selection checkboxes, and export buttons.
* `[MODIFY] components/matrix/ExtractionMatrixTable.tsx`: Add expanded view showing evidence details (quote, locator, confidence, level) and row selection checkboxes.

---

## 4. Import & Validation Updates (P0.2, P0.8)

Update the Antigravity JSON importer to validate payloads against the active project contract:
* `[MODIFY] lib/server/importers/antigravityJsonImporter.ts`:
  * Add validation of projectId, skillVersion, contractVersion, required fields, and field keys.
  * Ensure imported suggestions enter with status `pending-review`.
  * Return validation errors in the import job audit.

---

## 5. Export Logic (P0.7)

Implement client-side export builders for CSV, Markdown, and JSON files:
* `[NEW] lib/client/exportUtils.ts`: Client-side utilities to download text/JSON files.
* `[MODIFY] components/export/ExportWorkspaceView.tsx`: Implement export triggers.
* `[MODIFY] components/matrix/MatrixWorkspaceView.tsx`: Enable selected records download.

---

## 6. Verification & Test Strategy
* Create validation test script `scripts/qa/validate-p0-workflow.ts` that mocks payload scenarios and verifies validation responses (mismatched projectId, missing required fields, version matching).
* Run `npm run typecheck`, `npm run lint`, and `npm run build` to confirm everything is error-free.
