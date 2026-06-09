# LitMatrix Architecture

LitMatrix is an AI-assisted systematic literature review (SLR) and survey-paper workspace. It helps researchers move from paper import through overview, AI-assisted analysis, reviewed extraction, synthesis, theme clustering, gap discovery, argument candidates, innovation opportunities, and writing or presentation planning.

This document defines the target architecture. It is a contract for future implementation, not a record of implemented features.

## System Overview

LitMatrix must become a data-driven full-stack application while preserving a Vercel-safe demo mode. The central principle is that all user-facing screens read normalized data from a provider-agnostic Analysis Store through backend API routes.

The frontend never calls secret-based or local external services directly. Providers and importers write normalized outputs into the Analysis Store. The UI renders the same models regardless of whether the data came from mock data, Gemini, Zotero, Antigravity local output, PDF parsing, or manual notes.

## Text System Diagram

```text
User
  |
  v
Frontend UI
  - renders pages and reusable components
  - calls backend API routes only
  - displays demo or stored analysis data
  |
  v
Backend API Routes
  - validates requests
  - enforces auth and security boundaries
  - calls services
  - never exposes secrets to the frontend
  |
  v
Service Layer
  - project, paper, analysis, review, matrix, synthesis, provider, import, export services
  |
  +--------------------+
  |                    |
  v                    v
Analysis Store      Provider / Importer Layer
  - projects          - Gemini provider
  - papers            - Zotero Local API provider
  - overviews         - Zotero Web API provider
  - suggestions       - future PDF parser provider
  - decisions         - Antigravity JSON importer
  - matrix rows       - manual notes importer
  - synthesis         - future NotebookLM notes importer
  - gaps
  - arguments
  - plans
```

## Frontend Layer

The frontend is responsible for rendering the research workspace and calling backend API routes. It must not contain provider-specific credentials, database connection strings, or direct integration logic for Gemini, Zotero, Neon, Antigravity, or any other secret-based service.

Frontend responsibilities:

- Render the existing UI direction unless a later phase explicitly redesigns it.
- Call backend API routes for all project, paper, analysis, review, matrix, synthesis, import, provider status, and export data.
- Display normalized Analysis Store records.
- Support demo mode with mock or seed-backed API responses.
- Represent loading, empty, error, offline, and provider-unconfigured states clearly.
- Keep AI output visibly reviewable until a user confirms or edits it.

Frontend code must never:

- Call Gemini directly.
- Call Zotero Local API directly.
- Call Zotero Web API directly.
- Call Neon or any database directly.
- Call Antigravity directly.
- Read `DATABASE_URL`, `GEMINI_API_KEY`, `ZOTERO_API_KEY`, or similar secrets.
- Put server-only secrets into `NEXT_PUBLIC_`, `VITE_`, or browser-visible variables.
- Depend on provider-specific raw response shapes.

## Backend / API Layer

The backend owns API routes, request validation, service orchestration, provider access, importer validation, database reads and writes, and response normalization. It is the only layer that may read server-only environment variables.

Backend responsibilities:

- Serve read APIs consumed by the frontend.
- Provide later mutation APIs for project creation, paper import, analysis requests, review decisions, matrix edits, imports, and exports.
- Validate all inputs and imported files before writing to the Analysis Store.
- Call providers only from server-side code.
- Normalize provider and importer outputs into the shared data contract.
- Return demo-safe responses when demo mode is enabled or external configuration is absent.
- Hide provider raw responses from frontend components unless explicitly exposed through a safe debug-only contract.

## Database / Analysis Store Layer

The Analysis Store is provider-agnostic. It stores research data and reviewed analysis state without caring whether records came from mock data, Gemini, Antigravity, Zotero, PDF parsing, or manual notes.

The store must support:

- Projects.
- Research questions.
- Keyword groups.
- Papers.
- Paper overviews.
- AI suggestions.
- Review decisions.
- Extraction matrix rows.
- Theme clusters.
- Consensus, conflict, and complementarity items.
- Gap items.
- Argument candidates.
- Innovation opportunities.
- Writing plans.
- Presentation plans.
- Analysis runs.
- Import jobs.

All AI-generated or imported analysis objects include common provenance fields defined in [data-contract.md](./data-contract.md): `analysisSource`, `evidenceLevel`, `status`, `confidence`, timestamps, and IDs.

