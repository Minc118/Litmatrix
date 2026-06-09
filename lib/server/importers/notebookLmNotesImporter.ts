import "server-only";

export async function importNotebookLmNotesPlaceholder() {
  return {
    ok: false,
    code: "DEMO_MODE_READ_ONLY",
    message: "NotebookLM notes import is planned but not implemented in the skeleton phase.",
  };
}
