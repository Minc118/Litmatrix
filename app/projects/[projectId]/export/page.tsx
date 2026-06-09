import { ExportWorkspaceView } from "@/components/export/ExportWorkspaceView";

type ExportPageProps = {
  params: Promise<{ projectId: string }>;
};

export default async function ExportPage({ params }: ExportPageProps) {
  const { projectId } = await params;

  return <ExportWorkspaceView projectId={projectId} />;
}
