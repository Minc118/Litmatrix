import { SynthesisRouteView } from "@/components/synthesis/SynthesisRouteView";

type ThemesPageProps = {
  params: Promise<{ projectId: string }>;
};

export default async function ThemesPage({ params }: ThemesPageProps) {
  const { projectId } = await params;

  return (
    <SynthesisRouteView
      projectId={projectId}
      title="Theme Clustering"
      endpoint={`/api/projects/${projectId}/theme-clusters`}
    />
  );
}
