import { notFound, redirect } from "next/navigation";
import { verifyProjectOwner } from "@/lib/auth/owner";

type ProjectLayoutProps = {
  params: Promise<{ projectId: string }>;
  children: React.ReactNode;
};

export default async function ProjectLayout({ params, children }: ProjectLayoutProps) {
  const { projectId } = await params;
  const verify = await verifyProjectOwner(projectId);

  if (!verify.authorized) {
    if (verify.status === 404) {
      notFound();
    } else {
      redirect("/projects");
    }
  }

  return <>{children}</>;
}
