import { Brain, Play } from "lucide-react";
import { InertActionBadge } from "@/components/common/InertActionBadge";
import type { AISuggestion, ProjectDetail, ResearchQuestion } from "@/lib/types/litmatrix";
import { ConfidenceBadge, EvidenceLevelBadge, ReviewStatusBadge, SourceBadge } from "@/components/common/StatusBadges";

export function AIAnalysisPanel({
  project,
  suggestions,
}: {
  project: ProjectDetail | null;
  suggestions: AISuggestion[];
}) {
  const questions: ResearchQuestion[] = project?.researchQuestions ?? [];

  return (
    <section className="space-y-6">
      <div className="lm-card p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="lm-label">Analysis Configuration</p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight text-foreground">AI Analysis</h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-muted">
              This route shows provider-agnostic demo suggestions. Gemini overview/extraction is available only after
              database migration and provider configuration.
            </p>
          </div>
          <button
            className="inline-flex items-center justify-center gap-2 rounded-sm border border-border/60 bg-surface px-4 py-2.5 text-sm font-medium text-muted opacity-80"
            disabled
          >
            <Play className="h-4 w-4" aria-hidden="true" />
            Run Analysis
            <InertActionBadge label="Not connected" />
          </button>
        </div>
        <div className="mt-6 grid gap-4 lg:grid-cols-2">
          <div className="rounded border border-border/50 bg-[#f8fafc] p-4">
            <p className="lm-label">Research Questions</p>
            <div className="mt-3 space-y-3">
              {questions.map((question) => (
                <p key={question.id} className="text-sm leading-6 text-foreground">
                  {question.text}
                </p>
              ))}
            </div>
          </div>
          <div className="rounded border border-border/50 bg-[#f8fafc] p-4">
            <p className="lm-label">Extraction Schema Preview</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {["Problem", "Objective", "Method", "Dataset", "Findings", "Limitations", "Research Gap"].map(
                (field) => (
                  <span key={field} className="rounded-sm border border-border bg-surface px-2 py-1 text-xs text-muted">
                    {field}
                  </span>
                ),
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="grid gap-4">
        {suggestions.map((suggestion) => (
          <article key={suggestion.id} className="lm-card p-5">
            <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
              <div className="flex gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded bg-secondary-muted text-secondary">
                  <Brain className="h-5 w-5" aria-hidden="true" />
                </div>
                <div>
                  <p className="lm-label">{suggestion.suggestionType.replace("-", " ")}</p>
                  <h3 className="mt-1 text-base font-semibold text-foreground">{suggestion.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-muted">{suggestion.content}</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                <SourceBadge source={suggestion.analysisSource} />
                <EvidenceLevelBadge level={suggestion.evidenceLevel} />
                <ConfidenceBadge confidence={suggestion.confidence} />
                <ReviewStatusBadge status={suggestion.status} />
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
