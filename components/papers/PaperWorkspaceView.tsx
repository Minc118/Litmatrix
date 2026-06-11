"use client";

import { ProjectSidebar } from "@/components/layout/ProjectSidebar";
import { WorkspaceTopBar } from "@/components/layout/WorkspaceTopBar";
import { PDFViewerShell } from "@/components/papers/PDFViewerShell";
import { SuggestionCard } from "@/components/review/SuggestionCard";
import { StageTabs } from "@/components/analysis/StageTabs";
import { WorkflowCtaBar } from "@/components/common/WorkflowCtaBar";
import { useLitmatrixResource } from "@/lib/api/useLitmatrixResource";
import type { AISuggestion, Paper } from "@/lib/types/litmatrix";

export function PaperWorkspaceView({
  projectId,
  paperId,
}: {
  projectId: string;
  paperId: string;
}) {
  const { data: papers } = useLitmatrixResource<Paper[]>(`/api/projects/${projectId}/papers`);
  const { data: suggestions, reload: reloadSuggestions } = useLitmatrixResource<AISuggestion[]>(
    `/api/projects/${projectId}/suggestions?paperId=${paperId}`,
  );
  const paper = (papers ?? []).find((item) => item.id === paperId) ?? null;
  const suggestionList = suggestions ?? [];

  return (
    <main className="flex min-h-screen bg-background text-foreground">
      <ProjectSidebar projectId={projectId} />
      <section className="min-w-0 flex-1">
        <WorkspaceTopBar title={paper?.title ?? "Paper Workspace"} context="Deep Analysis Complete" actionLabel="Export" />
        <div className="grid gap-6 p-6 xl:grid-cols-[minmax(0,1fr)_460px]">
          <section className="space-y-6">
            <StageTabs
              projectId={projectId}
              active="review"
              reviewCount={suggestionList.filter((suggestion) => suggestion.status === "pending-review").length}
            />
            <WorkflowCtaBar
              items={[
                { label: "Overview", href: `/projects/${projectId}/overview`, primary: true },
                { label: "AI analysis", href: `/projects/${projectId}/analysis` },
                { label: "Review", href: `/projects/${projectId}/review` },
                { label: "Matrix", href: `/projects/${projectId}/matrix` },
              ]}
            />
            <div>
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <p className="lm-label">Review Content</p>
                  <h1 className="mt-1 text-2xl font-semibold text-foreground">AI-linked paper workspace</h1>
                </div>
                <span className="rounded-sm bg-surface-muted px-2 py-1 text-xs font-semibold text-muted">
                  {suggestionList.length} Suggestions
                </span>
              </div>
              <div className="space-y-4">
                {suggestionList.map((suggestion) => (
                  <SuggestionCard
                    key={suggestion.id}
                    suggestion={suggestion}
                    paper={paper ?? undefined}
                    onChanged={reloadSuggestions}
                  />
                ))}
              </div>
            </div>
          </section>
          <PDFViewerShell paper={paper} />
        </div>
      </section>
    </main>
  );
}
