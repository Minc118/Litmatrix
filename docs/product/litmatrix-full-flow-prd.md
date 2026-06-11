# LitMatrix Full-Flow Product Requirements Document (PRD)

## 1. Executive Summary & Vision
LitMatrix is an evidence-backed, schema-driven workspace designed to support systematic literature reviews (SLRs) and rapid evidence synthesis. LitMatrix has moved from a prototype into a functional full-flow MVP that supports the complete literature review lifecycle from dynamic project creation to PDF/Zotero ingestion, inbox screening, human-in-the-loop review, and schema-driven extraction matrix export.

All AI-suggested extractions remain honest, verifiable, and free of fabrication. If a feature or extractor is not fully implemented, it is clearly labeled in the UI to prevent misleading the researcher.

---

## 2. Full-Flow MVP Features

### 2.1 Dynamic Project Creation (`/new`)
* **Entry Point**: A step-by-step wizard located at `/new`.
* **Flow**:
  1. **Project Details**: Set Title, Topic, and Writing Goal (e.g., Survey, Thesis, Seminar).
  2. **Research Questions**: Let users add custom research questions (dynamically mapped as `rq-1`, `rq-2`, etc.).
  3. **Extraction Schema**: Allow users to customize columns for the extraction matrix by adding labels, keys, and descriptions.
* **Output Artifacts**: Automatically registers the project ID and generates:
  * A Project Skill Markdown file (system prompts/rules).
  * A Project Contract JSON file (research questions, schema fields, command packs).
* **State Persistence**: Memory/Session-based local persistence with explicit warning banners stating that state resets upon server restart.

### 2.2 Project Dashboard & Workspace Sidebar
* After creation, the user is redirected to `/projects/[projectId]`.
* Sidebar dynamic links load correctly according to the project's contract:
  * Dashboard (`/projects/[projectId]`)
  * Project Skill (`/projects/[projectId]/skill`)
  * Papers Inbox (`/projects/[projectId]/papers`)
  * Paper Overview (`/projects/[projectId]/overview`)
  * Extraction Matrix (`/projects/[projectId]/matrix`)
  * Import/Export Tools (`/projects/[projectId]/tools/import`)

### 2.3 PDF Upload & Ingestion
* **UI Location**: `/projects/[projectId]/papers`.
* **Interaction**: drag-and-drop or select PDF.
* **Behavior**: Parses metadata dynamically and loads reference. Files are marked clearly as `PDF uploaded, text extraction not yet available (metadata-only overview)`. No external AI keys or LLMs are used.

### 2.4 Zotero RDF XML Ingestion
* **UI Location**: `/projects/[projectId]/tools/import`.
* **Support**: Parse Zotero RDF XML files directly on upload. Extracts metadata (`dc:title`, `dc:creator`, `dc:date`, `bib:Article`) and imports catalog items directly into the project's Paper Inbox.

### 2.5 Paper Inbox & Screening Gate
* **UI Location**: `/projects/[projectId]/papers`.
* **Dashboard Elements**:
  * **Source Availability**: Identifies if source was PDF Upload, Zotero RDF, or JSON Import.
  * **Evidence Level / Overview Status**: Badged as `Metadata-only`, `External-evidence`, or `Full-text`.
  * **Screening Decision**: Dropdown for `Unscreened`, `Continue to Deep Extraction`, or `Skip / Exclude`.
  * **Next Action**: Dynamic button/label guiding the user to the next logical step.

### 2.6 Decision Gate & Paper Overview
* **UI Location**: `/projects/[projectId]/overview`.
* **Purpose**: Inspect the overview details of papers and route them.
* **Controls**:
  * Continue to Deep Extraction.
  * Mark as Core Paper.
  * Skip / Exclude.

### 2.7 Schema-Driven Extraction Matrix
* **UI Location**: `/projects/[projectId]/matrix`.
* **Empty State**: Displays when no papers have extraction records. Lists active schema columns from the contract and provides a clear guide on next steps (Ingest literature, Deep extraction, Import JSON).
* **Populated State**: Displays fields matching the dynamic contract columns (e.g. customized fields like `Qubit Count`).

### 2.8 Matrix Export
* Supports exporting full or selected records to CSV, Markdown, or JSON bundle formats, preserving all evidence quotes and locator metadata.

### 2.9 Import Console
* Validate and dry-run JSON analysis results against the project contract before ingestion.

### 2.10 Automated Full-Flow E2E Tests
* Playwright suite verifies the entire lifecycle: `/new` project setup, skill page rendering, PDF upload, Zotero RDF parsing, inbox screening select, overview gate inspection, empty matrix column displays, and export page checks.

---

## 3. Current Limitations

* **PDF full-text extraction** is not implemented yet. Uploaded papers are ingested as `Metadata-only` states.
* **Deep Extraction** is not automatically performed (it does not invoke any server-side extractor or mock generator to prevent data fabrication).
* **Zotero Local API** is a planned/unavailable integration, clearly badged as such in the UI.
* **In-Memory Fallback**: Dynamic projects, skills, and contracts use process-level in-memory storage when no postgres `DATABASE_URL` is configured, which resets upon server restart.
* **Local Storage Screening**: Screening decisions persist in the browser's `localStorage` (per project ID) to provide a persistent local demo experience.
* **AI Provider Connection**: No external AI provider (such as Gemini or other secret-based services) is actively called.

---

## 4. How to Run Locally

```bash
npm install
npm run dev
```

---

## 5. How to Test

Ensure that the application is valid and passes all checks:

```bash
npm run typecheck
npm run lint
npm run build
npx playwright test
```
