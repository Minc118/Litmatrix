import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { config } from "dotenv";
import {
  ocpmDemoAISuggestions,
  ocpmDemoArgumentCandidates,
  ocpmDemoConsensusConflictItems,
  ocpmDemoExtractionMatrixRows,
  ocpmDemoGapItems,
  ocpmDemoImportJobs,
  ocpmDemoInnovationOpportunities,
  ocpmDemoKeywordGroups,
  ocpmDemoPaperOverviews,
  ocpmDemoPapers,
  ocpmDemoPresentationPlan,
  ocpmDemoProject,
  ocpmDemoResearchQuestions,
  ocpmDemoReviewDecisions,
  ocpmDemoThemeClusters,
  ocpmDemoWritingPlan,
} from "../../lib/demo/ocpm-demo-data";
import {
  aiSuggestions,
  argumentCandidates,
  consensusConflictItems,
  extractionMatrixRows,
  gapItems,
  importJobs,
  innovationOpportunities,
  keywordGroups,
  papers,
  paperOverviews,
  presentationPlans,
  projects,
  researchQuestions,
  reviewDecisions,
  themeClusters,
  writingPlans,
} from "../../lib/server/db/schema";

config({ path: ".env.local" });

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error("DATABASE_URL is required to seed demo data.");
}

const db = drizzle(neon(databaseUrl));

function date(value: string) {
  return new Date(value);
}

