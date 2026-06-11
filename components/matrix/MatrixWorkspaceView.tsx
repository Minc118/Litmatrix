"use client";

import { useState } from "react";
import Link from "next/link";
import { ProjectSidebar } from "@/components/layout/ProjectSidebar";
import { WorkspaceTopBar } from "@/components/layout/WorkspaceTopBar";
import { ExtractionMatrixTable } from "@/components/matrix/ExtractionMatrixTable";
import { WorkflowCtaBar } from "@/components/common/WorkflowCtaBar";
import { useLitmatrixResource } from "@/lib/api/useLitmatrixResource";
import { exportToCSV, exportToMarkdown, exportToJsonBundle } from "@/lib/client/exportUtils";
import type { ExtractionMatrixRow, Paper, ProjectContract } from "@/lib/types/litmatrix";
import { Download, Filter, Database, ArrowRight, Table } from "lucide-react";

export function MatrixWorkspaceView({ projectId }: { projectId: string }) {
  const { data: papers } = useLitmatrixResource<Paper[]>(`/api/projects/${projectId}/papers`);
  const { data: rows, reload } = useLitmatrixResource<ExtractionMatrixRow[]>(
    `/api/projects/${projectId}/extraction-matrix`,
  );
  const { data: contract } = useLitmatrixResource<ProjectContract>(`/api/projects/${projectId}/contract`);

  const [selectedRowIds, setSelectedRowIds] = useState<Set<string>>(new Set());
  const [statusFilter, setStatusFilter] = useState<"all" | "confirmed" | "pending">("all");

  const matrixRows = rows ?? [];
  const paperList = papers ?? [];
  const fields = contract?.extractionFields || [];

  // Filter rows based on dropdown selection
  const filteredRows = matrixRows.filter((row) => {
    if (statusFilter === "confirmed") {
      return row.status === "accepted" || row.status === "edited";
    }
    if (statusFilter === "pending") {
      return row.status === "pending-review";
    }
    return row.status !== "rejected";
  });

  const selectedRows = matrixRows.filter((r) => selectedRowIds.has(r.id));
  const rowsToExport = selectedRows.length > 0 ? selectedRows : filteredRows;

  return (
    <main className="flex min-h-screen bg-background text-foreground">
      <ProjectSidebar projectId={projectId} />
      <section className="min-w-0 flex-1">
        <WorkspaceTopBar title="Extraction Matrix" context="Active Reviews" />
        <div className="space-y-6 p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="lm-label">Page Canvas</p>
              <h1 className="mt-2 text-3xl font-semibold tracking-tight text-foreground">Extraction Matrix</h1>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-muted">
                Confirmed extraction values are the only inputs eligible for final synthesis and gap discovery.
              </p>
            </div>
            
            {/* Export Buttons */}
            {matrixRows.length > 0 && (
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => exportToCSV(rowsToExport, paperList)}
                  className="flex items-center gap-1.5 rounded-sm border border-border bg-surface px-3 py-2 text-xs font-semibold text-foreground hover:bg-[#f8fafc]"
                >
                  <Download className="h-3.5 w-3.5" />
                  Export CSV {selectedRows.length > 0 && `(${selectedRows.length})`}
                </button>
                <button
                  onClick={() => exportToMarkdown(rowsToExport, paperList, (contract?.projectId as string) || projectId)}
                  className="flex items-center gap-1.5 rounded-sm border border-border bg-surface px-3 py-2 text-xs font-semibold text-foreground hover:bg-[#f8fafc]"
                >
                  <Download className="h-3.5 w-3.5" />
                  Export MD {selectedRows.length > 0 && `(${selectedRows.length})`}
                </button>
                <button
                  onClick={() => exportToJsonBundle(rowsToExport, paperList, contract as unknown as Record<string, unknown>)}
                  className="flex items-center gap-1.5 rounded-sm border border-border bg-surface px-3 py-2 text-xs font-semibold text-foreground hover:bg-[#f8fafc]"
                >
                  <Download className="h-3.5 w-3.5" />
                  Export JSON {selectedRows.length > 0 && `(${selectedRows.length})`}
                </button>
              </div>
            )}
          </div>

          <WorkflowCtaBar
            items={[
              { label: "Theme clustering", href: `/projects/${projectId}/themes`, primary: true },
              { label: "Gap map", href: `/projects/${projectId}/gaps` },
              { label: "Arguments", href: `/projects/${projectId}/arguments` },
            ]}
          />

          {matrixRows.length === 0 ? (
            <div className="space-y-6">
              {/* Beautiful Empty State Dashboard */}
              <div className="lm-card p-8 md:p-12 text-center max-w-3xl mx-auto space-y-6">
                <div className="mx-auto h-16 w-16 rounded-full bg-surface-muted flex items-center justify-center text-muted">
                  <Database className="h-8 w-8" />
                </div>
                <div className="space-y-2">
                  <h2 className="text-xl font-bold text-foreground">No Extraction Records Yet</h2>
                  <p className="text-sm text-muted max-w-md mx-auto leading-relaxed">
                    This workspace is schema-driven. Active fields from your contract are listed below, but no papers have been extracted yet.
                  </p>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 text-left max-w-lg mx-auto pt-4">
                  <div className="rounded border border-border/60 p-4 space-y-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-muted block">Step 1: Ingest Literature</span>
                    <p className="text-xs text-muted leading-relaxed">
                      Upload PDF papers or Zotero RDF catalogs to build your project library.
                    </p>
                    <Link
                      href={`/projects/${projectId}/papers`}
                      className="text-xs font-semibold text-[#1c7ed6] hover:underline flex items-center gap-1"
                    >
                      Go to Papers Inbox <ArrowRight className="h-3 w-3" />
                    </Link>
                  </div>

                  <div className="rounded border border-border/60 p-4 space-y-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-muted block">Step 2: Deep Extraction</span>
                    <p className="text-xs text-muted leading-relaxed">
                      Screen papers and confirm summaries in the Paper Overview gate.
                    </p>
                    <Link
                      href={`/projects/${projectId}/overview`}
                      className="text-xs font-semibold text-[#1c7ed6] hover:underline flex items-center gap-1"
                    >
                      Go to Paper Overview <ArrowRight className="h-3 w-3" />
                    </Link>
                  </div>

                  <div className="rounded border border-border/60 p-4 space-y-2 sm:col-span-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-muted block">Alternative: Import JSON Bundle</span>
                    <p className="text-xs text-muted leading-relaxed">
                      Import a compatible JSON bundle containing pre-extracted review results matching your project contract.
                    </p>
                    <Link
                      href={`/projects/${projectId}/tools/import`}
                      className="text-xs font-semibold text-[#1c7ed6] hover:underline flex items-center gap-1"
                    >
                      Open Import Console <ArrowRight className="h-3 w-3" />
                    </Link>
                  </div>
                </div>
              </div>

              {/* Dynamic Extraction Schema Fields Display */}
              <div className="lm-card p-6">
                <div className="flex items-center gap-2 mb-4 border-b border-border/40 pb-3">
                  <Table className="h-5 w-5 text-muted" />
                  <h3 className="text-sm font-bold uppercase tracking-wider text-muted">Active Extraction Schema Columns</h3>
                </div>
                {fields.length > 0 ? (
                  <div className="flex flex-wrap gap-2.5">
                    {fields.map((f) => (
                      <span key={f.key} className="rounded border border-border bg-[#f8fafc] px-3 py-1.5 text-xs text-foreground font-semibold flex items-center gap-1.5">
                        <span className="h-1.5 w-1.5 rounded-full bg-[#1f2933]" />
                        {f.label}
                        <span className="font-mono text-[10px] text-muted">({f.key})</span>
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-muted italic">Loading project extraction schema...</p>
                )}
              </div>
            </div>
          ) : (
            <>
              {/* Filtering Bar */}
              <div className="flex items-center gap-3 bg-surface p-4 border border-border/50 rounded-sm">
                <Filter className="h-4 w-4 text-muted" />
                <span className="text-xs font-bold uppercase tracking-wider text-muted">Filter:</span>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as "all" | "confirmed" | "pending")}
                  className="rounded border border-border bg-surface px-3 py-1.5 text-xs font-semibold outline-none focus:border-foreground"
                >
                  <option value="all">Show All Active Rows</option>
                  <option value="confirmed">Show Confirmed Only (Accepted/Edited)</option>
                  <option value="pending">Show Pending Review Only</option>
                </select>
                {selectedRowIds.size > 0 && (
                  <button
                    onClick={() => setSelectedRowIds(new Set())}
                    className="text-xs font-bold text-[#b30000] hover:underline ml-auto"
                  >
                    Clear Selection ({selectedRowIds.size})
                  </button>
                )}
              </div>

              <ExtractionMatrixTable
                rows={filteredRows}
                papers={paperList}
                onChanged={reload}
                selectedRowIds={selectedRowIds}
                onSelectedRowIdsChange={setSelectedRowIds}
              />
            </>
          )}
        </div>
      </section>
    </main>
  );
}
