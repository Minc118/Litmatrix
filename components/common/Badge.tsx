type BadgeTone = "neutral" | "success" | "warning" | "muted";

const toneClasses: Record<BadgeTone, string> = {
  neutral: "border-border bg-surface text-foreground",
  success: "border-emerald-200 bg-emerald-50 text-emerald-800",
  warning: "border-amber-200 bg-amber-50 text-amber-800",
  muted: "border-border bg-surface-muted text-muted",
};

export function Badge({
  children,
  tone = "neutral",
}: {
  children: React.ReactNode;
  tone?: BadgeTone;
}) {
  return (
    <span className={`inline-flex items-center rounded-sm border px-2 py-1 text-xs font-medium ${toneClasses[tone]}`}>
      {children}
    </span>
  );
}
