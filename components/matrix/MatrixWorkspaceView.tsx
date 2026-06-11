"use client";

import { useState } from "react";
import { ProjectSidebar } from "@/components/layout/ProjectSidebar";
import { WorkspaceTopBar } from "@/components/layout/WorkspaceTopBar";
import { ExtractionMatrixTable } from "@/components/matrix/ExtractionMatrixTable";
import { WorkflowCtaBar } from "@/components/common/WorkflowCtaBar";
import { useLitmatrixResource } from "@/lib/api/useLitmatrixResource";
import { exportToCSV, exportToMarkdown, exportToJsonBundle } from "@/lib/client/exportUtils";
import type { ExtractionMatrixRow, Paper } from "@/lib/types/litmatrix";
import { Download, Filter } from "lucide-react";

export function MatrixWorkspaceView({ projectId }: { projectId: string }) {
  const { data: papers } = useLitmatrixResource<Paper[]>(`/api/projects/${projectId}/papers`);
  const { data: rows, reload } = useLitmatrixResource<ExtractionMatrixRow[]>(
    `/api/projects/${projectId}/extraction-matrix`,
  );
  const { data: contract } = useLitmatrixResource<any>(`/api/projects/${projectId}/contract`);

  const [selectedRowIds, setSelectedRowIds] = useState<Set<string>>(new Set());
  const [statusFilter, setStatusFilter] = useState<"all" | "confirmed" | "pending">("all");

  const matrixRows = rows ?? [];
  const paperList = papers ?? [];

  // Filter rows based on dropdown selection
  const filteredRows = matrixRows.filter((row) => {
    if (statusFilter === "confirmed") {
      return row.status === "accepted" || row.status === "edited";
    }
    if (statusFilter === "pending") {
      return row.status === "pending-review";
    }
    return row.status !== "rejected"; // Hide rejected rows by default
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
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => exportToCSV(rowsToExport, paperList)}
                className="flex items-center gap-1.5 rounded-sm border border-border bg-surface px-3 py-2 text-xs font-semibold text-foreground hover:bg-[#f8fafc]"
              >
                <Download className="h-3.5 w-3.5" />
                Export CSV {selectedRows.length > 0 && `(${selectedRows.length})`}
              </button>
              <button
                onClick={() => exportToMarkdown(rowsToExport, paperList, contract?.projectId || projectId)}
                className="flex items-center gap-1.5 rounded-sm border border-border bg-surface px-3 py-2 text-xs font-semibold text-foreground hover:bg-[#f8fafc]"
              >
                <Download className="h-3.5 w-3.5" />
                Export MD {selectedRows.length > 0 && `(${selectedRows.length})`}
              </button>
              <button
                onClick={() => exportToJsonBundle(rowsToExport, paperList, contract)}
                className="flex items-center gap-1.5 rounded-sm border border-border bg-surface px-3 py-2 text-xs font-semibold text-foreground hover:bg-[#f8fafc]"
              >
                <Download className="h-3.5 w-3.5" />
                Export JSON {selectedRows.length > 0 && `(${selectedRows.length})`}
              </button>
            </div>
          </div>

          <WorkflowCtaBar
            items={[
              { label: "Theme clustering", href: `/projects/${projectId}/themes`, primary: true },
              { label: "Gap map", href: `/projects/${projectId}/gaps` },
              { label: "Arguments", href: `/projects/${projectId}/arguments` },
            ]}
          />

          {/* Filtering Bar */}
          <div className="flex items-center gap-3 bg-surface p-4 border border-border/50 rounded-sm">
            <Filter className="h-4 w-4 text-muted" />
            <span className="text-xs font-bold uppercase tracking-wider text-muted">Filter:</span>
            <select
              value={statusFilter}
              onChange={(e: any) => setStatusFilter(e.target.value)}
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
        </div>
      </section>
    </main>
  );
}
