import "server-only";

import { getServerEnv } from "@/lib/server/config/env";
import { getMutationDbState } from "@/lib/server/db/fallback";
import * as projectRepository from "@/lib/server/repositories/projectRepository";
import * as paperRepository from "@/lib/server/repositories/paperRepository";
import * as analysisRepository from "@/lib/server/repositories/analysisRepository";
import * as matrixRepository from "@/lib/server/repositories/matrixRepository";
import * as synthesisRepository from "@/lib/server/repositories/synthesisRepository";
import * as importJobRepository from "@/lib/server/repositories/importJobRepository";
import {
  antigravityPayloadSchema,
  normalizeAnalysisMetadata,
} from "@/lib/server/validators/antigravityValidator";
import type { ImportJob, ProviderCapability, PaperOverview, ExtractionMatrixRow } from "@/lib/types/litmatrix";

export function getAntigravityImporterStatus(): ProviderCapability {
  const env = getServerEnv();
  return {
    id: "antigravity-import",
    label: "Antigravity JSON importer",
    configured: env.antigravityImportEnabled,
    available: env.antigravityImportEnabled,
    requiresExternalConfiguration: false,
    message: env.antigravityImportEnabled
      ? "Antigravity JSON importer is active and ready to import files."
      : "Antigravity import is disabled by configuration.",
  };
}

export type ImporterResult =
  | {
      ok: true;
      data: {
        recordsCreated: number;
        recordsUpdated: number;
        recordsSkipped: number;
        recordsRejected: number;
        validationErrors: Array<{ path?: string; message: string }>;
        importJobId: string;
      };
    }
  | {
      ok: false;
      code: string;
      message: string;
      status: number;
      validationErrors?: Array<{ path?: string; message: string }>;
      importJobId?: string;
    };

