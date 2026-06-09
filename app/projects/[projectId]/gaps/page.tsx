import { SynthesisRouteView } from "@/components/synthesis/SynthesisRouteView";

type GapsPageProps = {
  params: Promise<{ projectId: string }>;
};

export default async function GapsPage({ params }: GapsPageProps) {
  const { projectId } = await params;

  return <SynthesisRouteView projectId={projectId} title="Gap Map" endpoint={`/api/projects/${projectId}/gaps`} />;
}
