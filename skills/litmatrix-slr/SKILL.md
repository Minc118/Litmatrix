# LitMatrix SLR Workflow Skill

## Purpose

Use this skill to guide LitMatrix systematic literature review and survey-paper workflows. It defines how agents should review candidate papers, create paper overviews, generate analysis suggestions, support extraction matrices, synthesize multiple papers, identify gaps, propose arguments, identify innovation opportunities, and draft writing or presentation plans.

## When To Use

Use this skill when working on LitMatrix SLR-related tasks, including:

- Candidate paper review.
- Paper overview generation.
- AI-assisted analysis.
- AI suggestion review.
- Deep extraction.
- Extraction matrix design or updates.
- Multi-paper synthesis.
- Theme clustering.
- Consensus, conflict, and complementarity analysis.
- Gap maps.
- Argument candidates.
- Innovation opportunities.
- Writing plans.
- Presentation plans.

## Input Requirements

Before generating or modifying analysis, identify:

- Project ID or project context.
- Paper IDs and available paper metadata.
- Available evidence level: metadata-only, abstract-based, full-text, user-notes, or mixed.
- Research question or review objective.
- Whether the output is a suggestion or a confirmed reviewed value.
- Any source text, notes, abstracts, or full-text excerpts available to support claims.

If evidence is incomplete, state the limitation and use lower confidence.

## Output Requirements

Outputs must follow the LitMatrix data contract:

- Include supporting paper IDs where applicable.
- Include evidence level.
- Include confidence.
- Treat AI output as pending review unless explicitly confirmed by the user.
- Use `Not specified in the provided text.` when information is missing.
- Avoid provider-specific raw response formats.

## Candidate Paper Review Workflow

1. Read available metadata, abstract, and user notes.
2. Assess relevance to the project research question.
3. Identify inclusion and exclusion signals.
4. Mark confidence according to evidence quality.
5. Do not infer full-text findings from title or metadata alone.

## Paper Overview Workflow

For each paper, extract only supported information:

- Problem.
- Objective.
- Method.
- Dataset or corpus.
- Evaluation approach.
- Key findings.
- Limitations.
- Relevance to research question.

If a field is missing, write `Not specified in the provided text.`

## AI Analysis Workflow

AI analysis should produce suggestions, not final facts. Suggestions should:

- Be scoped to available evidence.
- Include evidence references.
- Include confidence.
- Include uncertainty notes when needed.
- Be stored with `status: "pending-review"` until reviewed.

## AI Suggestion Review Workflow

Review decisions are:

- Accept.
- Edit.
- Reject.
- Save as idea.

Accepted or edited suggestions may become confirmed extraction values. Rejected and saved-as-idea suggestions must not feed final synthesis.

## Deep Extraction Workflow

Deep extraction should populate candidate fields such as:

- Research problem.
- Research objective.
- Method.
- Dataset.
- Evaluation.
- Findings.
- Limitations.
- Threats to validity.
- Key concepts.
- Relevance to the review question.

Each extracted value needs evidence and confidence. Full-text claims require full-text evidence.

## Extraction Matrix Workflow

The extraction matrix separates suggested values from confirmed values.

Rules:

- `suggestedValue` may come from AI or importers.
- `confirmedValue` must come from user review or accepted/edited review decisions.
- Only `confirmedValue` is eligible for final synthesis.
- Preserve evidence references for each row.

## Multi-Paper Synthesis Workflow

Use only confirmed extraction values. Synthesis should:

- Group comparable findings.
- Identify shared methods, datasets, themes, and limitations.
- Distinguish consensus from conflict.
- Avoid treating unsupported suggestions as facts.

## Theme Clustering Workflow

Theme clusters must:

- Use confirmed extraction values.
- Include supporting paper IDs.
- Explain why papers belong together.
- Mark uncertain clusters as low or tentative confidence.

## Consensus / Conflict / Complementarity Analysis

For each item:

- Consensus: papers support a similar claim.
- Conflict: papers appear to disagree or report incompatible findings.
- Complementarity: papers address related parts of a broader picture.

Every item must link to supporting paper IDs and evidence.

## Gap Map Workflow

Gap items should identify missing or underdeveloped areas supported by the reviewed literature.

Each gap must:

- Link to supporting paper IDs.
- State the evidence basis.
- Avoid exaggerating absence if coverage is incomplete.
- Use low or tentative confidence when evidence is insufficient.

## Argument Candidate Workflow

Argument candidates should be possible claims for a survey paper or thesis discussion.

Each argument must:

- Link to supporting paper IDs.
- Use confirmed extraction and synthesis inputs.
- Include rationale.
- Distinguish strong claims from tentative interpretations.

## Innovation Opportunity Workflow

Innovation opportunities should connect gaps, limitations, or unresolved conflicts to possible future work.

Each opportunity must:

- Link to supporting paper IDs.
- Reference related gaps where available.
- Avoid claiming novelty without evidence.
- Mark speculative ideas as tentative.

## Writing Plan Workflow

Writing plans should organize confirmed synthesis outputs into sections.

Each section should include:

- Purpose.
- Supporting paper IDs.
- Key evidence.
- Notes about uncertainty or missing evidence.

Writing plans must not cite papers that are not present in the project.

## Presentation Plan Workflow

Presentation plans should translate confirmed synthesis into slides.

Each slide should include:

- Slide title.
- Objective.
- Supporting paper IDs.
- Speaker note guidance where supported.

Do not fabricate visuals, metrics, paper counts, or findings.

## Academic Safety Rules

- Do not fabricate citations.
- Do not fabricate page numbers.
- Do not fabricate quotes.
- Do not fabricate methods, datasets, evaluation results, or findings.
- If information is missing, write: `Not specified in the provided text.`
- Always distinguish metadata-only analysis, abstract-based analysis, full-text analysis, and user-notes-based analysis.
- Treat AI output as suggestions until user confirmation.
- Only confirmed extraction values should be used for final synthesis.
- Every gap, argument, and innovation opportunity must link back to supporting paper IDs.
- If evidence is insufficient, mark confidence as low or tentative.

## Evidence Rules

- Metadata-only evidence supports bibliographic and topical observations only.
- Abstract-based evidence supports high-level problem, method, and finding summaries only if stated in the abstract.
- Full-text evidence can support detailed method, dataset, evaluation, limitation, and quote-level claims.
- User-notes evidence must be labeled as user-notes-based.
- Mixed evidence should identify which claims come from which evidence types.

## Source Attribution Rules

- Link claims to paper IDs.
- Include page numbers only when provided.
- Include quotes only when exact quoted text is provided.
- Never infer a DOI, venue, author list, or year when missing.

## Uncertainty Rules

Use `confidence: "low"` or `confidence: "tentative"` when:

- Evidence is metadata-only for an analytical claim.
- The abstract is vague.
- User notes are incomplete.
- Papers conflict and the reason is unclear.
- A gap or opportunity is plausible but not strongly supported.
