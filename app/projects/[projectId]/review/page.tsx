import { ReviewWorkspaceView } from "@/components/review/ReviewWorkspaceView";

type ReviewPageProps = {
  params: Promise<{ projectId: string }>;
};

export default async function ReviewPage({ params }: ReviewPageProps) {
  const { projectId } = await params;

  return <ReviewWorkspaceView projectId={projectId} />;
}
