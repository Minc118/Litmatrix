import { Brain, CheckCircle2, FileText, FileUp } from "lucide-react";

const steps = [
  { title: "PDF intake planned", body: "Use seeded demo papers now; future PDF parser input is not connected yet.", icon: FileUp },
  { title: "Generate overview", body: "Create a reviewable paper overview from available evidence.", icon: FileText },
  { title: "Review summary", body: "Decide whether the paper warrants deeper extraction.", icon: CheckCircle2 },
  { title: "Map to matrix", body: "Move confirmed values into the project extraction matrix.", icon: Brain },
];

export function WorkflowSteps() {
  return (
    <div className="relative grid gap-4 md:grid-cols-4">
      <div className="absolute left-[12.5%] right-[12.5%] top-7 hidden h-px bg-border md:block" />
      {steps.map((step, index) => {
        const Icon = step.icon;
        return (
          <article key={step.title} className="relative">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full border border-border bg-surface text-foreground">
              <Icon className="h-5 w-5" aria-hidden="true" />
            </div>
            <p className="text-xs font-semibold uppercase tracking-wide text-muted">Step {index + 1}</p>
            <h3 className="mt-1 text-sm font-bold text-foreground">{step.title}</h3>
            <p className="mt-2 text-sm leading-6 text-muted">{step.body}</p>
          </article>
        );
      })}
    </div>
  );
}
