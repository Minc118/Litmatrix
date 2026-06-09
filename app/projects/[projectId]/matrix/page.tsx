import { MatrixWorkspaceView } from "@/components/matrix/MatrixWorkspaceView";

type MatrixPageProps = {
  params: Promise<{ projectId: string }>;
};

export default async function MatrixPage({ params }: MatrixPageProps) {
  const { projectId } = await params;

  return <MatrixWorkspaceView projectId={projectId} />;
}
