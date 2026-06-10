"use client";

import { ProjectSidebar } from "@/components/layout/ProjectSidebar";
import { WorkspaceTopBar } from "@/components/layout/WorkspaceTopBar";
import { ProjectToolsGrid } from "@/components/project/ProjectToolsGrid";
import { useLitmatrixResource } from "@/lib/api/useLitmatrixResource";
import type { ProviderStatusResponse } from "@/lib/types/litmatrix";

export function ProjectToolsDashboardView({ projectId }: { projectId: string }) {
  const { data: providerStatus } = useLitmatrixResource<ProviderStatusResponse>("/api/providers/status");

  return (
    <main className="flex min-h-screen bg-background text-foreground">
      <ProjectSidebar projectId={projectId} />
      <section className="min-w-0 flex-1">
        <WorkspaceTopBar title="Project Tools" context="LitMatrix" />
        <div className="space-y-6 p-6">
          <div>
            <p className="lm-label">Canvas</p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-foreground">Project Tools</h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-muted">
              Utilities for assessing quality, exploring citations, comparing evidence, and exporting workspaces.
            </p>
          </div>
          <ProjectToolsGrid projectId={projectId} providerStatus={providerStatus} />
        </div>
      </section>
    </main>
  );
}
