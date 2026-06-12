import { sql } from "drizzle-orm";
import {
  boolean,
  index,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  text,
  timestamp,
} from "drizzle-orm/pg-core";
import type {
  AnalysisRun,
  Confidence,
  EvidenceLevel,
  EvidenceReference,
  ImportJob,
  PresentationPlan,
  Project,
  ReviewStatus,
  WritingPlan,
} from "../../types/litmatrix";

export const projectStatusEnum = pgEnum("project_status", ["draft", "active", "archived"]);
export const analysisSourceEnum = pgEnum("analysis_source", [
  "mock",
  "gemini-api",
  "antigravity-local",
  "manual",
  "imported",
  "zotero-local",
  "zotero-web",
  "pdf-parser",
]);
export const evidenceLevelEnum = pgEnum("evidence_level", [
  "metadata-only",
  "abstract-based",
  "full-text",
  "user-notes",
  "mixed",
]);
export const reviewStatusEnum = pgEnum("review_status", [
  "pending-review",
  "accepted",
  "edited",
  "rejected",
  "saved-as-idea",
]);
export const confidenceEnum = pgEnum("confidence", ["high", "medium", "low", "tentative"]);
export const suggestionTypeEnum = pgEnum("suggestion_type", [
  "paper-overview",
  "extraction-field",
  "theme",
  "gap",
  "argument",
  "innovation",
  "writing-plan",
  "presentation-plan",
]);
export const reviewDecisionEnum = pgEnum("review_decision", [
  "accepted",
  "edited",
  "rejected",
  "saved-as-idea",
]);
export const consensusItemTypeEnum = pgEnum("consensus_item_type", [
  "consensus",
  "conflict",
  "complementarity",
]);
export const gapTypeEnum = pgEnum("gap_type", [
  "method",
  "dataset",
  "evaluation",
  "theory",
  "application",
  "other",
]);
export const analysisRunTypeEnum = pgEnum("analysis_run_type", [
  "overview",
  "extraction",
  "synthesis",
  "import",
  "export",
]);
export const analysisRunStatusEnum = pgEnum("analysis_run_status", [
  "queued",
  "running",
  "completed",
  "failed",
  "cancelled",
]);
export const importTypeEnum = pgEnum("import_type", [
  "antigravity-json",
  "manual-notes",
  "zotero-local",
  "zotero-web",
  "pdf-parser",
  "notebooklm-notes",
]);
export const importStatusEnum = pgEnum("import_status", ["pending", "validating", "imported", "failed"]);

const timestamps = {
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
};

const analysisMetadata = {
  analysisSource: analysisSourceEnum("analysis_source").notNull(),
  evidenceLevel: evidenceLevelEnum("evidence_level").notNull(),
  status: reviewStatusEnum("status").notNull(),
  confidence: confidenceEnum("confidence").notNull(),
};

const evidenceColumn = () =>
  jsonb("evidence").$type<EvidenceReference[]>().notNull().default(sql`'[]'::jsonb`);

const textArrayColumn = (name: string) =>
  jsonb(name).$type<string[]>().notNull().default(sql`'[]'::jsonb`);

export const projects = pgTable("projects", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  status: projectStatusEnum("status").$type<NonNullable<Project["status"]>>().notNull().default("draft"),
  demo: boolean("demo").notNull().default(false),
  userId: text("user_id"),
  ...timestamps,
});

export const researchQuestions = pgTable(
  "research_questions",
  {
    id: text("id").primaryKey(),
    projectId: text("project_id")
      .notNull()
      .references(() => projects.id),
    text: text("text").notNull(),
    rationale: text("rationale"),
    ...timestamps,
  },
  (table) => [index("research_questions_project_idx").on(table.projectId)],
);

export const keywordGroups = pgTable(
  "keyword_groups",
  {
    id: text("id").primaryKey(),
    projectId: text("project_id")
      .notNull()
      .references(() => projects.id),
    label: text("label").notNull(),
    keywords: textArrayColumn("keywords"),
    ...timestamps,
  },
  (table) => [index("keyword_groups_project_idx").on(table.projectId)],
);

export const papers = pgTable(
  "papers",
  {
    id: text("id").primaryKey(),
    projectId: text("project_id")
      .notNull()
      .references(() => projects.id),
    title: text("title").notNull(),
    authors: textArrayColumn("authors"),
    year: integer("year"),
    venue: text("venue"),
    doi: text("doi"),
    url: text("url"),
    abstract: text("abstract"),
    zoteroItemKey: text("zotero_item_key"),
    zoteroLibraryType: text("zotero_library_type"),
    pdfFileId: text("pdf_file_id"),
    tags: textArrayColumn("tags"),
    ...timestamps,
  },
  (table) => [
    index("papers_project_idx").on(table.projectId),
    index("papers_zotero_key_idx").on(table.zoteroItemKey),
  ],
);

