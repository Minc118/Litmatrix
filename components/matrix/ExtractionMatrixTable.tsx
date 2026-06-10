"use client";

import { useState } from "react";
import type { ExtractionMatrixRow, Paper } from "@/lib/types/litmatrix";
import { ConfidenceBadge, EvidenceLevelBadge, ReviewStatusBadge, SourceBadge } from "@/components/common/StatusBadges";
import { litmatrixClient } from "@/lib/api/litmatrixClient";

export function ExtractionMatrixTable({
  rows,
  papers,
  onChanged,
}: {
  rows: ExtractionMatrixRow[];
  papers: Paper[];
  onChanged?: () => void;
}) {
  const [drafts, setDrafts] = useState<Record<string, string>>({});
  const [savingRowId, setSavingRowId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const paperTitleById = new Map(papers.map((paper) => [paper.id, paper.title]));

  async function saveRow(row: ExtractionMatrixRow) {
    setError(null);
    setSavingRowId(row.id);
    try {
      const nextValue = drafts[row.id] ?? row.confirmedValue ?? "";
      await litmatrixClient.updateExtractionMatrixRow(row.id, nextValue.trim() || null);
      onChanged?.();
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Unable to update matrix row.");
    } finally {
      setSavingRowId(null);
    }
  }

  return (
    <div className="lm-panel overflow-hidden">
      <div className="flex flex-col gap-3 border-b border-border/50 bg-[#f8fafc] p-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="lm-label">Extraction Matrix</p>
          <h2 className="mt-1 text-xl font-semibold text-foreground">Confirmed extraction workspace</h2>
        </div>
        <div className="flex flex-wrap gap-2">
          {["Project: OCPM", "Status: Synthesis Ready", "Evidence: Mixed"].map((filter) => (
            <span key={filter} className="rounded-sm border border-border bg-surface px-3 py-2 text-xs text-muted">
              {filter}
            </span>
          ))}
        </div>
      </div>
      <div className="overflow-x-auto">
        {error ? <p className="border-b border-border/40 px-4 py-3 text-sm text-danger">{error}</p> : null}
        <table className="min-w-[1000px] border-collapse text-left text-sm">
          <thead className="bg-[#f8fafc] text-xs uppercase tracking-wide text-muted">
            <tr>
              <th className="border-b border-r border-border/50 px-4 py-3">Paper</th>
              <th className="border-b border-r border-border/50 px-4 py-3">Field</th>
              <th className="border-b border-r border-border/50 px-4 py-3">Suggested Value</th>
              <th className="border-b border-r border-border/50 px-4 py-3">Confirmed Value</th>
              <th className="border-b border-border/50 px-4 py-3">Provenance</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id} className="align-top">
                <td className="border-b border-r border-border/40 px-4 py-4 font-medium text-foreground">
                  {paperTitleById.get(row.paperId) ?? row.paperId}
                </td>
                <td className="border-b border-r border-border/40 px-4 py-4 text-foreground">{row.fieldLabel}</td>
                <td className="border-b border-r border-border/40 px-4 py-4 text-muted">{row.suggestedValue ?? "Not specified"}</td>
                <td className="border-b border-r border-border/40 px-4 py-4 text-foreground">
                  <div className="space-y-2">
                    <textarea
                      className="min-h-20 w-full resize-y rounded border border-border/50 bg-surface px-3 py-2 text-sm leading-5 outline-none focus:border-foreground"
                      value={drafts[row.id] ?? row.confirmedValue ?? ""}
                      onChange={(event) =>
                        setDrafts((current) => ({
                          ...current,
                          [row.id]: event.target.value,
                        }))
                      }
                      placeholder="Not confirmed"
                    />
                    <button
                      className="rounded-sm border border-border bg-surface px-2.5 py-1.5 text-xs font-medium text-muted hover:text-foreground disabled:opacity-60"
                      disabled={savingRowId === row.id}
                      onClick={() => void saveRow(row)}
                    >
                      {savingRowId === row.id ? "Saving" : "Save"}
                    </button>
                  </div>
                </td>
                <td className="border-b border-border/40 px-4 py-4">
                  <div className="flex flex-wrap gap-2">
                    <SourceBadge source={row.analysisSource} />
                    <EvidenceLevelBadge level={row.evidenceLevel} />
                    <ConfidenceBadge confidence={row.confidence} />
                    <ReviewStatusBadge status={row.status} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
