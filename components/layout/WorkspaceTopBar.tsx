import Link from "next/link";
import { Bell, Download, Search } from "lucide-react";
import { InertActionBadge } from "@/components/common/InertActionBadge";

export function WorkspaceTopBar({
  title,
  context,
  actionLabel = "Export",
  actionHref,
}: {
  title: string;
  context?: string;
  actionLabel?: string;
  actionHref?: string;
}) {
  return (
    <header className="flex min-h-16 items-center justify-between border-b border-border/50 bg-[#fdfdfd] px-6">
      <div>
        <div className="flex items-center gap-2">
          <Link href="/" className="text-xs font-semibold uppercase tracking-wide text-muted hover:text-foreground">
            LitMatrix
          </Link>
          {context ? <span className="text-xs text-muted">/ {context}</span> : null}
        </div>
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
        {actionHref ? (
          <Link
            href={actionHref}
            className="inline-flex items-center gap-2 rounded-sm border border-border/50 bg-surface px-3 py-2 text-sm text-muted hover:text-foreground"
          >
            <Download className="h-4 w-4" aria-hidden="true" />
            {actionLabel}
          </Link>
        ) : (
          <button
            className="inline-flex items-center gap-2 rounded-sm border border-border/50 bg-surface px-3 py-2 text-sm text-muted"
            disabled
            title="Demo-only action"
          >
            <Download className="h-4 w-4" aria-hidden="true" />
            {actionLabel}
            <InertActionBadge label="Inert" />
          </button>
        )}
      </div>
    </header>
  );
}