export const paperOverviews = pgTable(
  "paper_overviews",
  {
    id: text("id").primaryKey(),
    projectId: text("project_id")
      .notNull()
      .references(() => projects.id),
    paperId: text("paper_id")
      .notNull()
      .references(() => papers.id),
    ...analysisMetadata,
    problem: text("problem"),
    objective: text("objective"),
    method: text("method"),
    dataset: text("dataset"),
    findings: text("findings"),
    limitations: text("limitations"),
    evidence: evidenceColumn(),
    ...timestamps,
  },
  (table) => [
    index("paper_overviews_project_idx").on(table.projectId),
    index("paper_overviews_paper_idx").on(table.paperId),
    index("paper_overviews_status_idx").on(table.status),
  ],
);

export const aiSuggestions = pgTable(
  "ai_suggestions",
  {
    id: text("id").primaryKey(),
    projectId: text("project_id")
      .notNull()
      .references(() => projects.id),
    paperId: text("paper_id").references(() => papers.id),
    ...analysisMetadata,
    suggestionType: suggestionTypeEnum("suggestion_type").notNull(),
    title: text("title").notNull(),
    content: text("content").notNull(),
    targetField: text("target_field"),
    evidence: evidenceColumn(),
    ...timestamps,
  },
  (table) => [
    index("ai_suggestions_project_idx").on(table.projectId),
    index("ai_suggestions_paper_idx").on(table.paperId),
    index("ai_suggestions_status_idx").on(table.status),
    index("ai_suggestions_type_idx").on(table.suggestionType),
  ],
);

export const reviewDecisions = pgTable(
  "review_decisions",
  {
    id: text("id").primaryKey(),
    projectId: text("project_id")
      .notNull()
      .references(() => projects.id),
    paperId: text("paper_id").references(() => papers.id),
    suggestionId: text("suggestion_id")
      .notNull()
      .references(() => aiSuggestions.id),
    decision: reviewDecisionEnum("decision").notNull(),
    editedContent: text("edited_content"),
    reviewerNote: text("reviewer_note"),
    ...timestamps,
  },
  (table) => [
    index("review_decisions_project_idx").on(table.projectId),
    index("review_decisions_paper_idx").on(table.paperId),
    index("review_decisions_suggestion_idx").on(table.suggestionId),
  ],
);

export const extractionMatrixRows = pgTable(
  "extraction_matrix_rows",
  {
    id: text("id").primaryKey(),
    projectId: text("project_id")
      .notNull()
      .references(() => projects.id),
    paperId: text("paper_id")
      .notNull()
      .references(() => papers.id),
    ...analysisMetadata,
    fieldKey: text("field_key").notNull(),
    fieldLabel: text("field_label").notNull(),
    suggestedValue: text("suggested_value"),
    confirmedValue: text("confirmed_value"),
    confirmedByDecisionId: text("confirmed_by_decision_id").references(() => reviewDecisions.id),
    evidence: evidenceColumn(),
    ...timestamps,
  },
  (table) => [
    index("extraction_rows_project_idx").on(table.projectId),
    index("extraction_rows_paper_idx").on(table.paperId),
    index("extraction_rows_status_idx").on(table.status),
    index("extraction_rows_field_idx").on(table.projectId, table.paperId, table.fieldKey),
  ],
);

export const themeClusters = pgTable(
  "theme_clusters",
  {
    id: text("id").primaryKey(),
    projectId: text("project_id")
      .notNull()
      .references(() => projects.id),
    paperId: text("paper_id").references(() => papers.id),
    ...analysisMetadata,
    label: text("label").notNull(),
    summary: text("summary").notNull(),
    supportingPaperIds: textArrayColumn("supporting_paper_ids"),
    supportingMatrixRowIds: textArrayColumn("supporting_matrix_row_ids"),
    evidence: evidenceColumn(),
    ...timestamps,
  },
  (table) => [index("theme_clusters_project_idx").on(table.projectId)],
);

export const consensusConflictItems = pgTable(
  "consensus_conflict_items",
  {
    id: text("id").primaryKey(),
    projectId: text("project_id")
      .notNull()
      .references(() => projects.id),
    paperId: text("paper_id").references(() => papers.id),
    ...analysisMetadata,
    itemType: consensusItemTypeEnum("item_type").notNull(),
    claim: text("claim").notNull(),
    supportingPaperIds: textArrayColumn("supporting_paper_ids"),
    contrastingPaperIds: textArrayColumn("contrasting_paper_ids"),
    evidence: evidenceColumn(),
    ...timestamps,
  },
  (table) => [index("consensus_conflict_project_idx").on(table.projectId)],
);

