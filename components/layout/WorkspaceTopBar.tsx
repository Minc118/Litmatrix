import { Bell, Download, Search } from "lucide-react";

export function WorkspaceTopBar({
  title,
  context,
  actionLabel = "Export",
}: {
  title: string;
  context?: string;
  actionLabel?: string;
}) {
  return (
    <header className="flex min-h-16 items-center justify-between border-b border-border/50 bg-[#fdfdfd] px-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-muted">{context ?? "LitMatrix"}</p>
        <h2 className="text-lg font-semibold tracking-tight text-foreground">{title}</h2>
      </div>
      <div className="flex items-center gap-2">
        <label className="hidden items-center gap-2 rounded border border-border/50 bg-surface px-3 py-2 text-sm text-muted md:flex">
          <Search className="h-4 w-4" aria-hidden="true" />
          <input className="w-48 bg-transparent outline-none placeholder:text-muted" placeholder="Search project" disabled />
        </label>
        <button className="rounded-sm border border-border/50 bg-surface p-2 text-muted" disabled aria-label="Notifications">
          <Bell className="h-4 w-4" aria-hidden="true" />
        </button>
        <button className="inline-flex items-center gap-2 rounded-sm border border-border/50 bg-surface px-3 py-2 text-sm text-muted" disabled>
          <Download className="h-4 w-4" aria-hidden="true" />
          {actionLabel}
        </button>
      </div>
    </header>
  );
}
