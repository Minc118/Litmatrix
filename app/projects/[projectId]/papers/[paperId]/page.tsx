import { PaperWorkspaceView } from "@/components/papers/PaperWorkspaceView";

type PaperPageProps = {
  params: Promise<{ projectId: string; paperId: string }>;
};

export default async function PaperPage({ params }: PaperPageProps) {
  const { projectId, paperId } = await params;

  return <PaperWorkspaceView projectId={projectId} paperId={paperId} />;
}
