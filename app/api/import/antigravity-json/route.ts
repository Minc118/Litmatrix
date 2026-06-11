import { dataResponse, errorResponse } from "@/lib/server/http";
import { importAntigravityJson } from "@/lib/server/services/importService";
import { readJsonBody } from "@/lib/server/validators/litmatrixValidators";

export async function POST(request: Request) {
  const payload = await readJsonBody(request);
  if (!payload) {
    return errorResponse("BAD_REQUEST", "Invalid or missing JSON payload.", 400);
  }

  const result = await importAntigravityJson(payload);
  if (!result.ok) {
    const status = result.status;
    const details = "validationErrors" in result && result.validationErrors
      ? { validationErrors: result.validationErrors }
      : {};
    return errorResponse(result.code, result.message, status, details);
  }

  return dataResponse(result.data);
}
