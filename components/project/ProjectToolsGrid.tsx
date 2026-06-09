import { BookMarked, Columns3, Download, GitCompare, Lightbulb, ShieldCheck } from "lucide-react";
import type { ProviderStatusResponse } from "@/lib/types/litmatrix";

const tools = [
  {
    title: "Quality Assessment",
    body: "Evaluate inclusion confidence, evidence level, and review readiness.",
    icon: ShieldCheck,
  },
  {
    title: "Citation Explorer",
    body: "Reserved for future Zotero-backed bibliography exploration.",
    icon: BookMarked,
  },
  {
    title: "Idea Board",
    body: "Collect saved-as-idea suggestions and possible argument directions.",
    icon: Lightbulb,
  },
  {
    title: "Compare View",
    body: "Inspect papers side by side across matrix fields.",
    icon: GitCompare,
  },
  {
    title: "Export Workspace",
    body: "Prepare Markdown, CSV, and JSON outputs after confirmation.",
    icon: Download,
  },
  {
    title: "Theme Board",
    body: "Cluster confirmed values into themes and synthesis candidates.",
    icon: Columns3,
  },
];

export function ProjectToolsGrid({ providerStatus }: { providerStatus: ProviderStatusResponse | null }) {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {tools.map((tool) => {
          const Icon = tool.icon;
          return (
            <article key={tool.title} className="lm-card min-h-52 p-6">
              <div className="mb-6 flex h-11 w-11 items-center justify-center rounded bg-surface-muted text-foreground">
                <Icon className="h-5 w-5" aria-hidden="true" />
              </div>
              <h3 className="text-lg font-semibold text-foreground">{tool.title}</h3>
              <p className="mt-3 text-sm leading-6 text-muted">{tool.body}</p>
            </article>
          );
        })}
      </div>
      <section className="lm-card p-6">
        <p className="lm-label">Provider Status</p>
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
