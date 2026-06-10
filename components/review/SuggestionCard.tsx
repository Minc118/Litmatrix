import type { AISuggestion, Paper } from "@/lib/types/litmatrix";
import { ConfidenceBadge, EvidenceLevelBadge, ReviewStatusBadge, SourceBadge } from "@/components/common/StatusBadges";
import { ReviewDecisionControls } from "@/components/review/ReviewDecisionControls";

export function SuggestionCard({
  suggestion,
  paper,
  onChanged,
}: {
  suggestion: AISuggestion;
  paper?: Paper;
  onChanged?: () => void;
}) {
  return (
    <article className="lm-card p-5">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0">
          <p className="lm-label">{suggestion.targetField ?? suggestion.suggestionType}</p>
          <h3 className="mt-1 text-base font-semibold text-foreground">{suggestion.title}</h3>
          <p className="mt-2 text-sm leading-6 text-muted">{suggestion.content}</p>
          <p className="mt-3 text-xs text-muted">Paper: {paper?.title ?? suggestion.paperId ?? "Project-level suggestion"}</p>
        </div>
        <div className="flex shrink-0 flex-wrap gap-2 lg:max-w-52">
          <SourceBadge source={suggestion.analysisSource} />
          <EvidenceLevelBadge level={suggestion.evidenceLevel} />
          <ConfidenceBadge confidence={suggestion.confidence} />
          <ReviewStatusBadge status={suggestion.status} />
        </div>
      </div>
      <div className="mt-5 flex flex-col gap-3 border-t border-border/50 pt-4 md:flex-row md:items-center md:justify-between">
        <p className="text-xs leading-5 text-muted">
          {suggestion.evidence[0]?.note ?? "No evidence note available."}
        </p>
        <ReviewDecisionControls suggestion={suggestion} onChanged={onChanged} />
      </div>
    </article>
  );
}
