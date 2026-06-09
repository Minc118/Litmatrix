# Backend Architecture

This document defines the target backend architecture for LitMatrix. It documents planned modules and route contracts only. It does not implement routes, migrations, providers, importers, or deployments.

## Responsibilities

The backend is the only layer that may access server-only secrets, database connections, external AI providers, Zotero APIs, local import paths, or PDF parsing tools.

Backend responsibilities:

- Serve API routes consumed by the frontend.
- Validate request bodies, route params, query params, and imported files.
- Read and write normalized Analysis Store records.
- Call provider adapters from server-side code only.
- Run importer validation and normalization.
- Enforce demo fallback behavior.
- Produce safe, normalized responses for the UI.
- Keep raw provider responses out of frontend-facing components.

## API Route Structure

Target route groups:

```text
/api/projects
/api/projects/:projectId
/api/projects/:projectId/papers
/api/projects/:projectId/overviews
/api/projects/:projectId/suggestions
/api/projects/:projectId/review-decisions
/api/projects/:projectId/extraction-matrix
/api/projects/:projectId/theme-clusters
/api/projects/:projectId/consensus-conflict
/api/projects/:projectId/gaps
/api/projects/:projectId/arguments
/api/projects/:projectId/innovation-opportunities
/api/projects/:projectId/writing-plan
/api/projects/:projectId/presentation-plan
/api/providers/status
/api/analysis/overview
/api/analysis/extraction
/api/analysis/synthesis
/api/review-decisions
/api/ai-suggestions/:suggestionId
/api/extraction-matrix/:rowId
/api/import/antigravity-json
/api/import/manual-notes
/api/import/zotero-local
/api/import/zotero-web
/api/export/markdown
/api/export/csv
/api/export/json
```

The full route contract is defined in [api-contract.md](./api-contract.md).

## Suggested Module Structure

```text
src/server/
  api/
    routes/
  services/
    projectService
    paperService
    analysisService
    reviewService
    matrixService
    synthesisService
    providerService
    zoteroService
    importService
    exportService
  repositories/
    projectRepository
    paperRepository
    analysisRepository
    reviewRepository
    matrixRepository
    synthesisRepository
    importJobRepository
  providers/
    geminiProvider
    zoteroLocalProvider
    zoteroWebProvider
    pdfParserProvider
  importers/
    antigravityJsonImporter
    manualNotesImporter
    notebookLmNotesImporter
  validators/
    projectValidators
    paperValidators
    analysisValidators
    importValidators
    reviewValidators
  config/
    env
    demoMode
```

This is a target structure, not a required immediate file layout.

## Service Layer

Services orchestrate business workflows and isolate the frontend from implementation details.

Required service responsibilities:

- `projectService`: project list, detail, creation, research question and keyword group coordination.
- `paperService`: paper metadata, paper creation/import coordination, paper overview reads.
- `analysisService`: overview, extraction, and synthesis analysis workflows.
- `reviewService`: AI suggestion review decisions and status transitions.
- `matrixService`: confirmed extraction matrix rows and matrix edits.
- `synthesisService`: theme clusters, consensus/conflict, gaps, arguments, opportunities, plans.
- `providerService`: provider status checks and provider capability reporting.
- `zoteroService`: server-side Zotero Local and Web provider orchestration.
- `importService`: Antigravity JSON, manual notes, Zotero imports, future NotebookLM imports.
- `exportService`: markdown, CSV, and JSON export preparation.

## Repository Layer

Repositories encapsulate Analysis Store persistence. They should not call providers or importers.

Repository responsibilities:

- Read and write normalized data contract objects.
- Hide database-specific details from services.
- Support demo/seed repositories where demo mode is active.
- Keep raw SQL or ORM code out of route handlers and UI components.

## Provider Adapters

Provider adapters actively call external or local services and return normalized intermediate results to services.

Placeholders:

- `geminiProvider`: calls Gemini API when `GEMINI_API_KEY` and model config are present.
- `zoteroLocalProvider`: calls Zotero Local API from server-side local development contexts.
- `zoteroWebProvider`: calls Zotero Web API with server-side API key and library configuration.
- `pdfParserProvider`: future parser for metadata, abstracts, and full text.

