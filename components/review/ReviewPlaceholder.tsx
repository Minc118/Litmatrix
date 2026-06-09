import { DataPreview } from "@/components/common/DataPreview";

export function ReviewPlaceholder({ projectId }: { projectId: string }) {
  return (
    <div className="space-y-6">
      <div className="rounded border border-border bg-surface p-5">
        <h2 className="text-lg font-semibold">AI suggestion review insertion point</h2>
        <p className="mt-2 text-sm leading-6 text-muted">
          Reserved for accept, edit, reject, and save-as-idea controls. Mutations remain disabled in this
          skeleton phase.
        </p>
      </div>
      <DataPreview endpoint={`/api/projects/${projectId}/suggestions`} label="Suggestions API" />
      <DataPreview endpoint={`/api/projects/${projectId}/review-decisions`} label="Review decisions API" />
    </div>
  );
}
