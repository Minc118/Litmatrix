import { DataPreview } from "@/components/common/DataPreview";

export function ExportPlaceholder({ projectId }: { projectId: string }) {
  return (
    <div className="space-y-6">
      <div className="rounded border border-border bg-surface p-5">
        <h2 className="text-lg font-semibold">Export workspace insertion point</h2>
        <p className="mt-2 text-sm leading-6 text-muted">
          Reserved for Markdown, CSV, and JSON export controls. Export mutations are not implemented yet.
        </p>
      </div>
      <DataPreview endpoint={`/api/projects/${projectId}/extraction-matrix`} label="Export source preview" />
    </div>
  );
}
