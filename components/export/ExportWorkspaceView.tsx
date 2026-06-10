"use client";

import { Download } from "lucide-react";
import { ProjectSidebar } from "@/components/layout/ProjectSidebar";
import { WorkspaceTopBar } from "@/components/layout/WorkspaceTopBar";
import { InertActionBadge } from "@/components/common/InertActionBadge";
import { useLitmatrixResource } from "@/lib/api/useLitmatrixResource";
import type { ExtractionMatrixRow } from "@/lib/types/litmatrix";

export function ExportWorkspaceView({ projectId }: { projectId: string }) {
  const { data: rows } = useLitmatrixResource<ExtractionMatrixRow[]>(`/api/projects/${projectId}/extraction-matrix`);

  return (
    <main className="flex min-h-screen bg-background text-foreground">
      <ProjectSidebar projectId={projectId} />
      <section className="min-w-0 flex-1">
        <WorkspaceTopBar title="Export Workspace" context="Project Tools" />
        <div className="space-y-6 p-6">
          <div>
            <p className="lm-label">Export</p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-foreground">Export Workspace</h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-muted">
              Export controls are static in this phase. Future routes will produce Markdown, CSV, and JSON.
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {["Markdown", "CSV", "JSON"].map((format) => (
              <article key={format} className="lm-card p-6">
                <div className="mb-5 flex h-11 w-11 items-center justify-center rounded bg-surface-muted text-foreground">
                  <Download className="h-5 w-5" aria-hidden="true" />
                </div>
                <h2 className="text-lg font-semibold text-foreground">{format}</h2>
                <p className="mt-2 text-sm leading-6 text-muted">
                  Prepared export format for {rows?.length ?? 0} matrix rows.
                </p>
                <button className="mt-5 inline-flex items-center gap-2 rounded-sm border border-border bg-surface px-4 py-2 text-sm text-muted" disabled>
                  Export {format}
                  <InertActionBadge label="Coming soon" />
                </button>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
