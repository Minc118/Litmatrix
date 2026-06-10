import "server-only";

import { getOptionalDb, isDatabaseConfigured, type LitMatrixDb } from "@/lib/server/db/client";

export type MutationDbState =
  | { ok: true; db: LitMatrixDb }
  | { ok: false; code: "DEMO_MODE_READ_ONLY" | "DATABASE_UNAVAILABLE"; message: string; status: number };

export type MutationResult<T> =
  | { ok: true; data: T }
  | { ok: false; code: string; message: string; status: number };

export function mutationUnavailableResult<T>(state: Exclude<MutationDbState, { ok: true }>): MutationResult<T> {
  return {
    ok: false,
    code: state.code,
    message: state.message,
    status: state.status,
  };
}

let databaseReadFailed = false;

export async function withDatabaseReadFallback<T>(
  dbRead: (db: LitMatrixDb) => Promise<T>,
  demoRead: () => T | Promise<T>,
): Promise<T> {
  const db = getOptionalDb();

  if (!db) {
    return demoRead();
  }

  try {
    return await dbRead(db);
  } catch {
    databaseReadFailed = true;
    return demoRead();
  }
}

export function getMutationDbState(): MutationDbState {
  const db = getOptionalDb();

  if (db && !databaseReadFailed) {
    return { ok: true, db };
  }

  if (isDatabaseConfigured()) {
    return {
      ok: false,
      code: "DATABASE_UNAVAILABLE",
      message: "Database is configured but unavailable.",
      status: 503,
    };
  }

  return {
    ok: false,
    code: "DEMO_MODE_READ_ONLY",
    message: "Database persistence is not configured; demo mode is read-only.",
    status: 403,
  };
}
