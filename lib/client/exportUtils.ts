import type { ExtractionMatrixRow, Paper } from "@/lib/types/litmatrix";

export function exportToCSV(rows: ExtractionMatrixRow[], papers: Paper[]) {
  const paperMap = new Map(papers.map((p) => [p.id, p.title]));
  
  const headers = [
    "Paper Title",
    "Field Label",
    "Field Key",
    "Suggested Value",
    "Confirmed Value",
    "Review Status",
    "Confidence",
    "Evidence Level",
    "Evidence Quotes",
    "Page Locators",
  ];

  const csvRows = [headers.join(",")];

  for (const row of rows) {
    const paperTitle = paperMap.get(row.paperId) || row.paperId;
    const quotes = (row.evidence || [])
      .map((e) => e.quote || "")
      .filter(Boolean)
      .join(" | ");
    const pages = (row.evidence || [])
      .map((e) => (e.page ? `p. ${e.page}` : ""))
      .filter(Boolean)
      .join(" | ");

    const line = [
      escapeCsvCell(paperTitle),
      escapeCsvCell(row.fieldLabel),
      escapeCsvCell(row.fieldKey),
      escapeCsvCell(row.suggestedValue || ""),
      escapeCsvCell(row.confirmedValue || ""),
      escapeCsvCell(row.status),
      escapeCsvCell(row.confidence),
      escapeCsvCell(row.evidenceLevel),
      escapeCsvCell(quotes),
      escapeCsvCell(pages),
    ];
    csvRows.push(line.join(","));
  }

  downloadFile("litmatrix-extraction-matrix.csv", csvRows.join("\n"), "text/csv");
}

export function exportToMarkdown(rows: ExtractionMatrixRow[], papers: Paper[], projectTitle: string) {
  const paperMap = new Map(papers.map((p) => [p.id, p]));
  
  let md = `# LitMatrix Extraction Report: ${projectTitle}\n\n`;
  md += `Generated on: ${new Date().toLocaleDateString()}\n\n`;

  // Group by paper
  const rowsByPaper: Record<string, ExtractionMatrixRow[]> = {};
  for (const row of rows) {
    if (!rowsByPaper[row.paperId]) {
      rowsByPaper[row.paperId] = [];
    }
    rowsByPaper[row.paperId].push(row);
  }

  for (const paperId of Object.keys(rowsByPaper)) {
    const paper = paperMap.get(paperId);
    md += `## Paper: ${paper?.title || paperId}\n`;
    if (paper?.authors && paper.authors.length > 0) {
      md += `*Authors: ${paper.authors.join(", ")} (${paper.year || "Year unknown"})*\n\n`;
    }
    
    md += `| Field | Confirmed Value | Suggested Value | Status | Evidence Quote / Source |\n`;
    md += `| :--- | :--- | :--- | :--- | :--- |\n`;

    for (const row of rowsByPaper[paperId]) {
      const quoteStr = (row.evidence || [])
        .map((e) => {
          let str = "";
          if (e.quote) str += `"${e.quote}"`;
          if (e.page || e.section) {
            str += ` (${[e.section ? `Sec. ${e.section}` : "", e.page ? `p. ${e.page}` : ""].filter(Boolean).join(", ")})`;
          }
          return str;
        })
        .filter(Boolean)
        .join("; ");

      md += `| **${row.fieldLabel}** | ${row.confirmedValue || "*Not confirmed*"} | ${row.suggestedValue || "Not specified"} | \`${row.status}\` | ${quoteStr || "None"} |\n`;
    }
    md += `\n---\n\n`;
  }

  downloadFile("litmatrix-extraction-report.md", md, "text/markdown");
}

export function exportToJsonBundle(rows: ExtractionMatrixRow[], papers: Paper[], projectContract: Record<string, unknown> | null | undefined) {
  const bundle = {
    projectId: projectContract?.projectId || "unknown",
    exportedAt: new Date().toISOString(),
    contract: projectContract,
    papers: papers.map((p) => ({
      id: p.id,
      title: p.title,
      authors: p.authors,
      year: p.year,
      venue: p.venue,
    })),
    extractionMatrixRows: rows.map((r) => ({
      id: r.id,
      paperId: r.paperId,
      fieldKey: r.fieldKey,
      fieldLabel: r.fieldLabel,
      suggestedValue: r.suggestedValue,
      confirmedValue: r.confirmedValue,
      status: r.status,
      confidence: r.confidence,
      evidenceLevel: r.evidenceLevel,
      evidence: r.evidence,
    })),
  };

  downloadFile("litmatrix-export-bundle.json", JSON.stringify(bundle, null, 2), "application/json");
}

function escapeCsvCell(val: string): string {
  const clean = val.replace(/"/g, '""');
  return `"${clean}"`;
}

function downloadFile(filename: string, content: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
