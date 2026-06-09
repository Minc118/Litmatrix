import { DataPreview } from "@/components/common/DataPreview";

export function ProjectDashboardPlaceholder({ projectId }: { projectId: string }) {
  return (
    <div className="space-y-6">
      <div className="rounded border border-border bg-surface p-5">
        <h2 className="text-lg font-semibold">Project dashboard insertion point</h2>
        <p className="mt-2 text-sm leading-6 text-muted">
          Reserved for the prototype dashboard: project summary, upload dropzone, research questions, and
          extraction matrix preview.
        </p>
      </div>
      <DataPreview endpoint={`/api/projects/${projectId}`} label="Project detail API" />
    </div>
  );
}
