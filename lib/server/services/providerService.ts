import "server-only";

import { getServerEnv } from "@/lib/server/config/env";
import { getAntigravityImporterStatus } from "@/lib/server/importers/antigravityJsonImporter";
import { getGeminiProviderStatus } from "@/lib/server/providers/geminiProvider";
import { getPdfParserProviderStatus } from "@/lib/server/providers/pdfParserProvider";
import { getZoteroLocalProviderStatus } from "@/lib/server/providers/zoteroLocalProvider";
import { getZoteroWebProviderStatus } from "@/lib/server/providers/zoteroWebProvider";
import type { ProviderStatusResponse } from "@/lib/types/litmatrix";

export async function getProviderStatus(): Promise<ProviderStatusResponse> {
  const env = getServerEnv();
  return {
    demoMode: env.demoMode,
    providers: [
      getGeminiProviderStatus(),
      getZoteroLocalProviderStatus(),
      getZoteroWebProviderStatus(),
      getPdfParserProviderStatus(),
    ],
    importers: [getAntigravityImporterStatus()],
    generatedAt: new Date().toISOString(),
  };
}
