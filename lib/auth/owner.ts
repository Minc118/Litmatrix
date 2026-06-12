import { getProject } from "@/lib/server/services/projectService";
import { auth } from "@/lib/auth/server";
import { NextRequest } from "next/server";
import { errorResponse } from "@/lib/server/http";

export type ProjectOwnerVerifyResult = {
  authorized: boolean;
  status?: number;
  code?: string;
  message?: string;
};

export async function verifyProjectOwner(projectId: string): Promise<ProjectOwnerVerifyResult> {
  if (projectId === "ocpm-demo") {
    return { authorized: true };
  }

  const project = await getProject(projectId);
  if (!project) {
    return {
      authorized: false,
      status: 404,
      code: "NOT_FOUND",
      message: "Project not found.",
    };
  }

  const { data: session } = await auth.getSession();
  const userId = session?.user?.id;

  if (project.userId !== userId) {
    return {
      authorized: false,
      status: 403,
      code: "FORBIDDEN",
      message: "Forbidden: You do not own this project.",
    };
  }

  return { authorized: true };
}

export function withProjectOwner<T extends { params: Promise<{ projectId: string }> }>(
  handler: (req: NextRequest, context: T) => Promise<Response>
) {
  return async (req: NextRequest, context: T) => {
    const { projectId } = await context.params;
    const verify = await verifyProjectOwner(projectId);
    if (!verify.authorized) {
      return errorResponse(verify.code!, verify.message!, verify.status!);
    }
    return handler(req, context);
  };
}
