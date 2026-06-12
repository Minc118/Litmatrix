import { dataResponse, errorResponse } from "@/lib/server/http";
import { listProjectPapers, createPaperFromUpload, importZoteroRDF } from "@/lib/server/services/paperService";
import { NextRequest } from "next/server";
import { withProjectOwner } from "@/lib/auth/owner";

type ProjectRouteContext = {
  params: Promise<{ projectId: string }>;
};

export const GET = withProjectOwner(async (_request: NextRequest, context: ProjectRouteContext) => {
  const { projectId } = await context.params;
  return dataResponse(await listProjectPapers(projectId));
});

export const POST = withProjectOwner(async (req: NextRequest, context: ProjectRouteContext) => {
  try {
    const { projectId } = await context.params;
    const contentType = req.headers.get("content-type") || "";

    if (contentType.includes("multipart/form-data")) {
      const formData = await req.formData();
      const file = formData.get("file") as File;
      if (!file) {
        return errorResponse("INVALID_INPUT", "No file uploaded.", 400);
      }

      if (file.name.endsWith(".rdf")) {
        const text = await file.text();
        const papersList = await importZoteroRDF(projectId, text);
        return dataResponse({ message: `Imported ${papersList.length} papers from Zotero RDF.`, papers: papersList });
      } else {
        const paper = await createPaperFromUpload(projectId, file.name);
        return dataResponse({ message: "PDF uploaded successfully.", paper });
      }
    } else {
      const body = await req.json();
      const { title, authors, year, venue } = body;
      if (!title) {
        return errorResponse("INVALID_INPUT", "Title is required.", 400);
      }

      const paperId = `paper-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
      const paper = {
        id: paperId,
        projectId,
        title,
        authors: authors || ["Unknown Author"],
        year: year || new Date().getFullYear(),
        venue: venue || "Manual entry",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const { savePaper } = await import("@/lib/server/repositories/paperRepository");
      await savePaper(paper);

      const { insertPaperOverview } = await import("@/lib/server/repositories/analysisRepository");
      const overviewId = `overview-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
      const overview = {
        id: overviewId,
        projectId,
        paperId,
        analysisSource: "manual" as const,
        evidenceLevel: "user-notes" as const,
        status: "pending-review" as const,
        confidence: "high" as const,
        problem: "Manually entered paper, text extraction not yet available",
        objective: "Manually entered paper, text extraction not yet available",
        method: "Manually entered paper, text extraction not yet available",
        dataset: "Manually entered paper, text extraction not yet available",
        findings: "Manually entered paper, text extraction not yet available",
        limitations: "Manually entered paper, text extraction not yet available",
        evidence: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      await insertPaperOverview(overview);

      return dataResponse({ message: "Paper created successfully.", paper });
    }
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Failed to add paper";
    return errorResponse("SERVER_ERROR", msg, 500);
  }
});

