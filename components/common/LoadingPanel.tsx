export function LoadingPanel({ label = "Loading workspace" }: { label?: string }) {
  return (
    <div className="lm-card p-6">
      <p className="lm-label">{label}</p>
      <div className="mt-5 space-y-3">
        <div className="h-4 w-1/2 rounded bg-surface-muted" />
        <div className="h-4 rounded bg-surface-muted" />
        <div className="h-4 w-5/6 rounded bg-surface-muted" />
      </div>
    </div>
  );
}
