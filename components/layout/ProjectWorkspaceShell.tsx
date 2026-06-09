import { ProjectNav } from "@/components/layout/ProjectNav";
import { WorkspaceShell } from "@/components/layout/WorkspaceShell";

export function ProjectWorkspaceShell({
  projectId,
  title,
  description,
  children,
}: {
  projectId: string;
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <WorkspaceShell title={title} eyebrow={`Project ${projectId}`} description={description}>
      <div className="grid gap-6 lg:grid-cols-[260px_minmax(0,1fr)]">
        <ProjectNav projectId={projectId} />
        <div className="min-w-0">{children}</div>
      </div>
    </WorkspaceShell>
  );
}
