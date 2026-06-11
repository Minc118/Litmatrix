import "server-only";

import {
  importAntigravityJson as importAntigravityJsonReal,
  type ImporterResult,
} from "@/lib/server/importers/antigravityJsonImporter";
import { importManualNotesPlaceholder } from "@/lib/server/importers/manualNotesImporter";
import { importNotebookLmNotesPlaceholder } from "@/lib/server/importers/notebookLmNotesImporter";
import * as importJobRepository from "@/lib/server/repositories/importJobRepository";

export async function listProjectImportJobs(projectId: string) {
  return importJobRepository.listImportJobs(projectId);
}

export async function importAntigravityJson(payload: unknown): Promise<ImporterResult> {
  return importAntigravityJsonReal(payload);
}

export async function importManualNotes() {
  return importManualNotesPlaceholder();
}

export async function importNotebookLmNotes() {
  return importNotebookLmNotesPlaceholder();
}
