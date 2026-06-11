"use client";

import { useState } from "react";
import Link from "next/link";
import { ProjectSidebar } from "@/components/layout/ProjectSidebar";
import { WorkspaceTopBar } from "@/components/layout/WorkspaceTopBar";
import { UploadDropzone } from "@/components/import/UploadDropzone";
import { ImportIntegrationStatus } from "@/components/import/ImportIntegrationStatus";
import { useLitmatrixResource } from "@/lib/api/useLitmatrixResource";
import type { Paper, PaperOverview, ProviderStatusResponse } from "@/lib/types/litmatrix";
import { Check, Info, FileText, ClipboardList } from "lucide-react";

export function PaperListView({ projectId }: { projectId: string }) {
  const { data: papers } = useLitmatrixResource<Paper[]>(`/api/projects/${projectId}/papers`);
  const { data: overviews } = useLitmatrixResource<PaperOverview[]>(`/api/projects/${projectId}/overviews`);
  const { data: providerStatus } = useLitmatrixResource<ProviderStatusResponse>("/api/providers/status");

  // Keep screening decisions in localStorage (for persistent demo look & feel) or fallback to in-memory state
  const [decisions, setDecisions] = useState<Record<string, string>>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(`screening_${projectId}`);
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {
          // ignore
        }
      }
    }
    return {};
  });

  const handleScreen = (paperId: string, decision: string) => {
    const next = { ...decisions, [paperId]: decision };
    setDecisions(next);
    if (typeof window !== "undefined") {
      localStorage.setItem(`screening_${projectId}`, JSON.stringify(next));
    }
  };

  const getSourceType = (paper: Paper, overview: PaperOverview | null) => {
    if (paper.venue === "Uploaded PDF") return { label: "PDF Upload", color: "bg-blue-50 text-blue-700 border-blue-200" };
    if (paper.venue === "Zotero RDF Import") return { label: "Zotero RDF", color: "bg-purple-50 text-purple-700 border-purple-200" };
    if (overview?.analysisSource === "imported") return { label: "JSON Import", color: "bg-emerald-50 text-emerald-700 border-emerald-200" };
    return { label: "Database Seed", color: "bg-gray-50 text-gray-700 border-gray-200" };
  };

  const getStatusDetail = (overview: PaperOverview | null) => {
    if (!overview) return { label: "Pending Generation", level: "pending", color: "bg-amber-50 text-amber-700 border-amber-200" };
    if (overview.evidenceLevel === "metadata-only") return { label: "Metadata-only overview", level: "metadata-only", color: "bg-blue-50 text-blue-700 border-blue-200" };
    if (overview.evidenceLevel === "abstract-based") return { label: "Abstract-only overview", level: "abstract-based", color: "bg-amber-50 text-amber-700 border-amber-200" };
    if (overview.evidenceLevel === "full-text") return { label: "Full-text evidence available", level: "full-text", color: "bg-green-50 text-green-700 border-green-200" };
    return { label: "User notes only", level: "user-notes", color: "bg-purple-50 text-purple-700 border-purple-200" };
  };

  const getNextAction = (overview: PaperOverview | null, decision: string | undefined, paperId: string) => {
    if (decision === "Skip / Exclude") return { label: "Archived", href: null };
    if (!overview) return { label: "Run overview generation", href: `/projects/${projectId}/overview?paperId=${paperId}` };
    if (overview.evidenceLevel === "metadata-only") return { label: "Review metadata", href: `/projects/${projectId}/overview?paperId=${paperId}` };
    return { label: "Review suggestions", href: `/projects/${projectId}/review?paperId=${paperId}` };
  };

  const paperList = papers ?? [];
  const overviewList = overviews ?? [];

  return (
    <main className="flex min-h-screen bg-background text-foreground">
      <ProjectSidebar projectId={projectId} />
      <section className="min-w-0 flex-1">
        <WorkspaceTopBar title="Paper Inbox & Screening" context="Paper intake & screening decisions" />
        <div className="grid gap-6 p-6 xl:grid-cols-[minmax(0,1fr)_380px]">
          <div className="space-y-6">
            <div>
              <p className="lm-label">Literature screening</p>
              <h1 className="mt-2 text-3xl font-semibold tracking-tight text-foreground">Paper Inbox & Screening</h1>
              <p className="mt-2 text-sm leading-6 text-muted">
                Screen newly added papers, check metadata/evidence levels, and decide which studies proceed to full matrix extraction.
              </p>
            </div>

            {/* In-Memory Notice */}
            <div className="rounded border border-amber-200 bg-amber-50/40 p-4 text-xs text-amber-800 flex gap-2.5">
              <Info className="h-4.5 w-4.5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">Local Storage Screening Decisions</p>
                <p className="mt-0.5">
                  Screening status updates are saved in your local browser storage. They are not persisted to the database schema directly.
                </p>
              </div>
            </div>

            {/* Paper Inbox List */}
            <div className="space-y-4">
              {paperList.length === 0 ? (
                <div className="lm-card p-12 text-center">
                  <ClipboardList className="mx-auto h-12 w-12 text-muted opacity-40" />
                  <h3 className="mt-4 text-lg font-semibold text-foreground">No papers in inbox</h3>
                  <p className="mt-2 text-sm text-muted">
                    Upload paper PDFs, import a Zotero RDF collection, or run a compatibility JSON import to get started.
                  </p>
                </div>
              ) : (
                paperList.map((paper) => {
                  const overview = overviewList.find((o) => o.paperId === paper.id) ?? null;
                  const source = getSourceType(paper, overview);
                  const status = getStatusDetail(overview);
                  const decision = decisions[paper.id];
                  const action = getNextAction(overview, decision, paper.id);

                  return (
                    <div key={paper.id} className="lm-card p-5 space-y-4 hover:border-border transition-all">
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-xs font-mono font-medium text-muted">
                              {paper.year ?? "Year unknown"}
                            </span>
                            <span className={`rounded border px-2 py-0.5 text-[10px] font-semibold tracking-tight ${source.color}`}>
                              {source.label}
                            </span>
                            <span className={`rounded border px-2 py-0.5 text-[10px] font-semibold tracking-tight ${status.color}`}>
                              {status.label}
                            </span>
                          </div>
                          <h2 className="mt-2 text-lg font-semibold text-foreground line-clamp-1">
                            {paper.title}
                          </h2>
                          <p className="mt-1 text-xs text-muted">
                            {paper.authors && paper.authors.length > 0 ? `By ${paper.authors.join(", ")}` : "Authors unspecified"}
                          </p>
                        </div>

                        {/* Screening Action Menu */}
                        <div className="flex flex-col gap-2 shrink-0">
                          <label className="text-[10px] font-bold uppercase tracking-wider text-muted block">
                            Screening Decision
                          </label>
                          <select
                            value={decision || "Unscreened"}
                            onChange={(e) => handleScreen(paper.id, e.target.value)}
                            className="rounded border border-border/80 bg-surface px-2.5 py-1.5 text-xs font-semibold outline-none focus:border-foreground transition-colors w-40"
                          >
                            <option value="Unscreened">Unscreened</option>
                            <option value="Continue to Deep Extraction">Continue to Deep Extraction</option>
                            <option value="Mark as Core Paper">Mark as Core Paper</option>
                            <option value="Mark as Background">Mark as Background</option>
                            <option value="Review Later">Review Later</option>
                            <option value="Skip / Exclude">Skip / Exclude</option>
                          </select>
                        </div>
                      </div>

                      {/* Footer Actions */}
                      <div className="flex items-center justify-between border-t border-border/40 pt-3 flex-wrap gap-2 text-xs">
                        <div className="flex gap-2">
                          <Link
                            href={`/projects/${projectId}/overview?paperId=${paper.id}`}
                            className="text-[#1c7ed6] hover:underline font-medium flex items-center gap-1"
                          >
                            <FileText className="h-3.5 w-3.5" />
                            Open Overview
                          </Link>
                          {paper.pdfFileId && (
                            <span className="text-muted flex items-center gap-1">
                              <Check className="h-3.5 w-3.5 text-green-600" />
                              PDF Attached
                            </span>
                          )}
                        </div>

                        <div>
                          {action.href ? (
                            <Link
                              href={action.href}
                              className="rounded bg-surface border border-border px-3 py-1 font-semibold text-foreground hover:bg-[#f8fafc] transition-colors"
                            >
                              {action.label}
                            </Link>
                          ) : (
                            <span className="text-muted italic">{action.label}</span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          <aside className="space-y-4">
            <UploadDropzone compact />
            <ImportIntegrationStatus providerStatus={providerStatus} compact />
          </aside>
        </div>
      </section>
    </main>
  );
}
