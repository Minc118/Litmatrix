# LitMatrix Full-Flow Product Requirements Document (PRD)

## 1. Executive Summary & Vision
LitMatrix is an evidence-backed, schema-driven workspace designed to support systematic literature reviews (SLRs) and rapid evidence synthesis. Moving beyond static prototypes, this PRD specifies the end-to-end full product flow that takes a user from project creation to paper screening, metadata-only PDF/Zotero ingestion, human-in-the-loop review, and schema-driven extraction matrix export.

All AI-suggested extractions must remain honest, verifiable, and free of fabrication. If a feature or extractor is not fully implemented, it must be clearly labeled to avoid misleading the researcher.

---

## 2. User Journey & Core Features

### 2.1 Dynamic Project Creation (`/new`)
* **Entry Point**: A step-by-step wizard located at `/new`.
* **Flow**:
  1. **Project Details**: Set Title, Topic, and Writing Goal (e.g.Survey, Thesis, Seminar).
  2. **Research Questions**: Let users add custom research questions (dynamically mapped as `rq-1`, `rq-2`, etc.).
  3. **Extraction Schema**: Allow users to customize columns for the extraction matrix by adding labels, keys, and descriptions.
* **Output Artifacts**: Creating a project generates a unique Project ID and establishes:
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

### 2.3 PDF Upload & Metadata Ingestion
* **UI Location**: `/projects/[projectId]/papers`.
* **Interaction**: drag-and-drop or select PDF.
* **Backend Processing**:
  * Simulates/attempts parsing of PDF metadata (Title, Creator, Year).
  * Saves reference details in local memory.
  * If full text extraction is not configured, labels the evidence status as `PDF uploaded, text extraction not yet available (metadata-only overview)`.
  * **Strict Safety**: No external AI calls; no fabricated method summaries or findings.

### 2.4 Zotero RDF Catalog Import
* **UI Location**: `/projects/[projectId]/tools/import`.
* **Support**: Parse Zotero RDF XML files directly in-browser/backend.
* **Behavior**:
  * Extracts metadata (`dc:title`, `dc:creator`, `dc:date`, `bib:Article`) from upload.
  * Imports catalog items directly into the project's Paper Inbox.
  * Clearly labels local API integrations as planned/unavailable if not configured.

### 2.5 Paper Inbox & screening Gate
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
  * Mark as Core Paper.
  * Skip / Exclude.
  * Demarcate evidence level clearly to avoid fabrication.

### 2.7 Schema-Driven Extraction Matrix
* **UI Location**: `/projects/[projectId]/matrix`.
* **Empty State**: Displays when no papers have extraction records. Lists active schema columns from the contract and provides a clear guide on next steps (Ingest literature, Deep extraction, Import JSON).
* **Populated State**: Displays fields matching the dynamic contract columns (e.g. customized fields like `Qubit Count`).

---

## 3. Security & Safety Boundaries
* **Secrets**: No hardcoded API keys, database URLs, or secret files.
* **AI Ethics**: No external AI calls to Gemini or other LLMs without explicit configuration. Fabricated evidence or summaries are strictly forbidden.
* **Local Fallback**: Explicit warning cards visible in the UI when the application is running in local/demo mode.
