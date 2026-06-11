"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { ProjectSidebar } from "@/components/layout/ProjectSidebar";
import { WorkspaceTopBar } from "@/components/layout/WorkspaceTopBar";
import { StageTabs } from "@/components/analysis/StageTabs";
import { AIAnalysisPanel } from "@/components/analysis/AIAnalysisPanel";
import { PDFViewerShell } from "@/components/papers/PDFViewerShell";
import { WorkflowCtaBar } from "@/components/common/WorkflowCtaBar";
import { useLitmatrixResource } from "@/lib/api/useLitmatrixResource";
import type { AISuggestion, Paper, ProjectDetail } from "@/lib/types/litmatrix";

export function AIAnalysisWorkspaceView({ projectId }: { projectId: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const activePaperId = searchParams ? searchParams.get("paperId") || "" : "";

  const { data: project } = useLitmatrixResource<ProjectDetail>(`/api/projects/${projectId}`);
  const { data: papers } = useLitmatrixResource<Paper[]>(`/api/projects/${projectId}/papers`);
  const { data: suggestions } = useLitmatrixResource<AISuggestion[]>(`/api/projects/${projectId}/suggestions`);

  const paperList = papers ?? [];
  const paper = paperList.find((p) => p.id === activePaperId) ?? paperList[0] ?? null;

  const handlePaperChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newId = event.target.value;
    router.push(`/projects/${projectId}/analysis?paperId=${newId}`);
  };

  return (
    <main className="flex min-h-screen bg-background text-foreground">
      <ProjectSidebar projectId={projectId} />
      <section className="min-w-0 flex-1">
        <WorkspaceTopBar title="AI Analysis" context="Analysis Configuration" />
        <div className="grid gap-6 p-6 xl:grid-cols-[minmax(0,1fr)_460px]">
          <section className="space-y-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-border/50 pb-3">
              <StageTabs
                projectId={projectId}
                active="analysis"
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

            <WorkflowCtaBar
              items={[{ label: "Review AI suggestions", href: `/projects/${projectId}/review${paper ? `?paperId=${paper.id}` : ""}`, primary: true }]}
            />
            <AIAnalysisPanel project={project} suggestions={suggestions ?? []} />
          </section>
          <PDFViewerShell paper={paper} />
        </div>
      </section>
    </main>
  );
}
