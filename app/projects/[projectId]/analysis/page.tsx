import { AIAnalysisWorkspaceView } from "@/components/analysis/AIAnalysisWorkspaceView";

type AnalysisPageProps = {
  params: Promise<{ projectId: string }>;
};

export default async function AnalysisPage({ params }: AnalysisPageProps) {
  const { projectId } = await params;

  return <AIAnalysisWorkspaceView projectId={projectId} />;
}
