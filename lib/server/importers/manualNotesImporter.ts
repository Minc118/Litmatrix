import "server-only";

export async function importManualNotesPlaceholder() {
  return {
    ok: false,
    code: "DEMO_MODE_READ_ONLY",
    message: "Manual notes import is not implemented in the skeleton phase.",
  };
}
