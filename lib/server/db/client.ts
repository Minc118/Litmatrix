import "server-only";

import { neon } from "@neondatabase/serverless";
import { drizzle, type NeonHttpDatabase } from "drizzle-orm/neon-http";
import * as schema from "@/lib/server/db/schema";

export type LitMatrixDb = NeonHttpDatabase<typeof schema>;

let cachedDb: LitMatrixDb | null = null;
let cachedUrl: string | null = null;

export function getDatabaseUrl(): string | null {
  const value = process.env.DATABASE_URL?.trim();
  return value && value.length > 0 ? value : null;
}

export function isDatabaseConfigured(): boolean {
  return Boolean(getDatabaseUrl());
}

export function getOptionalDb(): LitMatrixDb | null {
  const databaseUrl = getDatabaseUrl();

  if (!databaseUrl) {
    return null;
  }

  if (!cachedDb || cachedUrl !== databaseUrl) {
    const sql = neon(databaseUrl);
    cachedDb = drizzle(sql, { schema });
    cachedUrl = databaseUrl;
  }

  return cachedDb;
}
