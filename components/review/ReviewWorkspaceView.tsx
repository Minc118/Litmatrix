"use client";

import { useSearchParams, useRouter } from "next/navigation";
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
  const router = useRouter();
  const searchParams = useSearchParams();
  const activePaperId = searchParams ? searchParams.get("paperId") || "" : "";

  const { data: papers } = useLitmatrixResource<Paper[]>(`/api/projects/${projectId}/papers`);
  const { data: suggestions, reload: reloadSuggestions } = useLitmatrixResource<AISuggestion[]>(
    `/api/projects/${projectId}/suggestions`,
  );
  const { data: decisions, reload: reloadDecisions } = useLitmatrixResource<ReviewDecision[]>(
    `/api/projects/${projectId}/review-decisions`,
  );

  const paperList = papers ?? [];
  const paper = paperList.find((p) => p.id === activePaperId) ?? paperList[0] ?? null;
  const paperById = new Map(paperList.map((p) => [p.id, p]));

  // Filter suggestions by paperId if specified in URL
  const suggestionList = (suggestions ?? []).filter((s) => !activePaperId || s.paperId === activePaperId);

  const handlePaperChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newId = event.target.value;
    router.push(`/projects/${projectId}/review?paperId=${newId}`);
  };

  return (
    <main className="flex min-h-screen bg-background text-foreground">
      <ProjectSidebar projectId={projectId} />
      <section className="min-w-0 flex-1">
        <WorkspaceTopBar title="Review AI Suggestions" context="Academic Workspace" actionLabel="Save" />
        <div className="grid gap-6 p-6 xl:grid-cols-[minmax(0,1fr)_460px]">
          <section className="space-y-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-border/50 pb-3">
              <StageTabs
                projectId={projectId}
                active="review"
                reviewCount={(suggestions ?? []).filter((suggestion) => suggestion.status === "pending-review").length}
              />
              {paperList.length > 0 && (
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold uppercase tracking-wider text-muted">Active Paper:</span>
                  <select
                    value={paper?.id || ""}
                    onChange={handlePaperChange}
                    className="rounded border border-border/60 bg-surface px-3 py-1.5 text-sm font-semibold outline-none focus:border-foreground"
                  >
                    {paperList.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.year ? `[${p.year}] ` : ""}{p.title.length > 40 ? p.title.substring(0, 40) + "..." : p.title}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>

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
              {suggestionList.length === 0 ? (
                <div className="rounded border border-border/40 p-8 text-center bg-surface-muted">
                  <p className="text-sm text-muted font-medium">No pending suggestions for this paper.</p>
                </div>
              ) : (
                suggestionList.map((suggestion) => (
                  <SuggestionCard
                    key={suggestion.id}
                    suggestion={suggestion}
                    paper={suggestion.paperId ? paperById.get(suggestion.paperId) : undefined}
                    onChanged={() => {
                      reloadSuggestions();
                      reloadDecisions();
                    }}
                  />
                ))
              )}
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
          <PDFViewerShell paper={paper} />
        </div>
      </section>
    </main>
  );
}
