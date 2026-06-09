import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function LandingHero() {
  return (
    <section className="relative mx-auto flex min-h-[716px] max-w-screen-2xl flex-col items-center justify-center overflow-hidden px-6 py-28 text-center md:px-12 md:py-36">
      <div className="pointer-events-none absolute inset-0 -z-10 flex items-center justify-center">
        <div className="h-[760px] w-[760px] rounded-full bg-gradient-to-tr from-surface-strong/70 to-transparent blur-3xl" />
      </div>
      <div className="max-w-4xl space-y-8">
        <h1 className="mx-auto max-w-3xl text-5xl font-bold leading-tight tracking-tight text-foreground md:text-6xl">
          LitMatrix
          <br />
          <span className="text-[#2f2f2f]">Extract. Compare. Think. Write.</span>
        </h1>
        <p className="mx-auto max-w-2xl text-base leading-7 text-muted md:text-lg">
          A focused SLR workspace for turning academic PDFs into structured research insights. Minimize
          cognitive load, maximize intellectual synthesis.
        </p>
        <div className="flex flex-col items-center justify-center gap-4 pt-4 sm:flex-row">
          <Link
            href="/new"
            className="inline-flex w-full items-center justify-center gap-2 rounded-sm bg-primary px-8 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 sm:w-auto"
          >
            Start New Analysis
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
          <Link
            href="/projects/ocpm-demo"
            className="inline-flex w-full items-center justify-center rounded-sm border border-border bg-transparent px-8 py-3 text-sm font-medium text-muted transition-colors hover:bg-surface sm:w-auto"
          >
            Create Project
          </Link>
        </div>
      </div>
      <div className="mt-24 w-full max-w-5xl">
        <div className="lm-panel aspect-[16/9] overflow-hidden">
          <div className="flex h-12 items-center gap-4 border-b border-border/40 bg-background px-4">
            <div className="flex gap-2">
              <span className="h-3 w-3 rounded-full bg-border" />
              <span className="h-3 w-3 rounded-full bg-border" />
              <span className="h-3 w-3 rounded-full bg-border" />
            </div>
            <div className="flex flex-1 justify-center">
              <span className="rounded-sm bg-surface-strong px-8 py-1 text-[11px] font-semibold uppercase tracking-wide text-muted">
                Project: Object-Centric Process Mining Survey
              </span>
            </div>
          </div>
          <div className="flex h-[calc(100%-3rem)] bg-[#fdfdfd]">
            <div className="hidden w-64 border-r border-border/40 bg-[#f8fafc] p-4 md:block">
              <div className="mb-5 h-4 w-3/4 rounded bg-surface-strong" />
              <div className="space-y-3">
                <div className="h-3 rounded bg-surface-strong" />
                <div className="h-3 w-5/6 rounded bg-surface-strong" />
                <div className="h-3 w-4/5 rounded bg-surface-strong" />
              </div>
            </div>
            <div className="flex-1 p-6 md:p-8">
              <div className="mb-8 h-8 w-1/3 rounded bg-surface-strong" />
              <div className="space-y-3">
                <div className="h-4 rounded bg-surface-muted" />
                <div className="h-4 rounded bg-surface-muted" />
                <div className="h-4 w-3/4 rounded bg-surface-muted" />
              </div>
              <div className="mt-8 overflow-hidden rounded border border-border/40">
                <div className="grid grid-cols-4 gap-4 border-b border-border/40 bg-[#f8fafc] p-3">
                  <div className="h-3 rounded bg-border/60" />
                  <div className="h-3 rounded bg-border/60" />
                  <div className="h-3 rounded bg-border/60" />
                  <div className="h-3 rounded bg-border/60" />
                </div>
                {[0, 1].map((row) => (
                  <div key={row} className="grid grid-cols-4 gap-4 border-b border-border/20 p-3 last:border-b-0">
                    <div className="h-3 rounded bg-surface-muted" />
                    <div className="h-3 rounded bg-surface-muted" />
                    <div className="h-3 rounded bg-surface-muted" />
                    <div className="h-3 rounded bg-surface-muted" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
