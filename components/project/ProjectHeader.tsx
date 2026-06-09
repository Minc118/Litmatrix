import { Brain, FileText, Rows3, Sparkles } from "lucide-react";
import type { AISuggestion, ExtractionMatrixRow, Paper, ProjectDetail } from "@/lib/types/litmatrix";

export function ProjectHeader({
  project,
  papers,
  suggestions,
  matrixRows,
}: {
  project: ProjectDetail | null;
  papers: Paper[];
  suggestions: AISuggestion[];
  matrixRows: ExtractionMatrixRow[];
}) {
  const confirmedRows = matrixRows.filter((row) => row.confirmedValue);
  const pendingSuggestions = suggestions.filter((suggestion) => suggestion.status === "pending-review");

  const stats = [
    { label: "Uploaded Papers", value: papers.length, icon: FileText },
    { label: "AI Suggestions", value: suggestions.length, icon: Brain },
    { label: "Confirmed Rows", value: confirmedRows.length, icon: Rows3 },
    { label: "Pending Review", value: pendingSuggestions.length, icon: Sparkles },
  ];

  return (
    <section className="space-y-6">
      <div>
        <p className="lm-label">Project Workspace</p>
        <div className="mt-2 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight text-foreground">
              {project?.title ?? "Loading project"}
            </h1>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-muted">{project?.description}</p>
          </div>
          <div className="rounded-sm border border-border bg-surface px-3 py-2 text-xs font-semibold uppercase tracking-wide text-muted">
            Demo Mode
          </div>
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <article key={stat.label} className="lm-card p-5">
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded bg-surface-muted text-foreground">
                <Icon className="h-5 w-5" aria-hidden="true" />
              </div>
              <p className="text-2xl font-semibold text-foreground">{stat.value}</p>
              <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-muted">{stat.label}</p>
            </article>
          );
        })}
      </div>
    </section>
  );
}
