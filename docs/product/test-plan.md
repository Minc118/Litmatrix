# LitMatrix Test Plan

This document outlines the testing and validation strategy for the LitMatrix workspace, covering both the P0 foundational features and the full-flow MVP literature review lifecycle.

---

## 1. Automated Validation Tests (Unit & Integration)

We use a backend QA validation script at `scripts/qa/validate-p0-workflow.ts` to test schema validation, payload contract enforcement, version compatibility checking, and external analysis ingestion.

### Test Scenarios Covered
1. **Contract Generation**: Verifies that project contract returns a valid JSON schema representing the project settings.
2. **Project ID Validation**: Validates that import fails when the payload's `projectId` does not match the workspace's `projectId`.
3. **Version Validation**: Validates that a mismatch or warning triggers if `skillVersion` or `contractVersion` is outdated.
4. **Field Keys & Schema Matching**:
   * Rejects/blocks import of records with unknown fields or missing required fields.
   * Gracefully allows missing optional fields, labeling them `Not specified in the provided text.`.
5. **Evidence Level Validation**: Confirms that missing evidence quotes or locator fields demotes suggestions to pending review.
6. **Matrix Export Preserves Evidence**: Verifies that exported matrix JSON includes exact quote, section, and confidence metadata.
7. **External Result Import**: Verifies that external analysis suggestion payloads map to respective DB tables (theme, gap, etc.) upon review acceptance.

---

## 2. End-to-End (E2E) UI Tests

We use Playwright to perform automated E2E browser tests under `tests/e2e/`.

### 2.1 P0 Workspace Test Suite (`tests/e2e/litmatrix-p0.spec.ts`)
1. **Skill & Contract Page**: Verifies page load, tab switching, and download links.
2. **Import Console**: Fills Paste JSON area with a valid OCPM payload, executes schema validation, and checks dry-run entity count previews.
3. **Overview & Screening Page**: Verifies that core Screening Decision Gate buttons (Mark as Core Paper, Skip/Exclude) exist.
4. **Workspace Review UI**: Verifies the paper switching dropdown and batch save controls.
5. **Extraction Matrix**: Verifies detail expansions and checkbox selections on rows.
6. **Export Workspace Page**: Confirms JSON, CSV, and Markdown download configurations.

### 2.2 Full-Flow Lifecycle Test Suite (`tests/e2e/litmatrix-full-flow.spec.ts`)
1. **Dynamic Project Wizard (`/new`)**: Fills out the multi-step project form, specifies dynamic research questions, and adds custom matrix columns (e.g. `Qubit Count`). Creates the project.
2. **Workspace Redirect**: Confirms immediate redirect to `/projects/dynamic-full-flow-project` and sidebar navigation setup.
3. **Dynamic Skills Loading**: Navigates to the project skill page, confirming the dynamically generated markdown and custom questions/columns are listed.
4. **PDF Upload**: Selects a mock PDF, uploads it, and confirms it is listed in the inbox with a metadata-only label and text-extraction disclaimer.
5. **Zotero RDF Upload**: Ingests Zotero RDF XML, validates catalog item parsing, and checks for success banners.
6. **Screening Gate**: Selects a screening decision in the Paper Inbox dropdown, navigates to the Paper Overview, and verifies decision gate controls are present.
7. **Schema-Driven Empty State**: Verifies the Extraction Matrix displays a clean empty state displaying user-defined custom columns (e.g., `Qubit Count`) from the contract.
8. **Export Page**: Loads the Export tab successfully.

---

## 3. How to Run Tests

### Prerequisites
Install Playwright browser binaries (Chromium) first:
```bash
npx playwright install chromium
```

### Verification Commands

Execute the full validation pipeline before staging:

```bash
# 1. Check TypeScript compilation
npm run typecheck

# 2. Check code style and linting
npm run lint

# 3. Build the application for production
npm run build

# 4. Run Playwright E2E tests
npx playwright test
```
