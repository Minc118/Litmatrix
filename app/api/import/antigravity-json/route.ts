import { dataResponse, errorResponse } from "@/lib/server/http";
import { importAntigravityJson } from "@/lib/server/services/importService";
import { readJsonBody } from "@/lib/server/validators/litmatrixValidators";

export async function POST(request: Request) {
  const { searchParams } = new URL(request.url);
  const dryRun = searchParams.get("dryRun") === "true";
  const routeProjectId = searchParams.get("projectId");

  const payload = await readJsonBody(request);
  if (!payload) {
    return errorResponse("BAD_REQUEST", "Invalid or missing JSON payload.", 400);
  }

  // Project boundary validation
  if (routeProjectId && payload && typeof payload === "object" && "projectId" in payload) {
    const payloadProjectId = (payload as Record<string, unknown>).projectId;
    if (payloadProjectId !== routeProjectId) {
      return errorResponse(
        "PROJECT_MISMATCH",
        `The import payload projectId (${payloadProjectId}) does not match the active project workspace (${routeProjectId}).`,
        400
      );
    }
  }

  const result = await importAntigravityJson(payload, dryRun);
  if (!result.ok) {
    const status = result.status;
    const details = "validationErrors" in result && result.validationErrors
      ? { validationErrors: result.validationErrors }
      : {};
    return errorResponse(result.code, result.message, status, details);
  }

  return dataResponse(result.data);
}
