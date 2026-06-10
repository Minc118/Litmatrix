import "server-only";

import * as analysisRepository from "@/lib/server/repositories/analysisRepository";
import * as paperRepository from "@/lib/server/repositories/paperRepository";
import * as projectRepository from "@/lib/server/repositories/projectRepository";
import {
  generateGeminiExtractionDrafts,
  generateGeminiOverviewDraft,
} from "@/lib/server/providers/geminiProvider";
import { getMutationDbState, mutationUnavailableResult, type MutationResult } from "@/lib/server/db/fallback";
import type { AISuggestion, ReviewStatus } from "@/lib/types/litmatrix";

export async function listProjectOverviews(projectId: string, paperId?: string | null) {
  return analysisRepository.listPaperOverviews(projectId, paperId);
}

export async function listProjectSuggestions(
  projectId: string,
  filters: {
    paperId?: string | null;
    suggestionType?: AISuggestion["suggestionType"] | null;
    status?: ReviewStatus | null;
  } = {},
) {
  return analysisRepository.listAISuggestions(projectId, filters);
}

export async function generateOverviewAnalysis(input: {
  projectId: string;
  paperId: string;
}): Promise<MutationResult<{ overviewId: string }>> {
  const dbState = getMutationDbState();
  if (!dbState.ok) {
    return mutationUnavailableResult(dbState);
  }

  const [project, paper] = await Promise.all([
    projectRepository.getProjectById(input.projectId),
    paperRepository.getPaperById(input.projectId, input.paperId),
  ]);

  if (!project || !paper) {
    return {
      ok: false,
      code: "NOT_FOUND",
      message: "Project or paper not found.",
      status: 404,
    };
  }

  const postReadDbState = getMutationDbState();
  if (!postReadDbState.ok) {
    return mutationUnavailableResult(postReadDbState);
  }

  const draft = await generateGeminiOverviewDraft(project, paper);
  if (!draft.ok) {
    return draft;
  }

  const timestamp = new Date().toISOString();
  const saved = await analysisRepository.insertPaperOverview({
    id: `overview-${paper.id}-${Date.now()}`,
    projectId: project.id,
    paperId: paper.id,
    analysisSource: "gemini-api",
    evidenceLevel: paper.abstract ? "abstract-based" : "metadata-only",
    status: "pending-review",
    confidence: draft.data.confidence,
    problem: draft.data.problem,
    objective: draft.data.objective,
    method: draft.data.method,
    dataset: draft.data.dataset,
    findings: draft.data.findings,
    limitations: draft.data.limitations,
    evidence: [
      {
        paperId: paper.id,
        sourceField: paper.abstract ? "abstract" : "metadata",
        note: paper.abstract
          ? "Gemini overview generated from paper metadata and abstract."
          : "Gemini overview generated from paper metadata only.",
      },
    ],
    createdAt: timestamp,
    updatedAt: timestamp,
  });

  if (!saved.ok) {
    return saved;
  }

  return { ok: true, data: { overviewId: saved.data.id } };
}

export async function generateExtractionAnalysis(input: {
  projectId: string;
  paperId: string;
}): Promise<MutationResult<{ suggestionIds: string[] }>> {
  const dbState = getMutationDbState();
  if (!dbState.ok) {
    return mutationUnavailableResult(dbState);
  }

  const [project, paper] = await Promise.all([
    projectRepository.getProjectById(input.projectId),
    paperRepository.getPaperById(input.projectId, input.paperId),
  ]);

  if (!project || !paper) {
    return {
      ok: false,
      code: "NOT_FOUND",
      message: "Project or paper not found.",
      status: 404,
    };
  }

  const postReadDbState = getMutationDbState();
  if (!postReadDbState.ok) {
    return mutationUnavailableResult(postReadDbState);
  }

  const drafts = await generateGeminiExtractionDrafts(project, paper);
  if (!drafts.ok) {
    return drafts;
  }

  const timestamp = new Date().toISOString();
  const saved = await analysisRepository.insertAISuggestions(
    drafts.data.map((draft, index) => ({
      id: `suggestion-gemini-${paper.id}-${Date.now()}-${index}`,
      projectId: project.id,
      paperId: paper.id,
      analysisSource: "gemini-api",
      evidenceLevel: paper.abstract ? "abstract-based" : "metadata-only",
      status: "pending-review",
      confidence: draft.confidence,
      suggestionType: "extraction-field",
      title: draft.title,
      content: draft.content,
      targetField: draft.targetField,
      evidence: [
        {
          paperId: paper.id,
          sourceField: paper.abstract ? "abstract" : "metadata",
          note: paper.abstract
            ? "Gemini extraction suggestion generated from paper metadata and abstract."
            : "Gemini extraction suggestion generated from paper metadata only.",
        },
      ],
      createdAt: timestamp,
      updatedAt: timestamp,
    })),
  );

  if (!saved.ok) {
    return saved;
  }

  return { ok: true, data: { suggestionIds: saved.data.map((suggestion) => suggestion.id) } };
}
