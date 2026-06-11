# LitMatrix Current-State Audit & Gap Analysis

This document audits the current LitMatrix codebase, compares it to the PRD v0.1 targets, identifies missing P0 work, highlights risky assumptions, and checks for OCPM-specific hardcoding.

---

## 1. Comparative Audit

| PRD Concept / Priority | Current Implementation Status | Missing P0 Work / Gaps |
| :--- | :--- | :--- |
| **Topic-Agnostic Core** | Partial. UI is parameterized by `[projectId]`, but the OCPM demo project is heavily featured as the only data source. | Make sure non-demo projects can load default skill, contract, schema, and command packs without OCPM concepts. |
| **Project as Skill & Contract** | Missing. There is no concept of editable project skill Markdown or project contract JSON in the DB or UI. | Implement the Project Skill page, export actions for `project-skill.md`, `project-contract.json`, etc., and define backend configurations. |
| **PDF-First & Source Tracking** | Partial. PDF viewer shell exists but is mock-only. Source availability tracking enum exists in DB but is not tracked or displayed on suggestions/matrix. | Update frontend to display source availability status (`pdf-available`, `external-evidence-only`, etc.) and ensure it is tracked on papers. |
| **Summary-First & Decision Gate** | Partial. Overview panel displays static overview records, but there is no decision gate UI (continue to deep extraction, mark as core, etc.) or paper-switching dropdown. | 1. Implement search-param based `paperId` context in Overview/Analysis/Review views to resolve the paper hardcoding bug.<br>2. Add a paper selection/switching dropdown.<br>3. Implement the screening decision gate actions on the Overview page. |
| **Evidence-backed Matrix** | Partial. Displays confirmed vs suggested value. | 1. Cells do not support expanded evidence view (quote, page locator, confidence, level).<br>2. Row selection is missing.<br>3. Matrix column generation must strictly align with the project extraction schema. |
| **Matrix & Selection Export** | Missing. Export button card exists but download buttons are disabled placeholder cards. | Implement client-side or backend export for CSV, Markdown, and JSON formats for both the full matrix and selected records. |
| **Import validation against Contract** | Partial. Antigravity importer validates structural schema, but does not validate against project contract details (versions, RQs, required fields). | Implement validation check on projectId, skillVersion, schemaVersion, field keys, required fields, and evidence availability. |
| **External Result Import** | Partial. Importer exists but does not validate against project contract or map results to pending-review items. | Update importer to validate against contract and create imports as suggestions with `pending-review` status. |

---

## 2. OCPM-Specific Hardcoding Audit
* **Database & Code**: The core repositories, API routes, and database tables are generic and parameter-agnostic. OCPM-specific terms are only in the mock data seeding script (`scripts/seed-demo-data/seed.ts` and `lib/demo/ocpm-demo-data.ts`).
* **UI Pages**: The Project Dashboard uses `projectId === "ocpm-demo" ? "OCPM Survey" : projectId` as a display label. This is acceptable for demo purposes but can be refined.

---

## 3. Risky Assumptions
* **Database Availability**: The application assumes that write operations (mutations) require a live database. In demo mode, since mutations fail with `DEMO_MODE_READ_ONLY`, we must ensure that review actions and configurations degrade gracefully (e.g. by using local storage or simulating state changes in the browser) or explain limitations clearly.
* **Schema Migration**: Prohibition of running database migrations on production databases means we should implement schema metadata dynamically or through code configs, avoiding DB migrations unless local migrations are generated.
