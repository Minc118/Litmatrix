import type { Paper, PaperOverview } from "@/lib/types/litmatrix";
import { ConfidenceBadge, EvidenceLevelBadge, ReviewStatusBadge, SourceBadge } from "@/components/common/StatusBadges";

const overviewFields = [
  ["Problem", "problem"],
  ["Objective", "objective"],
  ["Method", "method"],
  ["Dataset", "dataset"],
  ["Findings", "findings"],
  ["Limitations", "limitations"],
] as const;

export function PaperOverviewPanel({
  overview,
  paper,
}: {
  overview: PaperOverview | null;
  paper?: Paper | null;
}) {
  if (!overview) {
    return (
      <section className="lm-card p-6">
        <p className="lm-label">Paper Overview</p>
        <h2 className="mt-2 text-xl font-semibold text-foreground">{paper?.title ?? "No overview selected"}</h2>
        <p className="mt-3 text-sm leading-6 text-muted">No overview is available for this paper yet.</p>
      </section>
    );
  }

  return (
    <section className="space-y-6">
      <div className="lm-card p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="lm-label">Overview Generated</p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight text-foreground">
              {paper?.title ?? overview.paperId}
            </h2>
          </div>
          <div className="flex flex-wrap gap-2">
            <SourceBadge source={overview.analysisSource} />
            <EvidenceLevelBadge level={overview.evidenceLevel} />
            <ConfidenceBadge confidence={overview.confidence} />
            <ReviewStatusBadge status={overview.status} />
          </div>
        </div>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {overviewFields.map(([label, key]) => (
            <div key={key} className="rounded border border-border/50 bg-[#f8fafc] p-4">
              <p className="lm-label">{label}</p>
              <p className="mt-2 text-sm leading-6 text-foreground">{overview[key] ?? "Not specified in the provided text."}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="lm-card p-6">
        <p className="lm-label">Evidence</p>
        <div className="mt-4 space-y-3">
          {overview.evidence.map((evidence, index) => (
            <div key={`${evidence.paperId}-${index}`} className="rounded border border-border/50 bg-surface-muted p-4">
              <p className="text-sm font-semibold text-foreground">{evidence.paperId}</p>
              <p className="mt-1 text-sm leading-6 text-muted">{evidence.note ?? "Evidence note unavailable."}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
