import Link from "next/link";

const stages = [
  { label: "Overview", href: "/overview" },
  { label: "AI Analysis", href: "/analysis" },
  { label: "Review", href: "/review" },
] as const;

export function StageTabs({
  projectId,
  active,
  reviewCount = 0,
}: {
  projectId: string;
  active: "overview" | "analysis" | "review";
  reviewCount?: number;
}) {
  return (
    <div className="flex gap-3 border-b border-border/50">
      {stages.map((stage) => {
        const key = stage.label === "Overview" ? "overview" : stage.label === "AI Analysis" ? "analysis" : "review";
        return (
          <Link
            key={stage.label}
            href={`/projects/${projectId}${stage.href}`}
            className={`mb-[-1px] flex items-center gap-2 rounded-t-sm border border-b-2 px-3 py-2 text-sm font-semibold transition-colors ${
              active === key
                ? "border-border border-b-[#1f2933] bg-surface text-foreground shadow-sm"
                : "border-transparent text-muted hover:border-border/50 hover:bg-surface-muted hover:text-foreground"
            }`}
            aria-current={active === key ? "page" : undefined}
          >
            <span className={active === key ? "text-foreground" : ""}>{stage.label}</span>
            {stage.label === "Review" ? (
              <span className="rounded bg-surface-muted px-1.5 py-0.5 text-[10px] text-muted">{reviewCount}</span>
            ) : null}
          </Link>
        );
      })}
    </div>
  );
}
