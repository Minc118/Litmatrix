# Provider and Importer Contract

LitMatrix separates providers from importers so the UI and Analysis Store remain provider-agnostic.

## Providers

Providers actively call external or local services from backend/server-side code.

Planned providers:

- Gemini provider.
- Zotero Local API provider.
- Zotero Web API provider.
- Future PDF parser provider.

Provider responsibilities:

- Read server-only configuration.
- Call the external or local service.
- Convert raw provider responses into normalized intermediate records.
- Return normalized results to services for validation and persistence.
- Report safe provider status through backend APIs.

Providers must not:

- Be imported into frontend components.
- Expose API keys, database URLs, or tokens.
- Return raw provider payloads to normal UI components.
- Store provider-specific shapes as the only source of truth.

## Importers

Importers ingest already generated outputs or user-provided notes. They do not actively run third-party analysis services.

Planned importers:

- Antigravity JSON importer.
- Manual notes importer.
- Future NotebookLM notes importer.

Importer responsibilities:

- Validate input schema and size.
- Normalize input into Analysis Store data models.
- Create `ImportJob` records.
- Mark records with the correct `analysisSource`, `evidenceLevel`, `status`, and `confidence`.
- Preserve evidence references where available.

## Antigravity Boundary

Antigravity is not called directly by the frontend.

Supported future integration shape:

```text
Antigravity local analysis
  -> writes local JSON output
  -> LitMatrix backend importer or local sync script reads JSON
  -> importer validates schema
  -> importer normalizes to Analysis Store records
  -> frontend reads normalized data through backend APIs
```

The frontend must not:

- Launch Antigravity.
- Read Antigravity output directories.
- Parse Antigravity JSON directly.
- Depend on Antigravity-specific response fields.

## Gemini and Antigravity Compatibility

Gemini output and Antigravity output must be displayable in the same UI. They converge through the shared data contract:

- Gemini-created suggestions use `analysisSource: "gemini-api"`.
- Antigravity-imported suggestions use `analysisSource: "antigravity-local"`.
- Manual notes use `analysisSource: "manual"`.
- Zotero imports use `analysisSource: "zotero-local"` or `"zotero-web"`.
- PDF parser records use `analysisSource: "pdf-parser"`.

The UI should render these as source labels and provenance metadata, not as separate provider-specific screens.

## Raw Response Handling

Provider-specific raw responses should not leak into frontend components. If raw responses are ever stored for debugging or audit purposes, they should:

- Be server-only.
- Be excluded from normal API responses.
- Be redacted where needed.
- Be optional and not required for UI rendering.

## Normalization Requirements

Every normalized AI-generated or imported analysis object must include:

- `id`
- `projectId`
- `paperId` where applicable
- `analysisSource`
- `evidenceLevel`
- `status`
- `confidence`
- `createdAt`
- `updatedAt`

Every gap, argument, innovation opportunity, writing plan section, and presentation plan slide must link back to supporting paper IDs. If evidence is insufficient, mark confidence as `low` or `tentative`.
