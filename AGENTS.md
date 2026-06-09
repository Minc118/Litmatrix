# LitMatrix Agent Instructions

Follow these instructions for all future work in this repository.

## Architecture Contracts

Before implementing features, read and follow:

- `docs/architecture.md`
- `docs/frontend-architecture.md`
- `docs/backend-architecture.md`
- `docs/data-contract.md`
- `docs/api-contract.md`
- `docs/provider-importer-contract.md`
- `skills/litmatrix-slr/SKILL.md` for SLR-related tasks

## Boundaries

- Preserve the existing UI direction unless explicitly told otherwise.
- Keep frontend, backend, database, provider, importer, and skill boundaries clean.
- Frontend code must call backend API routes and must not call Gemini, Zotero, Neon, Antigravity, PDF parsers, or other secret-based services directly.
- Backend code owns API routes, validation, provider calls, importer processing, and database access.
- Providers actively call services.
- Importers ingest already generated or user-provided outputs.
- The Analysis Store must remain provider-agnostic.

## Security Rules

- Do not print secrets.
- Do not create a real `.env` file.
- Do not hardcode API keys.
- Do not hardcode `DATABASE_URL`.
- Do not expose `DATABASE_URL` or API keys to frontend code.
- Do not put secrets into `NEXT_PUBLIC_` or `VITE_` variables.
- Do not push to remote repositories unless explicitly approved.

## Prohibited Destructive Actions

Do not run destructive commands unless the user explicitly approves the exact action:

- `rm -rf`
- `git reset --hard`
- `git clean`
- SQL `DROP`
- SQL `TRUNCATE`

## Implementation Rules

- Do not remove existing UI files unless explicitly requested.
- Do not redesign the UI unless explicitly requested.
- Do not create database migrations during architecture-only phases.
- Do not connect real APIs during architecture-only phases.
- Do not run deployment commands unless explicitly approved.
- Run relevant tests after implementation phases.
- Keep demo mode working without external API configuration.

## SLR Safety

For literature review work:

- Do not fabricate citations, page numbers, quotes, methods, datasets, evaluation results, or findings.
- Use `Not specified in the provided text.` when information is missing.
- Treat AI output as suggestions until user confirmation.
- Use only confirmed extraction values for final synthesis.
- Link every gap, argument, and innovation opportunity to supporting paper IDs.
