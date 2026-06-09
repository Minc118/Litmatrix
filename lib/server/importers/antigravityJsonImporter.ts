import "server-only";

import { getServerEnv } from "@/lib/server/config/env";
import type { ProviderCapability } from "@/lib/types/litmatrix";

export function getAntigravityImporterStatus(): ProviderCapability {
  const env = getServerEnv();
  return {
    id: "antigravity-import",
    label: "Antigravity JSON importer",
    configured: env.antigravityImportEnabled,
    available: false,
    requiresExternalConfiguration: false,
    message: env.antigravityImportEnabled
      ? "Importer placeholder is enabled, but JSON ingestion is not implemented in this phase."
      : "Antigravity import is disabled by configuration.",
  };
}

export async function importAntigravityJsonPlaceholder() {
  return {
    ok: false,
    code: "DEMO_MODE_READ_ONLY",
    message: "Antigravity JSON import is a placeholder and does not ingest files in this phase.",
  };
}
