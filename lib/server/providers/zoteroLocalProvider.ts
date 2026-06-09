import "server-only";

import type { ProviderCapability } from "@/lib/types/litmatrix";

export function getZoteroLocalProviderStatus(): ProviderCapability {
  return {
    id: "zotero-local",
    label: "Zotero Local API provider",
    configured: false,
    available: false,
    requiresExternalConfiguration: true,
    message: "Zotero Local reachability checks are disabled in the skeleton phase.",
  };
}

export async function importFromZoteroLocalPlaceholder() {
  return {
    ok: false,
    code: "PROVIDER_UNCONFIGURED",
    message: "Zotero Local provider is a placeholder and does not call localhost in this phase.",
  };
}
