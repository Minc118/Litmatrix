import type {
  AISuggestion,
  ApiError,
  ApiSuccess,
  ArgumentCandidate,
  ConsensusConflictItem,
  ExtractionMatrixRow,
  GapItem,
  InnovationOpportunity,
  Paper,
  PaperOverview,
  PresentationPlan,
  Project,
  ProjectDetail,
  ProviderStatusResponse,
  ReviewDecision,
  ThemeCluster,
  WritingPlan,
} from "@/lib/types/litmatrix";

export class LitMatrixApiError extends Error {
  code: string;
  details?: Record<string, unknown>;
  status: number;

  constructor(error: ApiError["error"], status: number) {
    super(error.message);
    this.name = "LitMatrixApiError";
    this.code = error.code;
    this.details = error.details;
    this.status = status;
  }
}

export async function apiGet<T>(path: string, init: RequestInit = {}): Promise<T> {
  const response = await fetch(path, {
    ...init,
    method: "GET",
    headers: {
      Accept: "application/json",
      ...init.headers,
    },
  });

  const payload = (await response.json()) as ApiSuccess<T> | ApiError;

  if (!response.ok || "error" in payload) {
    const error =
      "error" in payload
        ? payload.error
        : { code: "REQUEST_FAILED", message: "Request failed.", details: {} };
    throw new LitMatrixApiError(error, response.status);
  }

  return payload.data;
}

async function apiWrite<T>(method: "POST" | "PATCH", path: string, body: unknown): Promise<T> {
  const response = await fetch(path, {
    method,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  const payload = (await response.json()) as ApiSuccess<T> | ApiError;

  if (!response.ok || "error" in payload) {
    const error =
      "error" in payload
        ? payload.error
        : { code: "REQUEST_FAILED", message: "Request failed.", details: {} };
    throw new LitMatrixApiError(error, response.status);
  }

  return payload.data;
}

export const litmatrixClient = {
  listProjects: () => apiGet<Project[]>("/api/projects"),
  getProject: (projectId: string) => apiGet<ProjectDetail>(`/api/projects/${projectId}`),
  listPapers: (projectId: string) => apiGet<Paper[]>(`/api/projects/${projectId}/papers`),
  listOverviews: (projectId: string) => apiGet<PaperOverview[]>(`/api/projects/${projectId}/overviews`),
  listSuggestions: (projectId: string) =>
    apiGet<AISuggestion[]>(`/api/projects/${projectId}/suggestions`),
  listReviewDecisions: (projectId: string) =>
    apiGet<ReviewDecision[]>(`/api/projects/${projectId}/review-decisions`),
  listExtractionMatrixRows: (projectId: string) =>
    apiGet<ExtractionMatrixRow[]>(`/api/projects/${projectId}/extraction-matrix`),
  listThemeClusters: (projectId: string) =>
    apiGet<ThemeCluster[]>(`/api/projects/${projectId}/theme-clusters`),
  listConsensusConflictItems: (projectId: string) =>
    apiGet<ConsensusConflictItem[]>(`/api/projects/${projectId}/consensus-conflict`),
  listGaps: (projectId: string) => apiGet<GapItem[]>(`/api/projects/${projectId}/gaps`),
  listArguments: (projectId: string) =>
    apiGet<ArgumentCandidate[]>(`/api/projects/${projectId}/arguments`),
  listInnovationOpportunities: (projectId: string) =>
    apiGet<InnovationOpportunity[]>(`/api/projects/${projectId}/innovation-opportunities`),
  getWritingPlan: (projectId: string) =>
    apiGet<WritingPlan | null>(`/api/projects/${projectId}/writing-plan`),
  getPresentationPlan: (projectId: string) =>
    apiGet<PresentationPlan | null>(`/api/projects/${projectId}/presentation-plan`),
  getProviderStatus: () => apiGet<ProviderStatusResponse>("/api/providers/status"),
  createReviewDecision: (input: {
    suggestionId: string;
    decision: ReviewDecision["decision"];
    editedContent?: string | null;
    reviewerNote?: string | null;
  }) =>
    apiWrite<{
      decision: ReviewDecision;
      updatedSuggestionId: string;
      matrixRow?: ExtractionMatrixRow;
    }>("POST", "/api/review-decisions", input),
  updateSuggestion: (
    suggestionId: string,
    input: Partial<Pick<AISuggestion, "status" | "title" | "content">>,
  ) => apiWrite<AISuggestion>("PATCH", `/api/ai-suggestions/${suggestionId}`, input),
  updateExtractionMatrixRow: (rowId: string, confirmedValue: string | null) =>
    apiWrite<ExtractionMatrixRow>("PATCH", `/api/extraction-matrix/${rowId}`, { confirmedValue }),
  generateOverview: (projectId: string, paperId: string) =>
    apiWrite<{ overviewId: string }>("POST", "/api/analysis/overview", { projectId, paperId }),
  generateExtraction: (projectId: string, paperId: string) =>
    apiWrite<{ suggestionIds: string[] }>("POST", "/api/analysis/extraction", { projectId, paperId }),
};
