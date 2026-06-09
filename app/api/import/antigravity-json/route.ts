import { errorResponse } from "@/lib/server/http";
import { importAntigravityJson } from "@/lib/server/services/importService";

export async function POST() {
  const result = await importAntigravityJson();
  return errorResponse(result.code, result.message, 403);
}
