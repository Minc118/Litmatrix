import { FileJson, FileUp, Library } from "lucide-react";
import { InertActionBadge } from "@/components/common/InertActionBadge";
import type { ProviderCapability, ProviderStatusResponse } from "@/lib/types/litmatrix";

const plannedActions = [
  {
    id: "pdf-parser",
    title: "PDF upload and parsing",
    body: "PDF upload and parsing are not connected yet.",
    icon: FileUp,
    statusLabel: "Coming soon",
  },
  {
    id: "zotero-local",
    title: "Zotero Local import",
    body: "Zotero Local status can be displayed, but library import is not implemented yet.",
    icon: Library,
    statusLabel: "Not connected",
  },
  {
    id: "antigravity-import",
    title: "Antigravity JSON import",
    body: "The backend route is a safe placeholder and does not ingest files yet.",
    icon: FileJson,
    statusLabel: "Demo-only",
  },
] as const;

function findCapability(providerStatus: ProviderStatusResponse | null | undefined, id: string): ProviderCapability | undefined {
  return [...(providerStatus?.providers ?? []), ...(providerStatus?.importers ?? [])].find((capability) => capability.id === id);
}

export function ImportIntegrationStatus({
  providerStatus,
  compact = false,
}: {
  providerStatus?: ProviderStatusResponse | null;
  compact?: boolean;
}) {
  return (
    <section className="lm-card p-5">
      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="lm-label">Import Status</p>
          <h2 className="mt-2 text-lg font-semibold tracking-tight text-foreground">Demo data is active</h2>
          <p className="mt-2 text-sm leading-6 text-muted">
            Current demo uses seeded OCPM papers. PDF upload, Zotero import, and Antigravity import are planned
            provider/importer integrations.
          </p>
          <p className="mt-2 text-sm leading-6 text-muted">
            Gemini overview/extraction is available only after database migration and provider configuration.
          </p>
        </div>
        <InertActionBadge label="Demo mode" />
      </div>
      <div className={`mt-5 grid gap-3 ${compact ? "" : "md:grid-cols-3"}`}>
        {plannedActions.map((action) => {
          const Icon = action.icon;
          const capability = findCapability(providerStatus, action.id);
          return (
            <article key={action.id} className="rounded border border-border/50 bg-[#f8fafc] p-4">
              <div className="flex items-start gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded bg-surface text-foreground">
                  <Icon className="h-4 w-4" aria-hidden="true" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-sm font-semibold text-foreground">{action.title}</h3>
                    <InertActionBadge label={action.statusLabel} />
                  </div>
                  <p className="mt-2 text-xs leading-5 text-muted">{capability?.message ?? action.body}</p>
                  <button
                    className="mt-3 rounded-sm border border-border/60 bg-surface px-3 py-1.5 text-xs font-medium text-muted opacity-70"
                    disabled
                  >
                    Not available yet
                  </button>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