export async function importAntigravityJson(payload: unknown): Promise<ImporterResult> {
  // 1. Check DB State
  const dbState = getMutationDbState();
  if (!dbState.ok) {
    return {
      ok: false,
      code: dbState.code,
      message: dbState.message,
      status: dbState.status,
    };
  }

  // 2. Validate structural schema
  const parsed = antigravityPayloadSchema.safeParse(payload);
  if (!parsed.success) {
    const validationErrors = parsed.error.issues.map((i) => ({
      path: i.path.join("."),
      message: i.message,
    }));
    return {
      ok: false,
      code: "IMPORT_VALIDATION_FAILED",
      message: "Payload validation failed.",
      status: 400,
      validationErrors,
    };
  }

  const data = parsed.data;

  // 3. Check if project exists
  const project = await projectRepository.getProjectById(data.projectId);
  if (!project) {
    return {
      ok: false,
      code: "NOT_FOUND",
      message: `Project ${data.projectId} not found.`,
      status: 404,
    };
  }

  // 4. Create import job
  const jobId = `job-${Date.now()}`;
  const initialJob: ImportJob = {
    id: jobId,
    projectId: data.projectId,
    importType: "antigravity-json",
    analysisSource: "antigravity-local",
    status: "pending",
    inputSummary: `Importing papers: ${data.papers.length}, overviews: ${data.paperOverviews.length}, suggestions: ${data.aiSuggestions.length}, extraction rows: ${data.extractionMatrixRows.length}, clusters: ${data.themeClusters.length}, consensus: ${data.consensusConflictItems.length}, gaps: ${data.gapItems.length}, arguments: ${data.argumentCandidates.length}, opportunities: ${data.innovationOpportunities.length}, writing: ${data.writingPlans.length}, presentation: ${data.presentationPlans.length}`,
    recordsCreated: 0,
    recordsRejected: 0,
    validationErrors: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const jobResult = await importJobRepository.createImportJob(initialJob);
  if (!jobResult.ok) {
    return {
      ok: false,
      code: jobResult.code,
      message: jobResult.message,
      status: jobResult.status,
    };
  }

  // Counters
  let recordsCreated = 0;
  let recordsUpdated = 0;
  let recordsSkipped = 0;
  let recordsRejected = 0;
  const validationErrors: Array<{ path?: string; message: string }> = [];

  try {
    // 5. Query all existing records to detect updates vs creates and protect human reviewed records
    const [
      existingOverviews,
      existingSuggestions,
      existingMatrixRows,
      existingThemeClusters,
      existingConsensusItems,
      existingGapItems,
      existingArguments,
      existingOpportunities,
      existingWritingPlan,
      existingPresentationPlan,
    ] = await Promise.all([
      analysisRepository.listPaperOverviews(data.projectId),
      analysisRepository.listAISuggestions(data.projectId),
      matrixRepository.listExtractionMatrixRows(data.projectId),
      synthesisRepository.listThemeClusters(data.projectId),
      synthesisRepository.listConsensusConflictItems(data.projectId),
      synthesisRepository.listGapItems(data.projectId),
      synthesisRepository.listArgumentCandidates(data.projectId),
      synthesisRepository.listInnovationOpportunities(data.projectId),
      synthesisRepository.getWritingPlan(data.projectId),
      synthesisRepository.getPresentationPlan(data.projectId),
    ]);

    // Build ID Sets and Status Check Sets
    const existingOverviewsMap = new Map(existingOverviews.map((x) => [x.id, x.status]));
    const existingSuggestionsMap = new Map(existingSuggestions.map((x) => [x.id, x.status]));
    const existingMatrixRowsMap = new Map(existingMatrixRows.map((x) => [x.id, x.status]));
    const existingThemeClustersMap = new Map(existingThemeClusters.map((x) => [x.id, x.status]));
    const existingConsensusItemsMap = new Map(existingConsensusItems.map((x) => [x.id, x.status]));
    const existingGapItemsMap = new Map(existingGapItems.map((x) => [x.id, x.status]));
    const existingArgumentsMap = new Map(existingArguments.map((x) => [x.id, x.status]));
    const existingOpportunitiesMap = new Map(existingOpportunities.map((x) => [x.id, x.status]));
    const existingWritingPlanMap = new Map(existingWritingPlan ? [[existingWritingPlan.id, existingWritingPlan.status]] : []);
    const existingPresentationPlanMap = new Map(existingPresentationPlan ? [[existingPresentationPlan.id, existingPresentationPlan.status]] : []);

    // 6. Import Papers (no status checks needed)
    if (data.papers.length > 0) {
      const existingPapers = await paperRepository.listPapersByProjectId(data.projectId);
      const existingPaperIds = new Set(existingPapers.map((p) => p.id));

      const papersToUpsert = data.papers.map((paper) => {
        if (existingPaperIds.has(paper.id)) {
          recordsUpdated++;
        } else {
          recordsCreated++;
        }
        return {
          ...paper,
          projectId: data.projectId,
          createdAt: paper.createdAt || new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
      });

      const upsertResult = await paperRepository.upsertPapers(papersToUpsert);
      if (!upsertResult.ok) {
        throw new Error(`Failed to upsert papers: ${upsertResult.message}`);
      }
    }

    async function processUpserts<
      TIncoming extends { id: string; projectId: string; evidenceLevel?: string; confidence?: string; evidence?: unknown[] },
      TDb
    >(
      incomingRecords: TIncoming[],
      existingMap: Map<string, string>,
      upsertFn: (records: TDb[]) => Promise<{ ok: boolean; message?: string }>
    ) {
      const allowedRecords: TDb[] = [];
      for (const record of incomingRecords) {
        const existingStatus = existingMap.get(record.id);
        if (existingStatus === "accepted" || existingStatus === "edited") {
          recordsSkipped++;
        } else {
          if (existingStatus) {
            recordsUpdated++;
          } else {
            recordsCreated++;
          }
          allowedRecords.push(normalizeAnalysisMetadata(record as Parameters<typeof normalizeAnalysisMetadata>[0], data.projectId) as unknown as TDb);
        }
      }
      if (allowedRecords.length > 0) {
        const res = await upsertFn(allowedRecords);
        if (!res.ok) {
          throw new Error(res.message);
        }
      }
    }

    // 7. Process Paper Overviews
    await processUpserts(
      data.paperOverviews,
      existingOverviewsMap,
      async (records: PaperOverview[]) => {
        for (const record of records) {
          const res = await analysisRepository.insertPaperOverview(record);
          if (!res.ok) return res;
        }
        return { ok: true };
      }
    );

    // 8. Process AI Suggestions
    await processUpserts(
      data.aiSuggestions,
      existingSuggestionsMap,
      analysisRepository.upsertAISuggestions
    );

    // 9. Process Extraction Matrix Rows
    await processUpserts(
      data.extractionMatrixRows,
      existingMatrixRowsMap,
      async (records: ExtractionMatrixRow[]) => {
        for (const record of records) {
          const res = await matrixRepository.upsertExtractionMatrixRowFromSuggestion(record);
          if (!res.ok) return res;
        }
        return { ok: true };
      }
    );

    // 10. Process Theme Clusters
    await processUpserts(
      data.themeClusters,
      existingThemeClustersMap,
      synthesisRepository.upsertThemeClusters
    );

    // 11. Process Consensus Conflict Items
    await processUpserts(
      data.consensusConflictItems,
      existingConsensusItemsMap,
      synthesisRepository.upsertConsensusConflictItems
    );

    // 12. Process Gap Items
    await processUpserts(
      data.gapItems,
      existingGapItemsMap,
      synthesisRepository.upsertGapItems
    );

    // 13. Process Argument Candidates
    await processUpserts(
      data.argumentCandidates,
      existingArgumentsMap,
      synthesisRepository.upsertArgumentCandidates
    );

    // 14. Process Innovation Opportunities
    await processUpserts(
      data.innovationOpportunities,
      existingOpportunitiesMap,
      synthesisRepository.upsertInnovationOpportunities
    );

    // 15. Process Writing Plans
    for (const plan of data.writingPlans) {
      const existingStatus = existingWritingPlanMap.get(plan.id);
      if (existingStatus === "accepted" || existingStatus === "edited") {
        recordsSkipped++;
      } else {
        if (existingStatus) {
          recordsUpdated++;
        } else {
          recordsCreated++;
        }
        const normalized = normalizeAnalysisMetadata(plan, data.projectId);
        const res = await synthesisRepository.upsertWritingPlan(normalized);
        if (!res.ok) {
          throw new Error(res.message);
        }
      }
    }

    // 16. Process Presentation Plans
    for (const plan of data.presentationPlans) {
      const existingStatus = existingPresentationPlanMap.get(plan.id);
      if (existingStatus === "accepted" || existingStatus === "edited") {
        recordsSkipped++;
      } else {
        if (existingStatus) {
          recordsUpdated++;
        } else {
          recordsCreated++;
        }
        const normalized = normalizeAnalysisMetadata(plan, data.projectId);
        const res = await synthesisRepository.upsertPresentationPlan(normalized);
        if (!res.ok) {
          throw new Error(res.message);
        }
      }
    }

    // 17. Complete Import Job Success
    await importJobRepository.updateImportJob(jobId, {
      status: "imported",
      recordsCreated,
      recordsRejected,
      validationErrors: [],
    });

  } catch (err) {
    recordsRejected = data.papers.length + data.paperOverviews.length + data.aiSuggestions.length + data.extractionMatrixRows.length + data.themeClusters.length + data.consensusConflictItems.length + data.gapItems.length + data.argumentCandidates.length + data.innovationOpportunities.length + data.writingPlans.length + data.presentationPlans.length - recordsSkipped;
    const errorMessage = err instanceof Error ? err.message : "Unknown error during import database write.";
    validationErrors.push({ message: errorMessage });

    await importJobRepository.updateImportJob(jobId, {
      status: "failed",
      recordsCreated: 0,
      recordsRejected,
      validationErrors,
    });

    return {
      ok: false,
      code: "IMPORT_FAILED",
      message: errorMessage,
      status: 500,
      importJobId: jobId,
    };
  }

  return {
    ok: true,
    data: {
      recordsCreated,
      recordsUpdated,
      recordsSkipped,
      recordsRejected,
      validationErrors,
      importJobId: jobId,
    },
  };
}
