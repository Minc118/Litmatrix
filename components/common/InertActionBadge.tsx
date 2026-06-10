export function InertActionBadge({ label = "Demo-only" }: { label?: string }) {
  return (
    <span className="rounded-sm border border-[#9aa0a6]/70 bg-[#eef0f2] px-2 py-1 text-[11px] font-semibold uppercase tracking-wide text-[#3f4448]">
      {label}
    </span>
  );
}
