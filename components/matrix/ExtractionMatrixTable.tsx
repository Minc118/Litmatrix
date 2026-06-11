"use client";

import { useState } from "react";
import type { ExtractionMatrixRow, Paper } from "@/lib/types/litmatrix";
import { ConfidenceBadge, EvidenceLevelBadge, ReviewStatusBadge, SourceBadge } from "@/components/common/StatusBadges";
import { litmatrixClient } from "@/lib/api/litmatrixClient";
import { ChevronDown, ChevronUp, Eye, CheckSquare, Square } from "lucide-react";

export function ExtractionMatrixTable({
  rows,
  papers,
  onChanged,
  selectedRowIds,
  onSelectedRowIdsChange,
}: {
  rows: ExtractionMatrixRow[];
  papers: Paper[];
  onChanged?: () => void;
  selectedRowIds: Set<string>;
  onSelectedRowIdsChange: (ids: Set<string>) => void;
}) {
  const [drafts, setDrafts] = useState<Record<string, string>>({});
  const [savingRowId, setSavingRowId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [expandedRowIds, setExpandedRowIds] = useState<Set<string>>(new Set());

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

  const toggleExpand = (rowId: string) => {
    const next = new Set(expandedRowIds);
    if (next.has(rowId)) {
      next.delete(rowId);
    } else {
      next.add(rowId);
    }
    setExpandedRowIds(next);
  };

  const toggleSelect = (rowId: string) => {
    const next = new Set(selectedRowIds);
    if (next.has(rowId)) {
      next.delete(rowId);
    } else {
      next.add(rowId);
    }
    onSelectedRowIdsChange(next);
  };

  const toggleSelectAll = () => {
    if (selectedRowIds.size === rows.length) {
      onSelectedRowIdsChange(new Set());
    } else {
      onSelectedRowIdsChange(new Set(rows.map((r) => r.id)));
    }
  };

  const allSelected = rows.length > 0 && selectedRowIds.size === rows.length;

  return (
    <div className="lm-panel overflow-hidden bg-surface">
      <div className="flex flex-col gap-3 border-b border-border/50 bg-[#f8fafc] p-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="lm-label">Extraction Matrix</p>
          <h2 className="mt-1 text-xl font-semibold text-foreground">Evidence-backed review matrix</h2>
        </div>
        <div className="flex flex-wrap gap-2 items-center">
          <span className="text-xs font-semibold text-muted bg-surface px-2.5 py-1 border border-border rounded-sm">
            {selectedRowIds.size} selected for export/commands
          </span>
        </div>
      </div>
      <div className="overflow-x-auto">
        {error ? <p className="border-b border-border/40 px-4 py-3 text-sm text-danger">{error}</p> : null}
        <table className="min-w-[1000px] border-collapse text-left text-sm">
          <thead className="bg-[#f8fafc] text-xs uppercase tracking-wide text-muted">
            <tr>
              <th className="border-b border-r border-border/50 px-4 py-3 w-12 text-center">
                <button onClick={toggleSelectAll} className="focus:outline-none text-muted hover:text-foreground">
                  {allSelected ? <CheckSquare className="h-4 w-4" /> : <Square className="h-4 w-4" />}
                </button>
              </th>
              <th className="border-b border-r border-border/50 px-4 py-3 w-1/4">Paper</th>
              <th className="border-b border-r border-border/50 px-4 py-3 w-1/6">Field</th>
              <th className="border-b border-r border-border/50 px-4 py-3 w-1/3">Confirmed Value (Editable)</th>
              <th className="border-b border-border/50 px-4 py-3">Provenance / Evidence</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => {
              const isExpanded = expandedRowIds.has(row.id);
              const isSelected = selectedRowIds.has(row.id);
              const paperTitle = paperTitleById.get(row.paperId) ?? row.paperId;

              return (
                <optgroup key={row.id} label="" className="contents">
                  <tr className={`align-top hover:bg-[#fcfdfe]/50 ${isSelected ? "bg-[#f4f7fa]/30" : ""}`}>
                    {/* Checkbox */}
                    <td className="border-b border-r border-border/40 px-4 py-4 text-center">
                      <button onClick={() => toggleSelect(row.id)} className="focus:outline-none text-muted hover:text-foreground">
                        {isSelected ? <CheckSquare className="h-4 w-4 text-[#1f2933]" /> : <Square className="h-4 w-4" />}
                      </button>
                    </td>

                    {/* Paper */}
                    <td className="border-b border-r border-border/40 px-4 py-4 font-medium text-foreground">
                      {paperTitle}
                    </td>

                    {/* Field */}
                    <td className="border-b border-r border-border/40 px-4 py-4 font-semibold text-foreground">
                      {row.fieldLabel}
                    </td>

                    {/* Confirmed Value */}
                    <td className="border-b border-r border-border/40 px-4 py-4">
                      <div className="space-y-2">
                        <textarea
                          className="min-h-16 w-full resize-y rounded border border-border/50 bg-surface px-3 py-2 text-sm leading-6 outline-none focus:border-foreground"
                          value={drafts[row.id] ?? row.confirmedValue ?? ""}
                          onChange={(event) =>
                            setDrafts((current) => ({
                              ...current,
                              [row.id]: event.target.value,
                            }))
                          }
                          placeholder={row.suggestedValue || "Not confirmed"}
                        />
                        <button
                          className="rounded-sm border border-border bg-surface px-3 py-1.5 text-xs font-semibold text-muted hover:text-foreground disabled:opacity-60 hover:bg-[#f8fafc]"
                          disabled={savingRowId === row.id}
                          onClick={() => void saveRow(row)}
                        >
                          {savingRowId === row.id ? "Saving..." : "Save"}
                        </button>
                      </div>
                    </td>

                    {/* Provenance and Details trigger */}
                    <td className="border-b border-border/40 px-4 py-4 space-y-3">
                      <div className="flex flex-wrap gap-2">
                        <SourceBadge source={row.analysisSource} />
                        <EvidenceLevelBadge level={row.evidenceLevel} />
                        <ConfidenceBadge confidence={row.confidence} />
                        <ReviewStatusBadge status={row.status} />
                      </div>
                      <div>
                        <button
                          onClick={() => toggleExpand(row.id)}
                          className="flex items-center gap-1.5 rounded-sm border border-border bg-surface px-2.5 py-1.5 text-xs font-semibold text-muted hover:text-foreground hover:bg-[#f8fafc]"
                        >
                          <Eye className="h-3.5 w-3.5" />
                          {isExpanded ? "Hide Evidence" : "Inspect Evidence"}
                          {isExpanded ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
                        </button>
                      </div>
                    </td>
                  </tr>

                  {/* Expanded evidence row */}
                  {isExpanded && (
                    <tr className="bg-[#f8fafc]">
                      <td colSpan={5} className="border-b border-border/40 p-5">
                        <div className="lm-panel bg-surface p-5 border border-border/60 space-y-4 rounded-sm">
                          <div>
                            <h4 className="text-xs font-bold uppercase tracking-wider text-muted">AI Suggested Extraction</h4>
                            <p className="mt-1 text-sm leading-6 text-foreground font-medium bg-[#f8fafc] border border-border/40 rounded px-3 py-2">
                              {row.suggestedValue || "Not specified."}
                            </p>
                          </div>

                          <div>
                            <h4 className="text-xs font-bold uppercase tracking-wider text-muted">Evidence Cite Basis</h4>
                            {row.evidence && row.evidence.length > 0 ? (
                              <div className="space-y-3 mt-1.5">
                                {row.evidence.map((ev, index) => (
                                  <div key={index} className="border-l-4 border-[#1f2933] pl-3 py-1 bg-[#fcfdfe] rounded-r border border-border/40 border-l-0">
                                    {ev.quote ? (
                                      <p className="text-sm italic leading-relaxed text-foreground">"{ev.quote}"</p>
                                    ) : (
                                      <p className="text-sm italic text-muted">No quote details in citation.</p>
                                    )}
                                    <div className="mt-1.5 flex gap-3 text-xs text-muted font-medium">
                                      {ev.sourceField && <span>Source Field: <code className="bg-surface-muted px-1 rounded">{ev.sourceField}</code></span>}
                                      {ev.page && <span>Page: <code className="bg-surface-muted px-1 rounded">{ev.page}</code></span>}
                                      {ev.section && <span>Section: <code className="bg-surface-muted px-1 rounded">{ev.section}</code></span>}
                                      {ev.note && <span className="text-foreground">Note: {ev.note}</span>}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <p className="mt-1 text-xs text-muted">No evidence quotes available for this record.</p>
                            )}
                          </div>

                          <div className="grid gap-4 sm:grid-cols-3 pt-2 border-t border-border/40">
                            <div>
                              <span className="text-xs font-bold uppercase text-muted block">Confidence Level</span>
                              <span className="text-sm font-semibold capitalize text-foreground">{row.confidence}</span>
                            </div>
                            <div>
                              <span className="text-xs font-bold uppercase text-muted block">Evidence Level</span>
                              <span className="text-sm font-semibold capitalize text-foreground">{row.evidenceLevel}</span>
                            </div>
                            <div>
                              <span className="text-xs font-bold uppercase text-muted block">Review Status</span>
                              <span className="text-sm font-semibold capitalize text-foreground">{row.status}</span>
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </optgroup>
              );
            })}
            {rows.length === 0 && (
              <tr>
                <td colSpan={5} className="p-8 text-center text-muted font-medium bg-surface-muted">
                  No extraction matrix records match current filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
