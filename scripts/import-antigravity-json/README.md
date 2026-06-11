# Antigravity JSON Importer

The Antigravity JSON Importer allows ingestion of local-analysis outputs directly into the Neon-backed Analysis Store database.

## Expected JSON Shape

The importer validates the incoming payload strictly using a Zod schema. A payload must target a specific `projectId` and can contain arrays of papers, overviews, suggestions, extraction matrix fields, and synthesis outputs.

A complete structure looks like this (see [examples/antigravity/ocpm-demo-analysis-sample.json](../../examples/antigravity/ocpm-demo-analysis-sample.json) for a full example):

```json
{
  "projectId": "project-uuid-or-slug",
  "papers": [
    {
      "id": "paper-1",
      "projectId": "project-uuid-or-slug",
      "title": "...",
      "authors": ["Author A"],
      "year": 2024
    }
  ],
  "paperOverviews": [
    {
      "id": "overview-1",
      "projectId": "project-uuid-or-slug",
      "paperId": "paper-1",
      "problem": "...",
      "evidence": [
        {
          "paperId": "paper-1",
          "sourceField": "abstract",
          "note": "..."
        }
      ]
    }
  ],
  "aiSuggestions": [],
  "extractionMatrixRows": [],
  "themeClusters": [],
  "consensusConflictItems": [],
  "gapItems": [],
  "argumentCandidates": [],
  "innovationOpportunities": [],
  "writingPlans": [],
  "presentationPlans": []
}
```

## Safety and Preservation Rules

1. **Reviewer Override Protection**: If any analysis record (overview, suggestion, row, etc.) already exists in the database with `status` set to `"accepted"` or `"edited"`, the importer **skips it** and reports it under `recordsSkipped`. It never overwrites user-curated data.
2. **Reviewable Default**: Imported suggestions default to `status: "pending-review"` and `analysisSource: "antigravity-local"` so users must confirm them in the UI.
3. **No Fabrication**: Quotes, page numbers, and DOIs are not fabricated if missing in the import payload.
4. **Conservative Evidence Levels**: `evidenceLevel` is strictly validated. A record cannot claim `"full-text"` unless evidence references explicitly contain quote/page verification in full text. It defaults to `"metadata-only"` if abstract and full-text fields are absent.

## Usage and Prerequisites

### 1. Database Migration (Prerequisite)

Before running a real import, you must ensure the database tables are migrated on your active Neon instance.
```bash
npm run db:migrate
```
*Note: If the migration has not been applied, imports will fail with database relation errors.*

### 2. Demo Seed (Optional)

To seed mock project workspace structures for testing:
```bash
npm run db:seed:demo
```

### 3. Triggering Imports via API

Send a `POST` request with the JSON payload to the `/api/import/antigravity-json` endpoint:

**Headers**:
`Content-Type: application/json`

**Response Example (Success)**:
```json
{
  "data": {
    "recordsCreated": 4,
    "recordsUpdated": 0,
    "recordsSkipped": 0,
    "recordsRejected": 0,
    "validationErrors": [],
    "importJobId": "job-1700000000000"
  }
}
```
