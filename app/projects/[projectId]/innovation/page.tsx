import { SynthesisRouteView } from "@/components/synthesis/SynthesisRouteView";

type InnovationPageProps = {
  params: Promise<{ projectId: string }>;
};

export default async function InnovationPage({ params }: InnovationPageProps) {
  const { projectId } = await params;

  return (
    <SynthesisRouteView
      projectId={projectId}
      title="Innovation Opportunities"
      endpoint={`/api/projects/${projectId}/innovation-opportunities`}
    />
  );
}
