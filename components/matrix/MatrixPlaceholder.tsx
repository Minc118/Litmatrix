import { DataPreview } from "@/components/common/DataPreview";

export function MatrixPlaceholder({ projectId }: { projectId: string }) {
  return (
    <div className="space-y-6">
      <div className="rounded border border-border bg-surface p-5">
        <h2 className="text-lg font-semibold">Extraction matrix insertion point</h2>
        <p className="mt-2 text-sm leading-6 text-muted">
          Reserved for the prototype matrix table. Final synthesis must use confirmed extraction values only.
        </p>
      </div>
      <DataPreview endpoint={`/api/projects/${projectId}/extraction-matrix`} label="Extraction matrix API" />
    </div>
  );
}
