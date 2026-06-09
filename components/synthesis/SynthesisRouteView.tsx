"use client";

import { ProjectSidebar } from "@/components/layout/ProjectSidebar";
import { WorkspaceTopBar } from "@/components/layout/WorkspaceTopBar";
import { useLitmatrixResource } from "@/lib/api/useLitmatrixResource";

type SynthesisItem = {
  id: string;
  title?: string;
  label?: string;
  claim?: string;
  description?: string;
  summary?: string;
  opportunity?: string;
  rationale?: string;
  supportingPaperIds?: string[];
};

export function SynthesisRouteView({
  projectId,
  title,
  endpoint,
}: {
  projectId: string;
  title: string;
  endpoint: string;
}) {
  const { data } = useLitmatrixResource<SynthesisItem[]>(endpoint);

  return (
    <main className="flex min-h-screen bg-background text-foreground">
      <ProjectSidebar projectId={projectId} />
      <section className="min-w-0 flex-1">
        <WorkspaceTopBar title={title} context="Synthesis workspace" />
        <div className="space-y-6 p-6">
          <div>
            <p className="lm-label">Confirmed synthesis</p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-foreground">{title}</h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-muted">
              Styled route coverage for synthesis outputs backed by demo API data.
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {(data ?? []).map((item) => (
              <article key={item.id} className="lm-card p-5">
                <p className="lm-label">{item.supportingPaperIds?.join(", ") || "Project-level"}</p>
                <h2 className="mt-2 text-lg font-semibold text-foreground">
                  {item.title ?? item.label ?? item.claim ?? item.id}
                </h2>
                <p className="mt-3 text-sm leading-6 text-muted">
                  {item.summary ??
                    item.description ??
                    item.opportunity ??
                    item.rationale ??
                    item.claim ??
                    "No summary available."}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
