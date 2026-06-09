import { SynthesisRouteView } from "@/components/synthesis/SynthesisRouteView";

type ArgumentsPageProps = {
  params: Promise<{ projectId: string }>;
};

export default async function ArgumentsPage({ params }: ArgumentsPageProps) {
  const { projectId } = await params;

  return (
    <SynthesisRouteView
      projectId={projectId}
      title="Argument Candidates"
      endpoint={`/api/projects/${projectId}/arguments`}
    />
  );
}
