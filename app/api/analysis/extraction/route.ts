import { dataResponse, errorResponse } from "@/lib/server/http";
import { generateExtractionAnalysis } from "@/lib/server/services/analysisService";
import { readJsonBody } from "@/lib/server/validators/litmatrixValidators";

export async function POST(request: Request) {
  const body = await readJsonBody(request);

  if (!body || typeof body.projectId !== "string" || typeof body.paperId !== "string") {
    return errorResponse("VALIDATION_FAILED", "projectId and paperId are required.", 400);
  }

  const result = await generateExtractionAnalysis({
    projectId: body.projectId,
    paperId: body.paperId,
  });

  if (!result.ok) {
    return errorResponse(result.code, result.message, result.status);
  }

  return dataResponse(result.data);
}
