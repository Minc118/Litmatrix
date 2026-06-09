import "server-only";

export async function exportMarkdownPlaceholder() {
  return {
    status: "not-implemented" as const,
    message: "Markdown export is not implemented in the skeleton phase.",
  };
}

export async function exportCsvPlaceholder() {
  return {
    status: "not-implemented" as const,
    message: "CSV export is not implemented in the skeleton phase.",
  };
}

export async function exportJsonPlaceholder() {
  return {
    status: "not-implemented" as const,
    message: "JSON export is not implemented in the skeleton phase.",
  };
}
