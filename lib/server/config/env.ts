import "server-only";

import { isDemoModeEnabled } from "@/lib/server/config/demoMode";

export type ServerEnv = {
  appName: string;
  demoMode: boolean;
  databaseConfigured: boolean;
  geminiConfigured: boolean;
  geminiModelConfigured: boolean;
  zoteroLocalApiUrlConfigured: boolean;
  zoteroWebConfigured: boolean;
  antigravityImportEnabled: boolean;
  pdfParserAvailable: boolean;
};

export function getServerEnv(): ServerEnv {
  return {
    appName: process.env.NEXT_PUBLIC_APP_NAME || "LitMatrix",
    demoMode: isDemoModeEnabled(),
    databaseConfigured: Boolean(process.env.DATABASE_URL),
    geminiConfigured: Boolean(process.env.GEMINI_API_KEY),
    geminiModelConfigured: Boolean(process.env.GEMINI_MODEL),
    zoteroLocalApiUrlConfigured: Boolean(process.env.ZOTERO_LOCAL_API_URL),
    zoteroWebConfigured: Boolean(process.env.ZOTERO_API_KEY && process.env.ZOTERO_USER_ID),
    antigravityImportEnabled: process.env.ANTIGRAVITY_IMPORT_ENABLED !== "false",
    pdfParserAvailable: false,
  };
}
