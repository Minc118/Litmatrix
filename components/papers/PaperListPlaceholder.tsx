import { DataPreview } from "@/components/common/DataPreview";

export function PaperListPlaceholder({ projectId }: { projectId: string }) {
  return (
    <div className="space-y-6">
      <div className="rounded border border-border bg-surface p-5">
        <h2 className="text-lg font-semibold">Paper library insertion point</h2>
        <p className="mt-2 text-sm leading-6 text-muted">
          Reserved for paper cards and import entry points. Current demo uses seeded OCPM papers; PDF upload and
          Zotero import are not connected yet.
        </p>
      </div>
      <DataPreview endpoint={`/api/projects/${projectId}/papers`} label="Papers API" />
    </div>
  );
}
