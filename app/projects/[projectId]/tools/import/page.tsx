import { ImportConsoleView } from "@/components/import/ImportConsoleView";

type ImportPageProps = {
  params: Promise<{ projectId: string }>;
};

export default async function ImportConsolePage({ params }: ImportPageProps) {
  const { projectId } = await params;
  return <ImportConsoleView projectId={projectId} />;
}
