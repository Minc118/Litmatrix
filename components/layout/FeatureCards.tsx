import { Brain, FileUp, Rows3, ScrollText } from "lucide-react";

const features = [
  {
    title: "Upload academic PDFs",
    body: "Import papers into a focused workspace while preserving the path toward structured extraction.",
    icon: FileUp,
  },
  {
    title: "Generate paper overviews",
    body: "Grasp research objective, method, findings, limitations, and relevance before deep analysis.",
    icon: ScrollText,
  },
  {
    title: "Review AI extraction suggestions",
    body: "Treat AI output as reviewable suggestions with traceability to evidence and confidence labels.",
    icon: Brain,
  },
  {
    title: "Build a literature matrix",
    body: "Compare confirmed extraction values across papers before synthesis, gap mapping, and writing.",
    icon: Rows3,
  },
];

export function FeatureCards() {
  return (
    <section id="features" className="mx-auto max-w-screen-2xl px-6 py-24 md:px-12">
      <div className="mx-auto mb-16 max-w-2xl text-center">
        <h2 className="text-3xl font-bold tracking-tight text-foreground">The Intellectual Sanctuary</h2>
        <p className="mt-4 text-base leading-7 text-muted">
          A deliberate separation of concerns, designed to keep your focus on the structure and synthesis of
          ideas.
        </p>
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {features.map((feature) => {
          const Icon = feature.icon;
          return (
            <article key={feature.title} className="lm-card flex min-h-72 flex-col p-8 transition-shadow hover:shadow-lg">
              <div className="mb-8 flex h-12 w-12 items-center justify-center rounded border border-border/40 bg-surface-muted text-foreground">
                <Icon className="h-6 w-6" aria-hidden="true" />
              </div>
              <h3 className="text-base font-semibold text-foreground">{feature.title}</h3>
              <p className="mt-auto pt-6 text-sm leading-6 text-muted">{feature.body}</p>
            </article>
          );
        })}
      </div>
    </section>
  );
}
