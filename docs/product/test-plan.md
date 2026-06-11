# LitMatrix P0 Test Plan

This document outlines the testing and validation strategy for the LitMatrix P0 implementation.

---

## 1. Automated Validation Tests

We will create a QA script under `scripts/qa/validate-p0-workflow.ts` to test backend behaviors and import validation.

### Test Scenarios Covered
1. **Contract Generation**: Verify that project contract returns a valid JSON schema representing the project settings.
2. **Project ID Validation**: Import fails when the payload's `projectId` does not match the workspace's `projectId`.
3. **Version Validation**: Warning or mismatch triggers if `skillVersion` or `contractVersion` are outdated.
4. **Field Keys & Schema Matching**:
   * Rejects/blocks import of records with unknown fields or missing required fields.
   * Gracefully allows missing optional fields, labeling them `Not specified in the provided text.`.
5. **Evidence Level Validation**: Check that suggestions demote confidence or evidence levels if evidence quotes or locator fields are missing.
6. **Matrix Export Preserves Evidence**: Exported matrix JSON includes exact quote, section, and confidence metadata.
7. **External Result Import**: Verifies that importing external analysis payloads enters suggestions with `pending-review` status and maps themes/gaps to their respective db tables upon acceptance.

---

## 2. Manual UI Walkthrough Verification

Once implemented, we will verify the following flows in the local browser:
* **Workspace Context**: Selecting different papers updates overview panel, analysis panel, and PDF viewer shell instantly. Changing views preserves `paperId` context.
* **Project Skill Page**:
  * Navigate to the Project Skill page.
  * Edit the markdown and schemas.
  * Download the config bundle (`project-skill.md`, `project-contract.json`).
* **Extraction Matrix**:
  * Verify matrix columns match the schema.
  * Expand cell detail to check quote, confidence, and status.
  * Check/uncheck row selection checkboxes.
  * Export selected records or full matrix.
* **Import Console**:
  * Paste an invalid payload and check validation error listing.
  * Dry-run/import a valid payload and verify records enter as `pending-review`.
