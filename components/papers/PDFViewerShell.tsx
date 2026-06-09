import { Search, ZoomIn, ZoomOut } from "lucide-react";
import type { Paper } from "@/lib/types/litmatrix";

export function PDFViewerShell({ paper }: { paper?: Paper | null }) {
  return (
    <aside className="lm-panel flex min-h-[640px] flex-col overflow-hidden">
      <div className="flex items-center justify-between border-b border-border/50 bg-[#f8fafc] px-4 py-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-muted">PDF viewer</p>
          <p className="max-w-64 truncate text-sm font-semibold text-foreground">{paper?.title ?? "Demo PDF canvas"}</p>
        </div>
        <div className="flex items-center gap-2 text-muted">
          <button className="rounded-sm border border-border/50 bg-surface p-2" disabled aria-label="Zoom out">
            <ZoomOut className="h-4 w-4" aria-hidden="true" />
          </button>
          <button className="rounded-sm border border-border/50 bg-surface p-2" disabled aria-label="Zoom in">
            <ZoomIn className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      </div>
      <div className="border-b border-border/50 bg-surface p-3">
        <label className="flex items-center gap-2 rounded border border-border/50 bg-[#f8fafc] px-3 py-2 text-sm text-muted">
          <Search className="h-4 w-4" aria-hidden="true" />
          <input className="w-full bg-transparent outline-none" placeholder="Search within paper" disabled />
        </label>
      </div>
      <div className="flex-1 overflow-auto bg-surface-muted p-6">
        <div className="mx-auto min-h-[720px] max-w-[560px] rounded-sm bg-white p-10 shadow-sm">
          <p className="text-center text-lg font-bold text-foreground">{paper?.title ?? "Academic Paper"}</p>
          <div className="mx-auto mt-3 h-3 w-40 rounded bg-surface-muted" />
          <div className="mt-10 space-y-3">
            <div className="h-3 rounded bg-surface-muted" />
            <div className="h-3 rounded bg-surface-muted" />
            <div className="h-3 w-4/5 rounded bg-surface-muted" />
          </div>
          <div className="mt-8 rounded border-l-4 border-secondary bg-secondary-muted/50 p-4">
            <p className="text-sm leading-6 text-muted">
              {paper?.abstract ??
                "This static PDF shell preserves the prototype viewer layout. Real PDF rendering is deferred."}
            </p>
          </div>
          <div className="mt-8 space-y-3">
            {Array.from({ length: 10 }).map((_, index) => (
              <div
                key={index}
                className="h-3 rounded bg-surface-muted"
                style={{ width: `${92 - (index % 4) * 8}%` }}
              />
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
}