async function main() {
  await db
    .insert(projects)
    .values({
      ...ocpmDemoProject,
      description: ocpmDemoProject.description ?? null,
      status: ocpmDemoProject.status ?? "active",
      demo: ocpmDemoProject.demo ?? true,
      createdAt: date(ocpmDemoProject.createdAt),
      updatedAt: date(ocpmDemoProject.updatedAt),
    })
    .onConflictDoUpdate({
      target: projects.id,
      set: {
        title: ocpmDemoProject.title,
        description: ocpmDemoProject.description ?? null,
        status: ocpmDemoProject.status ?? "active",
        demo: ocpmDemoProject.demo ?? true,
        updatedAt: new Date(),
      },
    });

  for (const question of ocpmDemoResearchQuestions) {
    await db
      .insert(researchQuestions)
      .values({
        ...question,
        rationale: question.rationale ?? null,
        createdAt: date(question.createdAt),
        updatedAt: date(question.updatedAt),
      })
      .onConflictDoUpdate({
        target: researchQuestions.id,
        set: {
          text: question.text,
          rationale: question.rationale ?? null,
          updatedAt: new Date(),
        },
      });
  }

  for (const group of ocpmDemoKeywordGroups) {
    await db
      .insert(keywordGroups)
      .values({
        ...group,
        createdAt: date(group.createdAt),
        updatedAt: date(group.updatedAt),
      })
      .onConflictDoUpdate({
        target: keywordGroups.id,
        set: {
          label: group.label,
          keywords: group.keywords,
          updatedAt: new Date(),
        },
      });
  }

  for (const paper of ocpmDemoPapers) {
    await db
      .insert(papers)
      .values({
        ...paper,
        authors: paper.authors ?? [],
        venue: paper.venue ?? null,
        doi: paper.doi ?? null,
        url: paper.url ?? null,
        abstract: paper.abstract ?? null,
        zoteroItemKey: paper.zoteroItemKey ?? null,
        pdfFileId: paper.pdfFileId ?? null,
        tags: paper.tags ?? [],
        createdAt: date(paper.createdAt),
        updatedAt: date(paper.updatedAt),
      })
      .onConflictDoUpdate({
        target: papers.id,
        set: {
          title: paper.title,
          authors: paper.authors ?? [],
          year: paper.year ?? null,
          venue: paper.venue ?? null,
          doi: paper.doi ?? null,
          url: paper.url ?? null,
          abstract: paper.abstract ?? null,
          zoteroItemKey: paper.zoteroItemKey ?? null,
          pdfFileId: paper.pdfFileId ?? null,
          tags: paper.tags ?? [],
          updatedAt: new Date(),
        },
      });
  }

  for (const overview of ocpmDemoPaperOverviews) {
    await db
      .insert(paperOverviews)
      .values({
        ...overview,
        createdAt: date(overview.createdAt),
        updatedAt: date(overview.updatedAt),
      })
      .onConflictDoNothing();
  }

  for (const suggestion of ocpmDemoAISuggestions) {
    await db
      .insert(aiSuggestions)
      .values({
        ...suggestion,
        paperId: suggestion.paperId ?? null,
        targetField: suggestion.targetField ?? null,
        createdAt: date(suggestion.createdAt),
        updatedAt: date(suggestion.updatedAt),
      })
      .onConflictDoNothing();
  }

  for (const decision of ocpmDemoReviewDecisions) {
    await db
      .insert(reviewDecisions)
      .values({
        ...decision,
        paperId: decision.paperId ?? null,
        editedContent: decision.editedContent ?? null,
        reviewerNote: decision.reviewerNote ?? null,
        createdAt: date(decision.createdAt),
        updatedAt: date(decision.updatedAt),
      })
      .onConflictDoNothing();
  }

  for (const row of ocpmDemoExtractionMatrixRows) {
    await db
      .insert(extractionMatrixRows)
      .values({
        ...row,
        suggestedValue: row.suggestedValue ?? null,
        confirmedValue: row.confirmedValue ?? null,
        confirmedByDecisionId: row.confirmedByDecisionId ?? null,
        createdAt: date(row.createdAt),
        updatedAt: date(row.updatedAt),
      })
      .onConflictDoNothing();
  }

  for (const cluster of ocpmDemoThemeClusters) {
    await db
      .insert(themeClusters)
      .values({
        ...cluster,
        paperId: cluster.paperId ?? null,
        createdAt: date(cluster.createdAt),
        updatedAt: date(cluster.updatedAt),
      })
      .onConflictDoNothing();
  }

  for (const item of ocpmDemoConsensusConflictItems) {
    await db
      .insert(consensusConflictItems)
      .values({
        ...item,
        paperId: item.paperId ?? null,
        contrastingPaperIds: item.contrastingPaperIds ?? [],
        createdAt: date(item.createdAt),
        updatedAt: date(item.updatedAt),
      })
      .onConflictDoNothing();
  }

  for (const gap of ocpmDemoGapItems) {
    await db
      .insert(gapItems)
      .values({
        ...gap,
        paperId: gap.paperId ?? null,
        gapType: gap.gapType ?? null,
        createdAt: date(gap.createdAt),
        updatedAt: date(gap.updatedAt),
      })
      .onConflictDoNothing();
  }

  for (const argument of ocpmDemoArgumentCandidates) {
    await db
      .insert(argumentCandidates)
      .values({
        ...argument,
        paperId: argument.paperId ?? null,
        relatedGapIds: argument.relatedGapIds ?? [],
        createdAt: date(argument.createdAt),
        updatedAt: date(argument.updatedAt),
      })
      .onConflictDoNothing();
  }

  for (const opportunity of ocpmDemoInnovationOpportunities) {
    await db
      .insert(innovationOpportunities)
      .values({
        ...opportunity,
        paperId: opportunity.paperId ?? null,
        relatedGapIds: opportunity.relatedGapIds ?? [],
        createdAt: date(opportunity.createdAt),
        updatedAt: date(opportunity.updatedAt),
      })
      .onConflictDoNothing();
  }

  await db
    .insert(writingPlans)
    .values({
      ...ocpmDemoWritingPlan,
      paperId: ocpmDemoWritingPlan.paperId ?? null,
      createdAt: date(ocpmDemoWritingPlan.createdAt),
      updatedAt: date(ocpmDemoWritingPlan.updatedAt),
    })
    .onConflictDoNothing();

  await db
    .insert(presentationPlans)
    .values({
      ...ocpmDemoPresentationPlan,
      paperId: ocpmDemoPresentationPlan.paperId ?? null,
      createdAt: date(ocpmDemoPresentationPlan.createdAt),
      updatedAt: date(ocpmDemoPresentationPlan.updatedAt),
    })
    .onConflictDoNothing();

  for (const job of ocpmDemoImportJobs) {
    await db
      .insert(importJobs)
      .values({
        ...job,
        inputSummary: job.inputSummary ?? null,
        recordsCreated: job.recordsCreated ?? 0,
        recordsRejected: job.recordsRejected ?? 0,
        validationErrors: job.validationErrors ?? [],
        createdAt: date(job.createdAt),
        updatedAt: date(job.updatedAt),
      })
      .onConflictDoNothing();
  }

  console.log("OCPM demo data seed completed.");
}

main().catch(() => {
  console.error("Demo seed failed.");
  process.exit(1);
});