Only confirmed extraction values should feed final synthesis, final gap maps, final argument candidates, final innovation opportunities, final writing plans, and final presentation plans.

## Provider Layer

Providers actively call external or local services from backend/server-side code. Provider-specific request and response formats must be isolated behind adapters.

Planned providers:

- Gemini provider: runs AI analysis when configured with `GEMINI_API_KEY` and related server-only settings.
- Zotero Local API provider: reads from a local Zotero instance through `http://localhost:23119/api` or configured equivalent.
- Zotero Web API provider: reads Zotero library data through Zotero Web API configuration.
- Future PDF parser provider: extracts metadata, abstracts, or full text from uploaded PDFs.

Provider outputs must be normalized before storage. The frontend reads normalized data only.

## Importer Layer

Importers ingest already generated or user-provided content. They do not actively run third-party analysis services.

Planned importers:

- Antigravity JSON importer.
- Manual notes importer.
- Future NotebookLM notes importer.

Antigravity is treated as a local advanced mode. LitMatrix should import Antigravity local JSON outputs or use a local sync script later. The frontend must never call Antigravity directly.

## Skill / Agent Layer

Agent behavior is governed by:

- [AGENTS.md](../AGENTS.md)
- [skills/litmatrix-slr/SKILL.md](../skills/litmatrix-slr/SKILL.md)
- The architecture and contract documents in `docs/`

Agents must preserve the boundaries between frontend, backend, database, providers, importers, and skills. SLR-specific work must follow academic safety rules, provenance rules, and review-first workflows.

## Deployment Model

The target deployment model is Vercel for the web application and Neon for hosted Postgres. This phase does not create deployments, migrations, or provider connections.

Planned roles:

- Vercel: hosts frontend and backend API routes.
- Neon: stores the Analysis Store database.
- Gemini: optional online AI analysis provider.
- Zotero Local API: optional local metadata import during local development or advanced workflows.
- Zotero Web API: optional cloud metadata import with server-side credentials.
- Antigravity: optional local advanced analysis producer whose JSON outputs are imported into LitMatrix.

## Demo Mode

Demo mode must work without external APIs or a database connection. It should use mock or seed data behind the same backend API contract that production uses.

Demo mode rules:

- `NEXT_PUBLIC_DEMO_MODE=true` may be exposed to the browser because it is not secret.
- Demo APIs return deterministic mock or seed-backed records.
- The UI should still call backend routes, not local provider modules.
- Missing external configuration should not break demo browsing.

## Online Analysis Mode

Online analysis mode uses backend API routes and server-side providers. For example, a user may request a paper overview, the backend calls the Gemini provider, stores normalized suggestions, and returns Analysis Store records to the frontend.

Flow:

```text
Frontend action
  -> backend API route
  -> analysis service
  -> provider adapter
  -> normalized result
  -> Analysis Store write
  -> frontend reads normalized records
```

## Local Advanced Antigravity Mode

Antigravity may produce local analysis output outside LitMatrix. LitMatrix should not call Antigravity from the browser. A later importer or sync script can ingest JSON from `ANTIGRAVITY_OUTPUT_DIR`, validate it, normalize it, and write it into the Analysis Store.

Flow:

```text
Antigravity local output
  -> JSON file or local sync script
  -> backend import route or CLI importer
  -> importer validation
  -> normalized Analysis Store records
  -> frontend reads same UI data models
```

## Security Principles

- Secrets are server-only.
- No real `.env` file should be created by agents.
- `.env.example` may document required variables with empty placeholder values.
- `DATABASE_URL`, API keys, OAuth secrets, and provider tokens must never be exposed to frontend code.
- `NEXT_PUBLIC_` and `VITE_` variables are browser-visible and must contain only non-sensitive values.
- Provider raw responses should be stored only when explicitly needed and should not be returned to normal UI components.
- Imports must be validated before persistence.
- Destructive commands and database destructive operations require explicit user approval and should be avoided.

## Analysis Result Flow

All sources converge into the same Analysis Store:

```text
mock / seed data
Gemini API
Antigravity local JSON
Zotero Local API
Zotero Web API
PDF parser
manual import
  |
  v
normalization + validation
  |
  v
Analysis Store data contract
  |
  v
backend read APIs
  |
  v
frontend UI
```

The UI must never be coupled to a single AI provider. Gemini and Antigravity results must be displayable through the same pages, components, review workflows, and matrix structures.
