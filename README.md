# LitMatrix

LitMatrix is an AI-assisted systematic literature review and survey-paper workspace. It helps researchers move from project creation and paper import through screening, human-in-the-loop review, schema-driven extraction matrices, and evidence synthesis exports.

---

## 1. Project Status: Full-Flow MVP

LitMatrix now contains a working end-to-end MVP implementation covering the following lifecycle states:

1. **New Analysis Wizard (`/new`)**: Topic-agnostic wizard to register details, custom research questions, and custom extraction schema columns.
2. **Project Skill & Contract**: Dynamically generated skill markdown and JSON contracts served on `/projects/[projectId]/skill`.
3. **PDF Ingestion**: Drag-and-drop or select PDF paper files to ingest basic metadata.
4. **Zotero RDF Import**: Ingests Zotero RDF XML catalog exports directly into the project library.
5. **Paper Inbox & Screening**: Redesigned screening dashboard to track source type, overview status, and register screening decisions.
6. **Paper Overview**: Decision Gate interface to route papers (Core, Background, Skip/Exclude).
7. **Extraction Matrix**: Dynamic schema-driven grid with detailed cell expansion showing exact evidence quotes and locators.
8. **Matrix Export**: Export full or selected matrix records into CSV, Markdown, or JSON bundles.
9. **Import Console**: Pasteurization interface validating external analysis JSON bundles against the project contract.

---

## 2. Technical Stack
* **Framework**: Next.js (App Router, React 19)
* **Styling**: Vanilla CSS (Tailwind CSS skeleton utility compatibility)
* **Database Client**: Drizzle ORM / Neon Serverless (postgres)
* **E2E Testing**: Playwright

---

## 3. How to Run Locally

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Local Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 4. How to Test and Validate

Validate that the application is fully type-safe, lint-compliant, builds cleanly, and passes all E2E browser tests:

```bash
# 1. Typecheck
npm run typecheck

# 2. Lint
npm run lint

# 3. Production Build
npm run build

# 4. Playwright E2E Tests
npx playwright test
```

---

## 5. Authentication & Access Control

LitMatrix uses **Neon Auth** for user session management:
* **Public Registration & Login (Default)**: Enabled by default. Any user can sign up, sign in, and create their own projects.
* **Project Privacy**: Projects are private by default. Each authenticated user can only access their own projects, while the `ocpm-demo` workspace remains publicly accessible as a demo.
* **Optional Allowlist Gate**: For private testing or internal beta runs, you can restrict access by setting `AUTH_ALLOWLIST_ENABLED=true` and configuring allowed user email addresses in `AUTH_ALLOWED_EMAILS` (application-level user emails, not Neon administrative logins).

---

## 6. Current Implementation Limitations
* **PDF full-text extraction** is not implemented yet. Ingested papers are marked as `Metadata-only` with text-extraction disclaimers.
* **Deep Extraction** is not automatically performed (it does not invoke any server-side extractor or mock generator to prevent data fabrication).
* **Zotero Local API** is a planned/unavailable integration, clearly badged as such in the UI.
* **In-Memory Fallback**: Dynamic projects, skills, and contracts use process-level in-memory storage when no postgres `DATABASE_URL` is configured, which resets upon server restart.
* **Local Storage Screening**: Screening decisions persist in the browser's `localStorage` (per project ID) to provide a persistent local demo experience.
* **AI Provider Connection**: No external AI provider (such as Gemini or other secret-based services) is actively called.
