"use client";

import { ProjectSidebar } from "@/components/layout/ProjectSidebar";
import { WorkspaceTopBar } from "@/components/layout/WorkspaceTopBar";
import { StageTabs } from "@/components/analysis/StageTabs";
import { PDFViewerShell } from "@/components/papers/PDFViewerShell";
import { SuggestionCard } from "@/components/review/SuggestionCard";
import { WorkflowCtaBar } from "@/components/common/WorkflowCtaBar";
import { InertActionBadge } from "@/components/common/InertActionBadge";
import { useLitmatrixResource } from "@/lib/api/useLitmatrixResource";
import type { AISuggestion, Paper, ReviewDecision } from "@/lib/types/litmatrix";

export function ReviewWorkspaceView({ projectId }: { projectId: string }) {
  const { data: papers } = useLitmatrixResource<Paper[]>(`/api/projects/${projectId}/papers`);
  const { data: suggestions, reload: reloadSuggestions } = useLitmatrixResource<AISuggestion[]>(
    `/api/projects/${projectId}/suggestions`,
  );
  const { data: decisions, reload: reloadDecisions } = useLitmatrixResource<ReviewDecision[]>(
    `/api/projects/${projectId}/review-decisions`,
  );
  const paperById = new Map((papers ?? []).map((paper) => [paper.id, paper]));
  const suggestionList = suggestions ?? [];

  return (
    <main className="flex min-h-screen bg-background text-foreground">
      <ProjectSidebar projectId={projectId} />
      <section className="min-w-0 flex-1">
        <WorkspaceTopBar title="Review AI Suggestions" context="Academic Workspace" actionLabel="Save" />
        <div className="grid gap-6 p-6 xl:grid-cols-[minmax(0,1fr)_460px]">
          <section className="space-y-6">
            <StageTabs
              projectId={projectId}
              active="review"
              reviewCount={suggestionList.filter((suggestion) => suggestion.status === "pending-review").length}
            />
            <WorkflowCtaBar items={[{ label: "Open extraction matrix", href: `/projects/${projectId}/matrix`, primary: true }]} />
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <h1 className="text-2xl font-semibold tracking-tight text-foreground">Review AI Suggestions</h1>
                <p className="mt-1 text-sm text-muted">Review and confirm extracted entities for the matrix.</p>
              </div>
              <span className="rounded-full bg-surface-muted px-3 py-1 text-xs font-semibold text-muted">
                {decisions?.length ?? 0} Reviewed
              </span>
            </div>
            <div className="space-y-4">
              {suggestionList.map((suggestion) => (
                <SuggestionCard
                  key={suggestion.id}
                  suggestion={suggestion}
                  paper={suggestion.paperId ? paperById.get(suggestion.paperId) : undefined}
                  onChanged={() => {
                    reloadSuggestions();
                    reloadDecisions();
                  }}
                />
              ))}
            </div>
            <div className="sticky bottom-0 rounded border border-border/50 bg-[#fdfdfd]/90 p-4 backdrop-blur">
              <button
                className="flex w-full items-center justify-center gap-2 rounded-sm border border-border/60 bg-surface px-4 py-3 text-sm font-medium text-muted opacity-80"
                disabled
              >
                Batch save confirmed values
                <InertActionBadge label="Coming soon" />
              </button>
            </div>
          </section>
          <PDFViewerShell paper={(papers ?? [])[0] ?? null} />
        </div>
      </section>
    </main>
  );
}
