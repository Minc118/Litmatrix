"use client";

import Link from "next/link";
import { ProjectSidebar } from "@/components/layout/ProjectSidebar";
import { WorkspaceTopBar } from "@/components/layout/WorkspaceTopBar";
import { UploadDropzone } from "@/components/import/UploadDropzone";
import { useLitmatrixResource } from "@/lib/api/useLitmatrixResource";
import type { Paper } from "@/lib/types/litmatrix";

export function PaperListView({ projectId }: { projectId: string }) {
  const { data: papers } = useLitmatrixResource<Paper[]>(`/api/projects/${projectId}/papers`);

  return (
    <main className="flex min-h-screen bg-background text-foreground">
      <ProjectSidebar projectId={projectId} />
      <section className="min-w-0 flex-1">
        <WorkspaceTopBar title="Paper Library" context="Project papers" />
        <div className="grid gap-6 p-6 xl:grid-cols-[minmax(0,1fr)_380px]">
          <section className="space-y-4">
            {(papers ?? []).map((paper) => (
              <Link key={paper.id} href={`/projects/${projectId}/papers/${paper.id}`} className="lm-card block p-5 hover:bg-[#f8fafc]">
                <p className="lm-label">{paper.year ?? "Year unknown"}</p>
                <h2 className="mt-2 text-lg font-semibold text-foreground">{paper.title}</h2>
                <p className="mt-2 text-sm leading-6 text-muted">{paper.abstract}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {(paper.tags ?? []).map((tag) => (
                    <span key={tag} className="rounded-sm border border-border bg-surface-muted px-2 py-1 text-xs text-muted">
                      {tag}
                    </span>
                  ))}
                </div>
              </Link>
            ))}
          </section>
          <UploadDropzone compact />
        </div>
      </section>
    </main>
  );
}
