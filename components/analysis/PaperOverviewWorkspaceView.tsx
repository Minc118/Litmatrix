"use client";

import { ProjectSidebar } from "@/components/layout/ProjectSidebar";
import { WorkspaceTopBar } from "@/components/layout/WorkspaceTopBar";
import { StageTabs } from "@/components/analysis/StageTabs";
import { PaperOverviewPanel } from "@/components/analysis/PaperOverviewPanel";
import { PDFViewerShell } from "@/components/papers/PDFViewerShell";
import { useLitmatrixResource } from "@/lib/api/useLitmatrixResource";
import type { AISuggestion, Paper, PaperOverview } from "@/lib/types/litmatrix";

export function PaperOverviewWorkspaceView({ projectId }: { projectId: string }) {
  const { data: papers } = useLitmatrixResource<Paper[]>(`/api/projects/${projectId}/papers`);
  const { data: overviews } = useLitmatrixResource<PaperOverview[]>(`/api/projects/${projectId}/overviews`);
  const { data: suggestions } = useLitmatrixResource<AISuggestion[]>(`/api/projects/${projectId}/suggestions`);
  const paper = (papers ?? [])[0] ?? null;
  const overview = (overviews ?? []).find((item) => item.paperId === paper?.id) ?? (overviews ?? [])[0] ?? null;

  return (
    <main className="flex min-h-screen bg-background text-foreground">
      <ProjectSidebar projectId={projectId} />
      <section className="min-w-0 flex-1">
        <WorkspaceTopBar title="Paper Overview" context="Status: Overview Generated" />
        <div className="grid gap-6 p-6 xl:grid-cols-[minmax(0,1fr)_460px]">
          <section className="space-y-6">
            <StageTabs
              projectId={projectId}
              active="overview"
              reviewCount={(suggestions ?? []).filter((suggestion) => suggestion.status === "pending-review").length}
            />
            <PaperOverviewPanel overview={overview} paper={paper} />
          </section>
          <PDFViewerShell paper={paper} />
        </div>
      </section>
    </main>
  );
}
