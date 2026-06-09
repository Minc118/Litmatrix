import { DataPreview } from "@/components/common/DataPreview";

export function SynthesisPlaceholder({
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
          Reserved for synthesis views derived from confirmed extraction values and supporting paper IDs.
        </p>
      </div>
      <DataPreview endpoint={endpoint} label={`${title} API`} />
    </div>
  );
}
