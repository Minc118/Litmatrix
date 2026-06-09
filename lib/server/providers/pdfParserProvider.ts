import "server-only";

import type { ProviderCapability } from "@/lib/types/litmatrix";

export function getPdfParserProviderStatus(): ProviderCapability {
  return {
    id: "pdf-parser",
    label: "PDF parser provider",
    configured: false,
    available: false,
    requiresExternalConfiguration: true,
    message: "PDF parsing is planned but not available in the skeleton phase.",
  };
}

export async function parsePdfPlaceholder() {
  return {
    ok: false,
    code: "PROVIDER_UNCONFIGURED",
    message: "PDF parser provider is not implemented in this phase.",
  };
}
