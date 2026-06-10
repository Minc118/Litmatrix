import "server-only";

import { GoogleGenAI } from "@google/genai";
import { getServerEnv } from "@/lib/server/config/env";
import type { Confidence, Paper, ProjectDetail, ProviderCapability } from "@/lib/types/litmatrix";

export type GeminiProviderResult<T> =
  | { ok: true; data: T }
  | { ok: false; code: "PROVIDER_UNCONFIGURED" | "PROVIDER_FAILED"; message: string; status: number };

export type GeminiOverviewDraft = {
  problem: string | null;
  objective: string | null;
  method: string | null;
  dataset: string | null;
  findings: string | null;
  limitations: string | null;
  confidence: Confidence;
};

export type GeminiExtractionDraft = {
  title: string;
  content: string;
  targetField: string;
  confidence: Confidence;
};

const missing = "Not specified in the provided text.";
const confidenceValues: Confidence[] = ["high", "medium", "low", "tentative"];

export function getGeminiProviderStatus(): ProviderCapability {
  const env = getServerEnv();
  const configured = env.geminiConfigured && env.geminiModelConfigured;

  return {
    id: "gemini",
    label: "Gemini provider",
    configured,
    available: configured,
    requiresExternalConfiguration: true,
    message: configured
      ? "Gemini is configured for server-side analysis generation."
      : "GEMINI_API_KEY and GEMINI_MODEL are required for Gemini analysis.",
  };
}

function getGeminiClient(): GeminiProviderResult<{ client: GoogleGenAI; model: string }> {
  const apiKey = process.env.GEMINI_API_KEY;
  const model = process.env.GEMINI_MODEL;

  if (!apiKey || !model) {
    return {
      ok: false,
      code: "PROVIDER_UNCONFIGURED",
      message: "Gemini provider is not configured.",
      status: 503,
    };
  }

  return {
    ok: true,
    data: {
      client: new GoogleGenAI({ apiKey }),
      model,
    },
  };
}

function extractJson(text: string): unknown {
  const trimmed = text.trim();
  const fenced = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/i);
  const candidate = fenced?.[1]?.trim() ?? trimmed;
  return JSON.parse(candidate) as unknown;
}

function normalizeConfidence(value: unknown, fallback: Confidence): Confidence {
  return typeof value === "string" && confidenceValues.includes(value as Confidence)
    ? (value as Confidence)
    : fallback;
}

function normalizeText(value: unknown): string {
  return typeof value === "string" && value.trim().length > 0 ? value.trim() : missing;
}

function buildPaperContext(project: ProjectDetail, paper: Paper): string {
  const researchQuestions = project.researchQuestions.map((question) => `- ${question.text}`).join("\n");
  return [
    `Project: ${project.title}`,
    `Research questions:\n${researchQuestions || "- Not specified"}`,
    `Paper ID: ${paper.id}`,
    `Title: ${paper.title}`,
    `Authors: ${(paper.authors ?? []).join(", ") || "Not specified"}`,
    `Year: ${paper.year ?? "Not specified"}`,
    `Venue: ${paper.venue ?? "Not specified"}`,
    `Abstract: ${paper.abstract ?? missing}`,
  ].join("\n\n");
}

export async function generateGeminiOverviewDraft(
  project: ProjectDetail,
  paper: Paper,
): Promise<GeminiProviderResult<GeminiOverviewDraft>> {
  const clientState = getGeminiClient();
  if (!clientState.ok) {
    return clientState;
  }

  try {
    const response = await clientState.data.client.models.generateContent({
      model: clientState.data.model,
      contents: `${buildPaperContext(project, paper)}

Return only JSON with this exact shape:
{
  "problem": "string or null",
  "objective": "string or null",
  "method": "string or null",
  "dataset": "string or null",
  "findings": "string or null",
  "limitations": "string or null",
  "confidence": "high | medium | low | tentative"
}

Academic safety rules:
- Do not fabricate citations, page numbers, exact quotes, methods, datasets, results, or findings.
- If a field is not supported by the provided metadata or abstract, use "${missing}".
- Keep confidence conservative.`,
    });

    const parsed = extractJson(response.text ?? "");

    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
      throw new Error("Unexpected Gemini overview JSON.");
    }

    const value = parsed as Record<string, unknown>;
    return {
      ok: true,
      data: {
        problem: normalizeText(value.problem),
        objective: normalizeText(value.objective),
        method: normalizeText(value.method),
        dataset: normalizeText(value.dataset),
        findings: normalizeText(value.findings),
        limitations: normalizeText(value.limitations),
        confidence: normalizeConfidence(value.confidence, paper.abstract ? "medium" : "tentative"),
      },
    };
  } catch {
    return {
      ok: false,
      code: "PROVIDER_FAILED",
      message: "Gemini overview generation failed.",
      status: 502,
    };
  }
}

export async function generateGeminiExtractionDrafts(
  project: ProjectDetail,
  paper: Paper,
): Promise<GeminiProviderResult<GeminiExtractionDraft[]>> {
  const clientState = getGeminiClient();
  if (!clientState.ok) {
    return clientState;
  }

  try {
    const response = await clientState.data.client.models.generateContent({
      model: clientState.data.model,
      contents: `${buildPaperContext(project, paper)}

Return only JSON with this exact shape:
{
  "suggestions": [
    {
      "title": "short label",
      "content": "supported extraction text",
      "targetField": "problem | objective | method | dataset | findings | limitations | researchGap | theme",
      "confidence": "high | medium | low | tentative"
    }
  ]
}

Academic safety rules:
- Create suggestions only from the provided metadata and abstract.
- Do not fabricate citations, page numbers, exact quotes, methods, datasets, results, or findings.
- If a target field is not supported, omit that suggestion.
- Keep confidence conservative.`,
    });

    const parsed = extractJson(response.text ?? "");

    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
      throw new Error("Unexpected Gemini extraction JSON.");
    }

    const suggestions = (parsed as Record<string, unknown>).suggestions;
    if (!Array.isArray(suggestions)) {
      throw new Error("Missing suggestions array.");
    }

    return {
      ok: true,
      data: suggestions
        .filter((item): item is Record<string, unknown> => Boolean(item) && typeof item === "object")
        .map((item) => ({
          title: normalizeText(item.title),
          content: normalizeText(item.content),
          targetField: normalizeText(item.targetField),
          confidence: normalizeConfidence(item.confidence, paper.abstract ? "medium" : "tentative"),
        }))
        .filter((item) => item.content !== missing && item.targetField !== missing),
    };
  } catch {
    return {
      ok: false,
      code: "PROVIDER_FAILED",
      message: "Gemini extraction generation failed.",
      status: 502,
    };
  }
}
