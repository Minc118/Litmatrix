import { DataPreview } from "@/components/common/DataPreview";

export function PaperListPlaceholder({ projectId }: { projectId: string }) {
  return (
    <div className="space-y-6">
      <div className="rounded border border-border bg-surface p-5">
        <h2 className="text-lg font-semibold">Paper library insertion point</h2>
        <p className="mt-2 text-sm leading-6 text-muted">
          Reserved for paper cards, PDF upload entry, and future Zotero connection options.
        </p>
      </div>
      <DataPreview endpoint={`/api/projects/${projectId}/papers`} label="Papers API" />
    </div>
  );
}
