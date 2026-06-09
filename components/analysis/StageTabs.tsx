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
    <div className="flex gap-6 border-b border-border/50">
      {stages.map((stage) => {
        const key = stage.label === "Overview" ? "overview" : stage.label === "AI Analysis" ? "analysis" : "review";
        return (
          <Link
            key={stage.label}
            href={`/projects/${projectId}${stage.href}`}
            className={`flex items-center gap-2 border-b-2 pb-3 text-sm font-semibold ${
              active === key
                ? "border-foreground text-foreground"
                : "border-transparent text-muted hover:text-foreground"
            }`}
          >
            {stage.label}
            {stage.label === "Review" ? (
              <span className="rounded bg-surface-muted px-1.5 py-0.5 text-[10px] text-muted">{reviewCount}</span>
            ) : null}
          </Link>
        );
      })}
    </div>
  );
}
