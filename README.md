# LitMatrix

LitMatrix is an AI-assisted systematic literature review and survey-paper workspace. It is intended to help researchers move from paper import and paper overview through AI-assisted analysis, suggestion review, extraction matrices, multi-paper synthesis, theme clustering, research gap discovery, argument candidates, innovation opportunities, writing plans, and presentation plans.

## Architecture Status

This repository currently contains architecture and agent guidance for the planned full-stack application. Feature implementation, real API connections, database migrations, and deployments are intentionally out of scope for the current phase.

See:

- `docs/architecture.md`
- `docs/frontend-architecture.md`
- `docs/backend-architecture.md`
- `docs/data-contract.md`
- `docs/api-contract.md`
- `docs/provider-importer-contract.md`
- `skills/litmatrix-slr/SKILL.md`

## Modes

Demo mode should allow the UI to show mock or seed data without external services. The frontend should still read data through backend API routes so demo and production share the same contracts.

Online analysis mode is planned to use backend API routes and server-side providers. The frontend must not call Gemini, Zotero, Neon, Antigravity, or other secret-based services directly.

Local Antigravity mode is planned as an importer workflow. Antigravity can produce local JSON output, and a later backend importer or local sync script can validate and normalize that output into the Analysis Store.

## Planned Integrations

LitMatrix is planned for Vercel deployment with a Neon-backed Analysis Store. Gemini is planned as an optional server-side AI provider. Zotero Local API and Zotero Web API are planned as optional metadata import providers. Antigravity JSON import is planned for local advanced analysis output.

No real provider connections, database migrations, or deployment commands are included in this architecture phase.

## Implementation Skeleton

The repository now uses a manual Next.js App Router, TypeScript, and Tailwind CSS scaffold. Current routes are demo-backed placeholders that read normalized OCPM data through backend API routes.

The skeleton keeps these boundaries:

- Frontend pages and components fetch `/api/*` routes only.
- Backend API routes call server services.
- Server services call repositories, providers, importers, validators, and config modules.
- Demo data lives in `lib/demo/ocpm-demo-data.ts`.
- Provider and importer modules are placeholders and do not call external services.
