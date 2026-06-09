import { DataPreview } from "@/components/common/DataPreview";

export function PlanPlaceholder({
  title,
  endpoint,
}: {
  title: string;
  endpoint: string;
}) {
  return (
    <div className="space-y-6">
      <div className="rounded border border-border bg-surface p-5">
        <h2 className="text-lg font-semibold">{title} insertion point</h2>
        <p className="mt-2 text-sm leading-6 text-muted">
          Reserved for plan outlines that link every section or slide back to supporting paper IDs.
        </p>
      </div>
      <DataPreview endpoint={endpoint} label={`${title} API`} />
    </div>
  );
}
