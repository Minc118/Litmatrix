import { ProjectDashboardView } from "@/components/project/ProjectDashboardView";

type ProjectPageProps = {
  params: Promise<{ projectId: string }>;
};

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { projectId } = await params;

  return <ProjectDashboardView projectId={projectId} />;
}