export const gapItems = pgTable(
  "gap_items",
  {
    id: text("id").primaryKey(),
    projectId: text("project_id")
      .notNull()
      .references(() => projects.id),
    paperId: text("paper_id").references(() => papers.id),
    ...analysisMetadata,
    gapType: gapTypeEnum("gap_type"),
    title: text("title").notNull(),
    description: text("description").notNull(),
    supportingPaperIds: textArrayColumn("supporting_paper_ids"),
    evidence: evidenceColumn(),
    ...timestamps,
  },
  (table) => [index("gap_items_project_idx").on(table.projectId)],
);

export const argumentCandidates = pgTable(
  "argument_candidates",
  {
    id: text("id").primaryKey(),
    projectId: text("project_id")
      .notNull()
      .references(() => projects.id),
    paperId: text("paper_id").references(() => papers.id),
    ...analysisMetadata,
    claim: text("claim").notNull(),
    rationale: text("rationale").notNull(),
    supportingPaperIds: textArrayColumn("supporting_paper_ids"),
    relatedGapIds: textArrayColumn("related_gap_ids"),
    evidence: evidenceColumn(),
    ...timestamps,
  },
  (table) => [index("argument_candidates_project_idx").on(table.projectId)],
);

export const innovationOpportunities = pgTable(
  "innovation_opportunities",
  {
    id: text("id").primaryKey(),
    projectId: text("project_id")
      .notNull()
      .references(() => projects.id),
    paperId: text("paper_id").references(() => papers.id),
    ...analysisMetadata,
    title: text("title").notNull(),
    opportunity: text("opportunity").notNull(),
    rationale: text("rationale").notNull(),
    supportingPaperIds: textArrayColumn("supporting_paper_ids"),
    relatedGapIds: textArrayColumn("related_gap_ids"),
    evidence: evidenceColumn(),
    ...timestamps,
  },
  (table) => [index("innovation_opportunities_project_idx").on(table.projectId)],
);

export const writingPlans = pgTable(
  "writing_plans",
  {
    id: text("id").primaryKey(),
    projectId: text("project_id")
      .notNull()
      .references(() => projects.id),
    paperId: text("paper_id").references(() => papers.id),
    ...analysisMetadata,
    title: text("title").notNull(),
    sections: jsonb("sections").$type<WritingPlan["sections"]>().notNull().default(sql`'[]'::jsonb`),
    evidence: evidenceColumn(),
    ...timestamps,
  },
  (table) => [index("writing_plans_project_idx").on(table.projectId)],
);

export const presentationPlans = pgTable(
  "presentation_plans",
  {
    id: text("id").primaryKey(),
    projectId: text("project_id")
      .notNull()
      .references(() => projects.id),
    paperId: text("paper_id").references(() => papers.id),
    ...analysisMetadata,
    title: text("title").notNull(),
    slides: jsonb("slides").$type<PresentationPlan["slides"]>().notNull().default(sql`'[]'::jsonb`),
    evidence: evidenceColumn(),
    ...timestamps,
  },
  (table) => [index("presentation_plans_project_idx").on(table.projectId)],
);

export const analysisRuns = pgTable(
  "analysis_runs",
  {
    id: text("id").primaryKey(),
    projectId: text("project_id")
      .notNull()
      .references(() => projects.id),
    paperId: text("paper_id").references(() => papers.id),
    runType: analysisRunTypeEnum("run_type").$type<AnalysisRun["runType"]>().notNull(),
    analysisSource: analysisSourceEnum("analysis_source").notNull(),
    status: analysisRunStatusEnum("status").$type<AnalysisRun["status"]>().notNull(),
    startedAt: timestamp("started_at", { withTimezone: true }),
    completedAt: timestamp("completed_at", { withTimezone: true }),
    errorCode: text("error_code"),
    errorMessage: text("error_message"),
    ...timestamps,
  },
  (table) => [
    index("analysis_runs_project_idx").on(table.projectId),
    index("analysis_runs_paper_idx").on(table.paperId),
  ],
);

export const importJobs = pgTable(
  "import_jobs",
  {
    id: text("id").primaryKey(),
    projectId: text("project_id")
      .notNull()
      .references(() => projects.id),
    importType: importTypeEnum("import_type").$type<ImportJob["importType"]>().notNull(),
    analysisSource: analysisSourceEnum("analysis_source").notNull(),
    status: importStatusEnum("status").$type<ImportJob["status"]>().notNull(),
    inputSummary: text("input_summary"),
    recordsCreated: integer("records_created").notNull().default(0),
    recordsRejected: integer("records_rejected").notNull().default(0),
    validationErrors: jsonb("validation_errors")
      .$type<NonNullable<ImportJob["validationErrors"]>>()
      .notNull()
      .default(sql`'[]'::jsonb`),
    ...timestamps,
  },
  (table) => [index("import_jobs_project_idx").on(table.projectId)],
);

export type DbReviewDecision = typeof reviewDecisions.$inferInsert["decision"];
export type DbReviewStatus = ReviewStatus;
export type DbEvidenceLevel = EvidenceLevel;
export type DbConfidence = Confidence;
