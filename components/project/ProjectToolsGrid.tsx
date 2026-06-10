import Link from "next/link";
import { BookMarked, Columns3, Download, GitCompare, Lightbulb, ShieldCheck } from "lucide-react";
import { InertActionBadge } from "@/components/common/InertActionBadge";
import type { ProviderStatusResponse } from "@/lib/types/litmatrix";

const tools = [
  {
    title: "Quality Assessment",
    body: "Planned review rubric workspace. Not connected to persistence or scoring yet.",
    icon: ShieldCheck,
    href: null,
  },
  {
    title: "Citation Explorer",
    body: "Reserved for future Zotero-backed bibliography exploration. Zotero import is not implemented yet.",
    icon: BookMarked,
    href: null,
  },
  {
    title: "Idea Board",
    body: "Collect saved-as-idea suggestions and possible argument directions.",
    icon: Lightbulb,
    href: "/arguments",
  },
  {
    title: "Compare View",
    body: "Inspect papers side by side across matrix fields.",
    icon: GitCompare,
    href: "/matrix",
  },
  {
    title: "Export Workspace",
    body: "Open static export workspace. Actual export generation remains disabled.",
    icon: Download,
    href: "/export",
  },
  {
    title: "Theme Board",
    body: "Cluster confirmed values into themes and synthesis candidates.",
    icon: Columns3,
    href: "/themes",
  },
];

export function ProjectToolsGrid({
  projectId,
  providerStatus,
}: {
  projectId: string;
  providerStatus: ProviderStatusResponse | null;
}) {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {tools.map((tool) => {
          const Icon = tool.icon;
          const content = (
            <>
              <div className="mb-6 flex h-11 w-11 items-center justify-center rounded bg-surface-muted text-foreground">
                <Icon className="h-5 w-5" aria-hidden="true" />
              </div>
              <div className="flex items-start justify-between gap-3">
                <h3 className="text-lg font-semibold text-foreground">{tool.title}</h3>
                {tool.href ? null : <InertActionBadge />}
              </div>
              <p className="mt-3 text-sm leading-6 text-muted">{tool.body}</p>
            </>
          );

          return tool.href ? (
            <Link key={tool.title} href={`/projects/${projectId}${tool.href}`} className="lm-card min-h-52 p-6 hover:bg-[#f8fafc]">
              {content}
            </Link>
          ) : (
            <article key={tool.title} className="lm-card min-h-52 p-6">
              {content}
            </article>
          );
        })}
      </div>
      <section className="lm-card p-6">
        <p className="lm-label">Provider Status</p>
        <p className="mt-2 text-sm leading-6 text-muted">
          Current demo uses seeded OCPM papers. PDF upload, Zotero import, and Antigravity import are planned
          provider/importer integrations.
        </p>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          {[...(providerStatus?.providers ?? []), ...(providerStatus?.importers ?? [])].map((provider) => (
            <div key={provider.id} className="rounded border border-border/50 bg-[#f8fafc] p-4">
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-semibold text-foreground">{provider.label}</p>
                <span className="rounded-sm border border-border bg-surface px-2 py-1 text-[11px] font-semibold text-muted">
                  {provider.configured ? "Configured" : "Not configured"}
                </span>
              </div>
              <p className="mt-2 text-sm leading-6 text-muted">{provider.message}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
