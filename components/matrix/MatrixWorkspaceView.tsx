"use client";

import { ProjectSidebar } from "@/components/layout/ProjectSidebar";
import { WorkspaceTopBar } from "@/components/layout/WorkspaceTopBar";
import { ExtractionMatrixTable } from "@/components/matrix/ExtractionMatrixTable";
import { WorkflowCtaBar } from "@/components/common/WorkflowCtaBar";
import { useLitmatrixResource } from "@/lib/api/useLitmatrixResource";
import type { ExtractionMatrixRow, Paper } from "@/lib/types/litmatrix";

export function MatrixWorkspaceView({ projectId }: { projectId: string }) {
  const { data: papers } = useLitmatrixResource<Paper[]>(`/api/projects/${projectId}/papers`);
  const { data: rows, reload } = useLitmatrixResource<ExtractionMatrixRow[]>(
    `/api/projects/${projectId}/extraction-matrix`,
  );

  return (
    <main className="flex min-h-screen bg-background text-foreground">
      <ProjectSidebar projectId={projectId} />
      <section className="min-w-0 flex-1">
        <WorkspaceTopBar title="Extraction Matrix" context="Active Reviews" actionLabel="Export CSV" />
        <div className="space-y-6 p-6">
          <div>
            <p className="lm-label">Page Canvas</p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-foreground">Extraction Matrix</h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-muted">
              Confirmed extraction values are the only inputs eligible for final synthesis and gap discovery.
            </p>
          </div>
          <WorkflowCtaBar
            items={[
              { label: "Theme clustering", href: `/projects/${projectId}/themes`, primary: true },
              { label: "Gap map", href: `/projects/${projectId}/gaps` },
              { label: "Arguments", href: `/projects/${projectId}/arguments` },
            ]}
          />
          <ExtractionMatrixTable rows={rows ?? []} papers={papers ?? []} onChanged={reload} />
        </div>
      </section>
    </main>
  );
}
