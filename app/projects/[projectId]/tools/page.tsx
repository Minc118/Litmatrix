import { ProjectToolsDashboardView } from "@/components/project/ProjectToolsDashboardView";

type ToolsPageProps = {
  params: Promise<{ projectId: string }>;
};

export default async function ToolsPage({ params }: ToolsPageProps) {
  const { projectId } = await params;

  return <ProjectToolsDashboardView projectId={projectId} />;
}
