import { DataPreview } from "@/components/common/DataPreview";

export function AnalysisPlaceholder({
  projectId,
  title,
  endpoint,
}: {
  projectId: string;
  title: string;
  endpoint: string;
}) {
  return (
    <div className="space-y-6">
      <div className="rounded border border-border bg-surface p-5">
        <h2 className="text-lg font-semibold">{title}</h2>
        <p className="mt-2 text-sm leading-6 text-muted">
          Reserved for prototype-aligned analysis panels. Data must continue to flow through backend API
          routes for project {projectId}.
        </p>
      </div>
      <DataPreview endpoint={endpoint} label={`${title} API`} />
    </div>
  );
}
