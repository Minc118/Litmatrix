import { PaperOverviewWorkspaceView } from "@/components/analysis/PaperOverviewWorkspaceView";

type OverviewPageProps = {
  params: Promise<{ projectId: string }>;
};

export default async function OverviewPage({ params }: OverviewPageProps) {
  const { projectId } = await params;

  return <PaperOverviewWorkspaceView projectId={projectId} />;
}
