import "server-only";

import { getZoteroLocalProviderStatus } from "@/lib/server/providers/zoteroLocalProvider";
import { getZoteroWebProviderStatus } from "@/lib/server/providers/zoteroWebProvider";

export async function getZoteroStatus() {
  return {
    local: getZoteroLocalProviderStatus(),
    web: getZoteroWebProviderStatus(),
  };
}
