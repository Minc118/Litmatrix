import { PlanRouteView } from "@/components/plans/PlanRouteView";

type PresentationPlanPageProps = {
  params: Promise<{ projectId: string }>;
};

export default async function PresentationPlanPage({ params }: PresentationPlanPageProps) {
  const { projectId } = await params;

  return (
    <PlanRouteView
      projectId={projectId}
      title="Presentation Plan"
      endpoint={`/api/projects/${projectId}/presentation-plan`}
    />
  );
}
