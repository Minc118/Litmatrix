import { PlanRouteView } from "@/components/plans/PlanRouteView";

type WritingPlanPageProps = {
  params: Promise<{ projectId: string }>;
};

export default async function WritingPlanPage({ params }: WritingPlanPageProps) {
  const { projectId } = await params;

  return <PlanRouteView projectId={projectId} title="Writing Plan" endpoint={`/api/projects/${projectId}/writing-plan`} />;
}
