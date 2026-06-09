import "server-only";

import { getServerEnv } from "@/lib/server/config/env";
import type { ProviderCapability } from "@/lib/types/litmatrix";

export function getZoteroWebProviderStatus(): ProviderCapability {
  const env = getServerEnv();
  return {
    id: "zotero-web",
    label: "Zotero Web API provider",
    configured: env.zoteroWebConfigured,
    available: false,
    requiresExternalConfiguration: true,
    message: env.zoteroWebConfigured
      ? "Configuration detected, but Zotero Web calls are disabled in the skeleton phase."
      : "Zotero Web credentials are not configured.",
  };
}

export async function importFromZoteroWebPlaceholder() {
  return {
    ok: false,
    code: "PROVIDER_UNCONFIGURED",
    message: "Zotero Web provider is a placeholder and does not call external APIs in this phase.",
  };
}
