import { dataResponse } from "@/lib/server/http";
import { getProviderStatus } from "@/lib/server/services/providerService";

export async function GET() {
  return dataResponse(await getProviderStatus());
}
