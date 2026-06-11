"use client";

import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { ProjectSidebar } from "@/components/layout/ProjectSidebar";
import { WorkspaceTopBar } from "@/components/layout/WorkspaceTopBar";
import { StageTabs } from "@/components/analysis/StageTabs";
import { PaperOverviewPanel } from "@/components/analysis/PaperOverviewPanel";
import { PDFViewerShell } from "@/components/papers/PDFViewerShell";
import { WorkflowCtaBar } from "@/components/common/WorkflowCtaBar";
import { useLitmatrixResource } from "@/lib/api/useLitmatrixResource";
import type { AISuggestion, Paper, PaperOverview } from "@/lib/types/litmatrix";

export function PaperOverviewWorkspaceView({ projectId }: { projectId: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const activePaperId = searchParams ? searchParams.get("paperId") || "" : "";

  const { data: papers } = useLitmatrixResource<Paper[]>(`/api/projects/${projectId}/papers`);
  const { data: overviews } = useLitmatrixResource<PaperOverview[]>(`/api/projects/${projectId}/overviews`);
  const { data: suggestions } = useLitmatrixResource<AISuggestion[]>(`/api/projects/${projectId}/suggestions`);

  const paperList = papers ?? [];
  const paper = paperList.find((p) => p.id === activePaperId) ?? paperList[0] ?? null;
  const overview = (overviews ?? []).find((item) => item.paperId === paper?.id) ?? null;

  const [screeningStatus, setScreeningStatus] = useState<string | null>(null);

  const handlePaperChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newId = event.target.value;
    router.push(`/projects/${projectId}/overview?paperId=${newId}`);
  };

  return (
    <main className="flex min-h-screen bg-background text-foreground">
      <ProjectSidebar projectId={projectId} />
      <section className="min-w-0 flex-1">
        <WorkspaceTopBar title="Paper Overview" context="Status: Overview Generated" />
        <div className="grid gap-6 p-6 xl:grid-cols-[minmax(0,1fr)_460px]">
          <section className="space-y-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-border/50 pb-3">
              <StageTabs
                projectId={projectId}
                active="overview"
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
              items={[
                { label: "Run analysis", href: `/projects/${projectId}/analysis${paper ? `?paperId=${paper.id}` : ""}`, primary: true },
                { label: "Review suggestions", href: `/projects/${projectId}/review${paper ? `?paperId=${paper.id}` : ""}` },
              ]}
            />

            <PaperOverviewPanel overview={overview} paper={paper} />

            {/* Screening Decision Gate Card */}
            {paper && (
              <div className="lm-card p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-muted">Screening Decision Gate</h3>
                  {screeningStatus && (
                    <span className="rounded bg-success/15 px-2.5 py-1 text-xs font-semibold text-success border border-success/30">
                      Status: {screeningStatus}
                    </span>
                  )}
                </div>
                <div className="flex flex-wrap gap-2">
                  {[
                    { label: "Continue to Deep Extraction", primary: true },
                    { label: "Mark as Core Paper" },
                    { label: "Mark as Background" },
                    { label: "Review Later" },
                    { label: "Skip / Exclude" },
                  ].map((btn) => (
                    <button
                      key={btn.label}
                      onClick={() => setScreeningStatus(btn.label)}
                      className={`rounded-sm px-3.5 py-2 text-xs font-semibold border transition-all ${
                        btn.primary
                          ? "bg-[#1f2933] border-[#1f2933] text-white hover:bg-[#2b3642]"
                          : "bg-surface border-border text-foreground hover:bg-[#f8fafc]"
                      }`}
                    >
                      {btn.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </section>
          <PDFViewerShell paper={paper} />
        </div>
      </section>
    </main>
  );
}
