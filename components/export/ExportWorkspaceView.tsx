"use client";

import { Download } from "lucide-react";
import { ProjectSidebar } from "@/components/layout/ProjectSidebar";
import { WorkspaceTopBar } from "@/components/layout/WorkspaceTopBar";
import { useLitmatrixResource } from "@/lib/api/useLitmatrixResource";
import { exportToCSV, exportToMarkdown, exportToJsonBundle } from "@/lib/client/exportUtils";
import type { ExtractionMatrixRow, Paper } from "@/lib/types/litmatrix";

export function ExportWorkspaceView({ projectId }: { projectId: string }) {
  const { data: rows } = useLitmatrixResource<ExtractionMatrixRow[]>(`/api/projects/${projectId}/extraction-matrix`);
  const { data: papers } = useLitmatrixResource<Paper[]>(`/api/projects/${projectId}/papers`);
  const { data: contract } = useLitmatrixResource<any>(`/api/projects/${projectId}/contract`);

  const matrixRows = rows ?? [];
  const paperList = papers ?? [];

  const handleExport = (format: "Markdown" | "CSV" | "JSON") => {
    if (format === "CSV") {
      exportToCSV(matrixRows, paperList);
    } else if (format === "Markdown") {
      exportToMarkdown(matrixRows, paperList, contract?.projectId || projectId);
    } else if (format === "JSON") {
      exportToJsonBundle(matrixRows, paperList, contract);
    }
  };

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
              Download your verified review matrix and writing outlines for survey or seminar paper composition.
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {(["Markdown", "CSV", "JSON"] as const).map((format) => (
              <article key={format} className="lm-card p-6 flex flex-col justify-between">
                <div>
                  <div className="mb-5 flex h-11 w-11 items-center justify-center rounded bg-surface-muted text-foreground">
                    <Download className="h-5 w-5" aria-hidden="true" />
                  </div>
                  <h2 className="text-lg font-semibold text-foreground">{format}</h2>
                  <p className="mt-2 text-sm leading-6 text-muted">
                    Prepared export format for {matrixRows.length} matrix rows.
                  </p>
                </div>
                <button
                  onClick={() => handleExport(format)}
                  disabled={matrixRows.length === 0}
                  className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-sm border border-border bg-[#1f2933] text-white px-4 py-2.5 text-sm font-semibold hover:bg-[#2b3642] disabled:opacity-60 disabled:bg-surface disabled:text-muted"
                >
                  Export {format}
                </button>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
