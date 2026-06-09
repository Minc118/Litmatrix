"use client";

import { ProjectSidebar } from "@/components/layout/ProjectSidebar";
import { WorkspaceTopBar } from "@/components/layout/WorkspaceTopBar";
import { useLitmatrixResource } from "@/lib/api/useLitmatrixResource";
import type { PresentationPlan, WritingPlan } from "@/lib/types/litmatrix";

type PlanData = WritingPlan | PresentationPlan | null;

export function PlanRouteView({
  projectId,
  title,
  endpoint,
}: {
  projectId: string;
  title: string;
  endpoint: string;
}) {
  const { data } = useLitmatrixResource<PlanData>(endpoint);
  const items =
    data && "sections" in data
      ? data.sections.map((section) => ({
          id: section.id,
          title: section.heading,
          body: section.purpose,
          papers: section.supportingPaperIds,
        }))
      : data && "slides" in data
        ? data.slides.map((slide) => ({
            id: slide.id,
            title: slide.title,
            body: slide.objective,
            papers: slide.supportingPaperIds,
          }))
        : [];

  return (
    <main className="flex min-h-screen bg-background text-foreground">
      <ProjectSidebar projectId={projectId} />
      <section className="min-w-0 flex-1">
        <WorkspaceTopBar title={title} context="Planning workspace" />
        <div className="space-y-6 p-6">
          <div>
            <p className="lm-label">Plan outline</p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-foreground">{data?.title ?? title}</h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-muted">
              Plan sections remain linked to supporting paper IDs and confirmed synthesis inputs.
            </p>
          </div>
          <div className="space-y-4">
            {items.map((item, index) => (
              <article key={item.id} className="lm-card p-5">
                <p className="lm-label">Step {index + 1}</p>
                <h2 className="mt-2 text-lg font-semibold text-foreground">{item.title}</h2>
                <p className="mt-3 text-sm leading-6 text-muted">{item.body}</p>
                <p className="mt-3 text-xs text-muted">Supporting papers: {item.papers.join(", ")}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
