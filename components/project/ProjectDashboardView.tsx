"use client";

import Link from "next/link";
import { ProjectSidebar } from "@/components/layout/ProjectSidebar";
import { WorkspaceTopBar } from "@/components/layout/WorkspaceTopBar";
import { UploadDropzone } from "@/components/import/UploadDropzone";
import { ProjectHeader } from "@/components/project/ProjectHeader";
import { LoadingPanel } from "@/components/common/LoadingPanel";
import { useLitmatrixResource } from "@/lib/api/useLitmatrixResource";
import type { AISuggestion, ExtractionMatrixRow, Paper, ProjectDetail } from "@/lib/types/litmatrix";

export function ProjectDashboardView({ projectId }: { projectId: string }) {
  const { data: project, loading } = useLitmatrixResource<ProjectDetail>(`/api/projects/${projectId}`);
  const { data: papers } = useLitmatrixResource<Paper[]>(`/api/projects/${projectId}/papers`);
  const { data: suggestions } = useLitmatrixResource<AISuggestion[]>(`/api/projects/${projectId}/suggestions`);
  const { data: matrixRows } = useLitmatrixResource<ExtractionMatrixRow[]>(
    `/api/projects/${projectId}/extraction-matrix`,
  );

  const paperList = papers ?? [];
  const suggestionList = suggestions ?? [];
  const matrix = matrixRows ?? [];

  return (
    <main className="flex min-h-screen bg-background text-foreground">
      <ProjectSidebar projectId={projectId} />
      <section className="min-w-0 flex-1">
        <WorkspaceTopBar title="Project Workspace" context="OCPM Survey" />
        <div className="space-y-8 p-6">
          {loading ? (
            <LoadingPanel />
          ) : (
            <ProjectHeader project={project} papers={paperList} suggestions={suggestionList} matrixRows={matrix} />
          )}
          <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_420px]">
            <UploadDropzone compact />
            <section className="lm-card p-6">
              <p className="lm-label">Research Questions</p>
              <div className="mt-4 space-y-4">
                {(project?.researchQuestions ?? []).map((question) => (
                  <div key={question.id} className="rounded border border-border/50 bg-[#f8fafc] p-4">
                    <p className="text-sm font-semibold text-foreground">{question.text}</p>
                    <p className="mt-2 text-sm leading-6 text-muted">{question.rationale}</p>
                  </div>
                ))}
              </div>
            </section>
          </div>
          <section className="lm-card p-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="lm-label">Extraction Matrix Preview</p>
                <h2 className="mt-1 text-lg font-semibold text-foreground">Confirmed values ready for synthesis</h2>
              </div>
              <Link
                href={`/projects/${projectId}/matrix`}
                className="rounded-sm bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
              >
                Open Matrix
              </Link>
            </div>
            <div className="mt-5 grid gap-3 md:grid-cols-3">
              {matrix.slice(0, 3).map((row) => (
                <div key={row.id} className="rounded border border-border/50 bg-[#f8fafc] p-4">
                  <p className="lm-label">{row.fieldLabel}</p>
                  <p className="mt-2 text-sm leading-6 text-foreground">{row.confirmedValue ?? "Not confirmed"}</p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </section>
    </main>
  );
}
