import { PaperListView } from "@/components/papers/PaperListView";

type PapersPageProps = {
  params: Promise<{ projectId: string }>;
};

export default async function PapersPage({ params }: PapersPageProps) {
  const { projectId } = await params;

  return <PaperListView projectId={projectId} />;
}
