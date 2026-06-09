import { DataPreview } from "@/components/common/DataPreview";

export function PaperWorkspacePlaceholder({
  projectId,
  paperId,
}: {
  projectId: string;
  paperId: string;
}) {
  return (
    <div className="space-y-6">
      <div className="rounded border border-border bg-surface p-5">
        <h2 className="text-lg font-semibold">Paper workspace insertion point</h2>
        <p className="mt-2 text-sm leading-6 text-muted">
          Reserved for the prototype paper workspace: analysis tabs, suggestion review, and PDF viewer shell.
        </p>
      </div>
      <DataPreview endpoint={`/api/projects/${projectId}/overviews?paperId=${paperId}`} label="Paper overview API" />
      <DataPreview endpoint={`/api/projects/${projectId}/suggestions?paperId=${paperId}`} label="Paper suggestions API" />
    </div>
  );
}
