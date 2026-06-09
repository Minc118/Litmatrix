import "server-only";

import { getServerEnv } from "@/lib/server/config/env";
import type { ProviderCapability } from "@/lib/types/litmatrix";

export function getGeminiProviderStatus(): ProviderCapability {
  const env = getServerEnv();
  return {
    id: "gemini",
    label: "Gemini provider",
    configured: env.geminiConfigured,
    available: false,
    requiresExternalConfiguration: true,
    message: env.geminiConfigured
      ? "Configuration detected, but Gemini calls are disabled in the skeleton phase."
      : "GEMINI_API_KEY is not configured.",
  };
}

export async function runGeminiAnalysisPlaceholder() {
  return {
    ok: false,
    code: "PROVIDER_UNCONFIGURED",
    message: "Gemini provider is a placeholder and does not call external APIs in this phase.",
  };
}
