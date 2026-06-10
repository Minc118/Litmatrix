CREATE TYPE "public"."analysis_run_status" AS ENUM('queued', 'running', 'completed', 'failed', 'cancelled');--> statement-breakpoint
CREATE TYPE "public"."analysis_run_type" AS ENUM('overview', 'extraction', 'synthesis', 'import', 'export');--> statement-breakpoint
CREATE TYPE "public"."analysis_source" AS ENUM('mock', 'gemini-api', 'antigravity-local', 'manual', 'imported', 'zotero-local', 'zotero-web', 'pdf-parser');--> statement-breakpoint
CREATE TYPE "public"."confidence" AS ENUM('high', 'medium', 'low', 'tentative');--> statement-breakpoint
CREATE TYPE "public"."consensus_item_type" AS ENUM('consensus', 'conflict', 'complementarity');--> statement-breakpoint
CREATE TYPE "public"."evidence_level" AS ENUM('metadata-only', 'abstract-based', 'full-text', 'user-notes', 'mixed');--> statement-breakpoint
CREATE TYPE "public"."gap_type" AS ENUM('method', 'dataset', 'evaluation', 'theory', 'application', 'other');--> statement-breakpoint
CREATE TYPE "public"."import_status" AS ENUM('pending', 'validating', 'imported', 'failed');--> statement-breakpoint
CREATE TYPE "public"."import_type" AS ENUM('antigravity-json', 'manual-notes', 'zotero-local', 'zotero-web', 'pdf-parser', 'notebooklm-notes');--> statement-breakpoint
CREATE TYPE "public"."project_status" AS ENUM('draft', 'active', 'archived');--> statement-breakpoint
CREATE TYPE "public"."review_decision" AS ENUM('accepted', 'edited', 'rejected', 'saved-as-idea');--> statement-breakpoint
CREATE TYPE "public"."review_status" AS ENUM('pending-review', 'accepted', 'edited', 'rejected', 'saved-as-idea');--> statement-breakpoint
CREATE TYPE "public"."suggestion_type" AS ENUM('paper-overview', 'extraction-field', 'theme', 'gap', 'argument', 'innovation', 'writing-plan', 'presentation-plan');--> statement-breakpoint
CREATE TABLE "ai_suggestions" (
	"id" text PRIMARY KEY NOT NULL,
	"project_id" text NOT NULL,
	"paper_id" text,
	"analysis_source" "analysis_source" NOT NULL,
	"evidence_level" "evidence_level" NOT NULL,
	"status" "review_status" NOT NULL,
	"confidence" "confidence" NOT NULL,
	"suggestion_type" "suggestion_type" NOT NULL,
	"title" text NOT NULL,
	"content" text NOT NULL,
	"target_field" text,
	"evidence" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "analysis_runs" (
	"id" text PRIMARY KEY NOT NULL,
	"project_id" text NOT NULL,
	"paper_id" text,
	"run_type" "analysis_run_type" NOT NULL,
	"analysis_source" "analysis_source" NOT NULL,
	"status" "analysis_run_status" NOT NULL,
	"started_at" timestamp with time zone,
	"completed_at" timestamp with time zone,
	"error_code" text,
	"error_message" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "argument_candidates" (
	"id" text PRIMARY KEY NOT NULL,
	"project_id" text NOT NULL,
	"paper_id" text,
	"analysis_source" "analysis_source" NOT NULL,
	"evidence_level" "evidence_level" NOT NULL,
	"status" "review_status" NOT NULL,
	"confidence" "confidence" NOT NULL,
	"claim" text NOT NULL,
	"rationale" text NOT NULL,
	"supporting_paper_ids" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"related_gap_ids" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"evidence" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "consensus_conflict_items" (
	"id" text PRIMARY KEY NOT NULL,
	"project_id" text NOT NULL,
	"paper_id" text,
	"analysis_source" "analysis_source" NOT NULL,
	"evidence_level" "evidence_level" NOT NULL,
	"status" "review_status" NOT NULL,
	"confidence" "confidence" NOT NULL,
	"item_type" "consensus_item_type" NOT NULL,
	"claim" text NOT NULL,
	"supporting_paper_ids" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"contrasting_paper_ids" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"evidence" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "extraction_matrix_rows" (
	"id" text PRIMARY KEY NOT NULL,
	"project_id" text NOT NULL,
	"paper_id" text NOT NULL,
	"analysis_source" "analysis_source" NOT NULL,
	"evidence_level" "evidence_level" NOT NULL,
	"status" "review_status" NOT NULL,
	"confidence" "confidence" NOT NULL,
	"field_key" text NOT NULL,
	"field_label" text NOT NULL,
	"suggested_value" text,
	"confirmed_value" text,
	"confirmed_by_decision_id" text,
	"evidence" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "gap_items" (
	"id" text PRIMARY KEY NOT NULL,
	"project_id" text NOT NULL,
	"paper_id" text,
	"analysis_source" "analysis_source" NOT NULL,
	"evidence_level" "evidence_level" NOT NULL,
	"status" "review_status" NOT NULL,
	"confidence" "confidence" NOT NULL,
	"gap_type" "gap_type",
	"title" text NOT NULL,
	"description" text NOT NULL,
	"supporting_paper_ids" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"evidence" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "import_jobs" (
	"id" text PRIMARY KEY NOT NULL,
	"project_id" text NOT NULL,
	"import_type" "import_type" NOT NULL,
	"analysis_source" "analysis_source" NOT NULL,
	"status" "import_status" NOT NULL,
	"input_summary" text,
	"records_created" integer DEFAULT 0 NOT NULL,
	"records_rejected" integer DEFAULT 0 NOT NULL,
	"validation_errors" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "innovation_opportunities" (
	"id" text PRIMARY KEY NOT NULL,
	"project_id" text NOT NULL,
	"paper_id" text,
	"analysis_source" "analysis_source" NOT NULL,
	"evidence_level" "evidence_level" NOT NULL,
	"status" "review_status" NOT NULL,
	"confidence" "confidence" NOT NULL,
	"title" text NOT NULL,
	"opportunity" text NOT NULL,
	"rationale" text NOT NULL,
	"supporting_paper_ids" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"related_gap_ids" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"evidence" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "keyword_groups" (
	"id" text PRIMARY KEY NOT NULL,
	"project_id" text NOT NULL,
	"label" text NOT NULL,
	"keywords" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "paper_overviews" (
	"id" text PRIMARY KEY NOT NULL,
	"project_id" text NOT NULL,
	"paper_id" text NOT NULL,
	"analysis_source" "analysis_source" NOT NULL,
	"evidence_level" "evidence_level" NOT NULL,
	"status" "review_status" NOT NULL,
	"confidence" "confidence" NOT NULL,
	"problem" text,
	"objective" text,
	"method" text,
	"dataset" text,
	"findings" text,
	"limitations" text,
	"evidence" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "papers" (
	"id" text PRIMARY KEY NOT NULL,
	"project_id" text NOT NULL,
	"title" text NOT NULL,
	"authors" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"year" integer,
	"venue" text,
	"doi" text,
	"url" text,
	"abstract" text,
	"zotero_item_key" text,
	"zotero_library_type" text,
	"pdf_file_id" text,
	"tags" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "presentation_plans" (
	"id" text PRIMARY KEY NOT NULL,
	"project_id" text NOT NULL,
	"paper_id" text,
	"analysis_source" "analysis_source" NOT NULL,
	"evidence_level" "evidence_level" NOT NULL,
	"status" "review_status" NOT NULL,
	"confidence" "confidence" NOT NULL,
	"title" text NOT NULL,
	"slides" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"evidence" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "projects" (
	"id" text PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"status" "project_status" DEFAULT 'draft' NOT NULL,
	"demo" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "research_questions" (
	"id" text PRIMARY KEY NOT NULL,
	"project_id" text NOT NULL,
	"text" text NOT NULL,
	"rationale" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "review_decisions" (
	"id" text PRIMARY KEY NOT NULL,
	"project_id" text NOT NULL,
	"paper_id" text,
	"suggestion_id" text NOT NULL,
	"decision" "review_decision" NOT NULL,
	"edited_content" text,
	"reviewer_note" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "theme_clusters" (
	"id" text PRIMARY KEY NOT NULL,
	"project_id" text NOT NULL,
	"paper_id" text,
	"analysis_source" "analysis_source" NOT NULL,
	"evidence_level" "evidence_level" NOT NULL,
	"status" "review_status" NOT NULL,
	"confidence" "confidence" NOT NULL,
	"label" text NOT NULL,
	"summary" text NOT NULL,
	"supporting_paper_ids" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"supporting_matrix_row_ids" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"evidence" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "writing_plans" (
	"id" text PRIMARY KEY NOT NULL,
	"project_id" text NOT NULL,
	"paper_id" text,
	"analysis_source" "analysis_source" NOT NULL,
	"evidence_level" "evidence_level" NOT NULL,
	"status" "review_status" NOT NULL,
	"confidence" "confidence" NOT NULL,
	"title" text NOT NULL,
	"sections" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"evidence" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "ai_suggestions" ADD CONSTRAINT "ai_suggestions_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ai_suggestions" ADD CONSTRAINT "ai_suggestions_paper_id_papers_id_fk" FOREIGN KEY ("paper_id") REFERENCES "public"."papers"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "analysis_runs" ADD CONSTRAINT "analysis_runs_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "analysis_runs" ADD CONSTRAINT "analysis_runs_paper_id_papers_id_fk" FOREIGN KEY ("paper_id") REFERENCES "public"."papers"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "argument_candidates" ADD CONSTRAINT "argument_candidates_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "argument_candidates" ADD CONSTRAINT "argument_candidates_paper_id_papers_id_fk" FOREIGN KEY ("paper_id") REFERENCES "public"."papers"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "consensus_conflict_items" ADD CONSTRAINT "consensus_conflict_items_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "consensus_conflict_items" ADD CONSTRAINT "consensus_conflict_items_paper_id_papers_id_fk" FOREIGN KEY ("paper_id") REFERENCES "public"."papers"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "extraction_matrix_rows" ADD CONSTRAINT "extraction_matrix_rows_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "extraction_matrix_rows" ADD CONSTRAINT "extraction_matrix_rows_paper_id_papers_id_fk" FOREIGN KEY ("paper_id") REFERENCES "public"."papers"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "extraction_matrix_rows" ADD CONSTRAINT "extraction_matrix_rows_confirmed_by_decision_id_review_decisions_id_fk" FOREIGN KEY ("confirmed_by_decision_id") REFERENCES "public"."review_decisions"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "gap_items" ADD CONSTRAINT "gap_items_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "gap_items" ADD CONSTRAINT "gap_items_paper_id_papers_id_fk" FOREIGN KEY ("paper_id") REFERENCES "public"."papers"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "import_jobs" ADD CONSTRAINT "import_jobs_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "innovation_opportunities" ADD CONSTRAINT "innovation_opportunities_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "innovation_opportunities" ADD CONSTRAINT "innovation_opportunities_paper_id_papers_id_fk" FOREIGN KEY ("paper_id") REFERENCES "public"."papers"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "keyword_groups" ADD CONSTRAINT "keyword_groups_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "paper_overviews" ADD CONSTRAINT "paper_overviews_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "paper_overviews" ADD CONSTRAINT "paper_overviews_paper_id_papers_id_fk" FOREIGN KEY ("paper_id") REFERENCES "public"."papers"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "papers" ADD CONSTRAINT "papers_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "presentation_plans" ADD CONSTRAINT "presentation_plans_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "presentation_plans" ADD CONSTRAINT "presentation_plans_paper_id_papers_id_fk" FOREIGN KEY ("paper_id") REFERENCES "public"."papers"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "research_questions" ADD CONSTRAINT "research_questions_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "review_decisions" ADD CONSTRAINT "review_decisions_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "review_decisions" ADD CONSTRAINT "review_decisions_paper_id_papers_id_fk" FOREIGN KEY ("paper_id") REFERENCES "public"."papers"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "review_decisions" ADD CONSTRAINT "review_decisions_suggestion_id_ai_suggestions_id_fk" FOREIGN KEY ("suggestion_id") REFERENCES "public"."ai_suggestions"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "theme_clusters" ADD CONSTRAINT "theme_clusters_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "theme_clusters" ADD CONSTRAINT "theme_clusters_paper_id_papers_id_fk" FOREIGN KEY ("paper_id") REFERENCES "public"."papers"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "writing_plans" ADD CONSTRAINT "writing_plans_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "writing_plans" ADD CONSTRAINT "writing_plans_paper_id_papers_id_fk" FOREIGN KEY ("paper_id") REFERENCES "public"."papers"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "ai_suggestions_project_idx" ON "ai_suggestions" USING btree ("project_id");--> statement-breakpoint
CREATE INDEX "ai_suggestions_paper_idx" ON "ai_suggestions" USING btree ("paper_id");--> statement-breakpoint
CREATE INDEX "ai_suggestions_status_idx" ON "ai_suggestions" USING btree ("status");--> statement-breakpoint
CREATE INDEX "ai_suggestions_type_idx" ON "ai_suggestions" USING btree ("suggestion_type");--> statement-breakpoint
CREATE INDEX "analysis_runs_project_idx" ON "analysis_runs" USING btree ("project_id");--> statement-breakpoint
CREATE INDEX "analysis_runs_paper_idx" ON "analysis_runs" USING btree ("paper_id");--> statement-breakpoint
CREATE INDEX "argument_candidates_project_idx" ON "argument_candidates" USING btree ("project_id");--> statement-breakpoint
CREATE INDEX "consensus_conflict_project_idx" ON "consensus_conflict_items" USING btree ("project_id");--> statement-breakpoint
CREATE INDEX "extraction_rows_project_idx" ON "extraction_matrix_rows" USING btree ("project_id");--> statement-breakpoint
CREATE INDEX "extraction_rows_paper_idx" ON "extraction_matrix_rows" USING btree ("paper_id");--> statement-breakpoint
CREATE INDEX "extraction_rows_status_idx" ON "extraction_matrix_rows" USING btree ("status");--> statement-breakpoint
CREATE INDEX "extraction_rows_field_idx" ON "extraction_matrix_rows" USING btree ("project_id","paper_id","field_key");--> statement-breakpoint
CREATE INDEX "gap_items_project_idx" ON "gap_items" USING btree ("project_id");--> statement-breakpoint
CREATE INDEX "import_jobs_project_idx" ON "import_jobs" USING btree ("project_id");--> statement-breakpoint
CREATE INDEX "innovation_opportunities_project_idx" ON "innovation_opportunities" USING btree ("project_id");--> statement-breakpoint
CREATE INDEX "keyword_groups_project_idx" ON "keyword_groups" USING btree ("project_id");--> statement-breakpoint
CREATE INDEX "paper_overviews_project_idx" ON "paper_overviews" USING btree ("project_id");--> statement-breakpoint
CREATE INDEX "paper_overviews_paper_idx" ON "paper_overviews" USING btree ("paper_id");--> statement-breakpoint
CREATE INDEX "paper_overviews_status_idx" ON "paper_overviews" USING btree ("status");--> statement-breakpoint
CREATE INDEX "papers_project_idx" ON "papers" USING btree ("project_id");--> statement-breakpoint
CREATE INDEX "papers_zotero_key_idx" ON "papers" USING btree ("zotero_item_key");--> statement-breakpoint
CREATE INDEX "presentation_plans_project_idx" ON "presentation_plans" USING btree ("project_id");--> statement-breakpoint
CREATE INDEX "research_questions_project_idx" ON "research_questions" USING btree ("project_id");--> statement-breakpoint
CREATE INDEX "review_decisions_project_idx" ON "review_decisions" USING btree ("project_id");--> statement-breakpoint
CREATE INDEX "review_decisions_paper_idx" ON "review_decisions" USING btree ("paper_id");--> statement-breakpoint
CREATE INDEX "review_decisions_suggestion_idx" ON "review_decisions" USING btree ("suggestion_id");--> statement-breakpoint
CREATE INDEX "theme_clusters_project_idx" ON "theme_clusters" USING btree ("project_id");--> statement-breakpoint
CREATE INDEX "writing_plans_project_idx" ON "writing_plans" USING btree ("project_id");