Provider adapters must never be imported into frontend components.

## Importers

Importers ingest already generated or user-provided data and normalize it.

Placeholders:

- `antigravityJsonImporter`: validates Antigravity local JSON output and maps it to Analysis Store models.
- `manualNotesImporter`: maps user notes to paper notes, suggestions, or extraction candidates.
- `notebookLmNotesImporter`: future importer for NotebookLM-style notes.

Importers should produce `ImportJob` records and normalized analysis objects with source and evidence metadata.

## Validators

Validators should enforce:

- Required IDs and project ownership.
- Allowed enum values from the data contract.
- Safe string lengths and file sizes.
- Supported import schema versions.
- Required evidence links for gap, argument, innovation, and synthesis records.
- Review status transitions.

Invalid imported records should be rejected or quarantined with a clear `ImportJob` error summary.

## Error Handling

Backend errors should be normalized into safe responses:

```json
{
  "error": {
    "code": "PROVIDER_UNCONFIGURED",
    "message": "Gemini provider is not configured.",
    "details": {}
  }
}
```

Error responses must not include:

- API keys.
- Database URLs.
- Full stack traces in production.
- Raw provider payloads.
- Sensitive local file paths beyond safe import job summaries.

Suggested error codes:

- `BAD_REQUEST`
- `NOT_FOUND`
- `VALIDATION_FAILED`
- `DEMO_MODE_READ_ONLY`
- `PROVIDER_UNCONFIGURED`
- `PROVIDER_FAILED`
- `IMPORT_VALIDATION_FAILED`
- `DATABASE_UNAVAILABLE`
- `UNAUTHORIZED`
- `FORBIDDEN`
- `INTERNAL_ERROR`

## Environment Variable Handling

Server-only:

- `DATABASE_URL`
- `GEMINI_API_KEY`
- `GEMINI_MODEL`
- `ZOTERO_API_KEY`
- `ZOTERO_USER_ID`
- `ZOTERO_LIBRARY_TYPE`
- `ANTIGRAVITY_OUTPUT_DIR`
- `ANTIGRAVITY_IMPORT_ENABLED`

Browser-visible and non-sensitive:

- `NEXT_PUBLIC_DEMO_MODE`
- `NEXT_PUBLIC_APP_NAME`

Rules:

- Do not create a real `.env` file.
- Keep `.env.example` placeholder-only.
- Do not expose server-only variables through client bundles.
- Do not use `NEXT_PUBLIC_` or `VITE_` for secrets.

## Demo Fallback Behavior

Demo mode should support read-only exploration with seed/mock data when no external configuration is present.

Suggested behavior:

- Read routes return deterministic demo records.
- Mutation routes return safe demo responses or `DEMO_MODE_READ_ONLY`, depending on product choice.
- Provider status route reports providers as unconfigured or demo-disabled.
- Demo data should still follow the full data contract.

## Seed Data Behavior

Seed data should be clearly marked with `analysisSource: "mock"` and suitable evidence levels. Seed records should not imply full-text analysis unless the seed explicitly includes full-text-derived evidence.

Seed data can be used for:

- Demo project browsing.
- UI development.
- API contract testing.
- Empty state avoidance during early implementation.

## Provider Status Checks

`providerService` should report capabilities without exposing secrets:

- Gemini configured: true or false.
- Zotero Local API reachable: true or false, checked server-side only.
- Zotero Web configured: true or false.
- Antigravity import enabled: true or false.
- PDF parser available: true or false.

Status checks must not return API keys, database URLs, token fragments, or local secret paths.

## Isolation From UI Code

Gemini, Zotero, Antigravity JSON import, PDF parsing, and manual import logic must be isolated from UI code:

- UI calls `/api/*`.
- Routes call services.
- Services call repositories, providers, or importers.
- Providers/importers normalize results.
- Repositories persist normalized records.
- UI reads normalized records back through read routes.
