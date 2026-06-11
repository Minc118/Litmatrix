# LitMatrix PRD v0.1

## Product Positioning

LitMatrix is a configurable, evidence-based research workspace for academic literature reviews, survey papers, seminar papers, thesis related work, and systematic literature review (SLR) workflows.

It must support different research topics and must not hardcode domain-specific concepts such as OCPM, OCEL, convergence, divergence, BIM, AI agents, or digital twins.

Domain-specific concepts may only appear in:
* project configuration
* project skill
* extraction schema
* command pack
* demo data

---

## Core Principles

### 1. Topic-agnostic
LitMatrix must work for different research topics. The core system must not be hardcoded for Object-Centric Process Mining.

### 2. Project as Skill
Each Review Project behaves like an independent research skill. A project defines:
* research topic
* research goal
* research questions
* extraction schema
* evidence rules
* review rules
* analysis commands
* writing goal
* output expectations

The Project Skill should be editable and downloadable (`project-skill.md`).

### 3. PDF-first, but not PDF-only
The main input should be academic PDFs, but imported JSON from external tools must also be supported.
Each paper or extraction record should track source availability:
* `pdf-available`
* `external-evidence-only`
* `metadata-only`
* `needs-source-upload`
* `source-unverified`

### 4. Summary-first
After a paper is uploaded or imported, LitMatrix should first show a Paper Overview. Deep extraction should happen only after user confirmation.

### 5. Human-in-the-loop
AI-generated output is never final by default. Suggestions enter with review status:
* `pending-review`
* `accepted`
* `edited`
* `rejected`
* `saved-as-idea`

### 6. Evidence-backed Matrix
Each matrix entry must preserve:
* what the paper explicitly states
* evidence quote or source locator
* AI interpretation or possible writing use
* user-edited or accepted final value
* review status
* confidence
* evidence level
* source availability

### 7. Research Exchange Loop
LitMatrix defines Skill / Contract -> user exports Skill/Contract/Matrix/Selected Records -> external tool analyzes them -> returns structured JSON -> LitMatrix validates -> user reviews -> updates synthesis.

---

## Core Concepts

### Review Project
A project contains project ID, title, topic, research questions, project skill, project contract, extraction schema, command pack, papers, extraction records, synthesis results, and writing outputs.

### Project Skill
A human-readable Markdown instruction file (`project-skill.md`) defining the goals, inclusion criteria, extraction fields, evidence rules, and writing expectations.

### Project Contract
A machine-readable JSON contract (`project-contract.json`) defining IDs, versions, extraction field keys, required vs optional fields, and expected return JSON schema.

### Extraction Schema
Matrix columns must come from the project extraction schema, not arbitrary JSON fields.

### Evidence-backed Extraction Record
Tracks paper ID, field key, label, stated value, evidence quote, source section, page locator, evidence level, AI interpretation, user value, status, and related RQs. Displays `Not specified in the provided text.` if missing.

### Matrix Selection Set
User can select matrix records to run skill-defined analysis commands, export, or support writing.

---

## P0 priorities
* **P0.1 Project Skill and Contract**: Implement config export/visibility.
* **P0.2 Import Contract Validation**: Validate payload against projectId, versions, and schema.
* **P0.3 Paper Overview & Decision Gate**: Displays overview, screening decision, source availability.
* **P0.4 Evidence-backed Extraction Records**: Clear separation of paper-stated, quote, interpreter, user value.
* **P0.5 Paper Workspace Review UI**: Accept, edit, reject, save suggestions.
* **P0.6 Extraction Matrix**: Uses project extraction schema, shows pending/reviewed status, selection.
* **P0.7 Matrix Export and Selection Export**: Exports full matrix and selected records with contract.
* **P0.8 External Result Import**: Import external analysis results as pending-review suggestions.
