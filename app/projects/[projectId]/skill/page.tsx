import { ProjectSkillView } from "@/components/project/ProjectSkillView";

type SkillPageProps = {
  params: Promise<{ projectId: string }>;
};

export default async function SkillPage({ params }: SkillPageProps) {
  const { projectId } = await params;
  return <ProjectSkillView projectId={projectId} />;
}
