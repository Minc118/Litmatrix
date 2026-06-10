"use client";

import { ProjectSidebar } from "@/components/layout/ProjectSidebar";
import { WorkspaceTopBar } from "@/components/layout/WorkspaceTopBar";
import { StageTabs } from "@/components/analysis/StageTabs";
import { AIAnalysisPanel } from "@/components/analysis/AIAnalysisPanel";
import { PDFViewerShell } from "@/components/papers/PDFViewerShell";
import { WorkflowCtaBar } from "@/components/common/WorkflowCtaBar";
import { useLitmatrixResource } from "@/lib/api/useLitmatrixResource";
import type { AISuggestion, Paper, ProjectDetail } from "@/lib/types/litmatrix";

export function AIAnalysisWorkspaceView({ projectId }: { projectId: string }) {
  const { data: project } = useLitmatrixResource<ProjectDetail>(`/api/projects/${projectId}`);
  const { data: papers } = useLitmatrixResource<Paper[]>(`/api/projects/${projectId}/papers`);
  const { data: suggestions } = useLitmatrixResource<AISuggestion[]>(`/api/projects/${projectId}/suggestions`);

  return (
    <main className="flex min-h-screen bg-background text-foreground">
      <ProjectSidebar projectId={projectId} />
      <section className="min-w-0 flex-1">
        <WorkspaceTopBar title="AI Analysis" context="Analysis Configuration" />
        <div className="grid gap-6 p-6 xl:grid-cols-[minmax(0,1fr)_460px]">
          <section className="space-y-6">
            <StageTabs
              projectId={projectId}
              active="analysis"
              reviewCount={(suggestions ?? []).filter((suggestion) => suggestion.status === "pending-review").length}
            />
            <WorkflowCtaBar
              items={[{ label: "Review AI suggestions", href: `/projects/${projectId}/review`, primary: true }]}
            />
            <AIAnalysisPanel project={project} suggestions={suggestions ?? []} />
          </section>
          <PDFViewerShell paper={(papers ?? [])[0] ?? null} />
        </div>
      </section>
    </main>
  );
}
