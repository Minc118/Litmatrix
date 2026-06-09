import "server-only";

import { importAntigravityJsonPlaceholder } from "@/lib/server/importers/antigravityJsonImporter";
import { importManualNotesPlaceholder } from "@/lib/server/importers/manualNotesImporter";
import { importNotebookLmNotesPlaceholder } from "@/lib/server/importers/notebookLmNotesImporter";
import * as importJobRepository from "@/lib/server/repositories/importJobRepository";

export async function listProjectImportJobs(projectId: string) {
  return importJobRepository.listImportJobs(projectId);
}

export async function importAntigravityJson() {
  return importAntigravityJsonPlaceholder();
}

export async function importManualNotes() {
  return importManualNotesPlaceholder();
}

export async function importNotebookLmNotes() {
  return importNotebookLmNotesPlaceholder();
}
