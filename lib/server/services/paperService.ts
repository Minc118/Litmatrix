import "server-only";

import * as paperRepository from "@/lib/server/repositories/paperRepository";
import * as analysisRepository from "@/lib/server/repositories/analysisRepository";
import type { Paper, PaperOverview } from "@/lib/types/litmatrix";

export async function listProjectPapers(projectId: string) {
  return paperRepository.listPapersByProjectId(projectId);
}

export async function getProjectPaper(projectId: string, paperId: string) {
  return paperRepository.getPaperById(projectId, paperId);
}

export async function createPaperFromUpload(projectId: string, fileName: string): Promise<Paper> {
  const paperId = `paper-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  const title = fileName.replace(/\.[^/.]+$/, "");

  const paper: Paper = {
    id: paperId,
    projectId,
    title,
    authors: ["Unknown Author"],
    year: new Date().getFullYear(),
    venue: "Uploaded PDF",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  await paperRepository.savePaper(paper);

  const overviewId = `overview-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  const overview: PaperOverview = {
    id: overviewId,
    projectId,
    paperId,
    analysisSource: "pdf-parser",
    evidenceLevel: "metadata-only",
    status: "pending-review",
    confidence: "medium",
    problem: "PDF uploaded, text extraction not yet available",
    objective: "PDF uploaded, text extraction not yet available",
    method: "PDF uploaded, text extraction not yet available",
    dataset: "PDF uploaded, text extraction not yet available",
    findings: "PDF uploaded, text extraction not yet available",
    limitations: "PDF uploaded, text extraction not yet available",
    evidence: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  await analysisRepository.insertPaperOverview(overview);

  return paper;
}

function parseZoteroRDF(rdfText: string) {
  const papersList: Array<{ title: string; authors: string[]; year: number | null }> = [];
  const items = rdfText.split(/<bib:Article|<bib:Book|<bib:BookSection|<bib:Document|<foaf:Document|<rdf:Description/);

  for (let i = 1; i < items.length; i++) {
    const block = items[i];
    const titleMatch = block.match(/<dc:title[^>]*>([\s\S]*?)<\/dc:title>/i);
    if (!titleMatch) continue;
    const title = titleMatch[1].trim();

    const dateMatch = block.match(/<dc:date[^>]*>([\s\S]*?)<\/dc:date>/i);
    let year: number | null = null;
    if (dateMatch) {
      const yearStr = dateMatch[1].trim();
      const yr = parseInt(yearStr.substring(0, 4));
      if (!isNaN(yr)) {
        year = yr;
      }
    }

    const authors: string[] = [];
    const surnameMatches = [...block.matchAll(/<foaf:surname[^>]*>([\s\S]*?)<\/foaf:surname>/gi)];
    const givennameMatches = [...block.matchAll(/<foaf:givenname[^>]*>([\s\S]*?)<\/foaf:givenname>/gi)];

    for (let k = 0; k < surnameMatches.length; k++) {
      const surname = surnameMatches[k][1].trim();
      const given = givennameMatches[k] ? givennameMatches[k][1].trim() : "";
      authors.push(given ? `${given} ${surname}` : surname);
    }

    if (authors.length === 0) {
      const creatorMatches = [...block.matchAll(/<dc:creator[^>]*>([\s\S]*?)<\/dc:creator>/gi)];
      for (const cm of creatorMatches) {
        const creatorText = cm[1].replace(/<[^>]*>/g, "").trim();
        if (creatorText) {
          authors.push(creatorText);
        }
      }
    }

    papersList.push({ title, authors, year });
  }

  return papersList;
}

export async function importZoteroRDF(projectId: string, rdfText: string): Promise<Paper[]> {
  const parsed = parseZoteroRDF(rdfText);
  const importedPapers: Paper[] = [];

  for (const item of parsed) {
    const paperId = `paper-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
    const paper: Paper = {
      id: paperId,
      projectId,
      title: item.title,
      authors: item.authors.length > 0 ? item.authors : ["Unknown Author"],
      year: item.year,
      venue: "Zotero RDF Import",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await paperRepository.savePaper(paper);

    const overviewId = `overview-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
    const overview: PaperOverview = {
      id: overviewId,
      projectId,
      paperId,
      analysisSource: "zotero-local",
      evidenceLevel: "metadata-only",
      status: "pending-review",
      confidence: "medium",
      problem: "Zotero RDF imported, text extraction not yet available",
      objective: "Zotero RDF imported, text extraction not yet available",
      method: "Zotero RDF imported, text extraction not yet available",
      dataset: "Zotero RDF imported, text extraction not yet available",
      findings: "Zotero RDF imported, text extraction not yet available",
      limitations: "Zotero RDF imported, text extraction not yet available",
      evidence: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await analysisRepository.insertPaperOverview(overview);
    importedPapers.push(paper);
  }

  return importedPapers;
}

