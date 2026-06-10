import "server-only";

import { eq } from "drizzle-orm";
import { withDatabaseReadFallback } from "@/lib/server/db/fallback";
import { keywordGroups, projects, researchQuestions } from "@/lib/server/db/schema";
import { toKeywordGroup, toProject, toResearchQuestion } from "@/lib/server/db/mappers";
import {
  ocpmDemoKeywordGroups,
  ocpmDemoProject,
  ocpmDemoProjectId,
  ocpmDemoResearchQuestions,
} from "@/lib/demo/ocpm-demo-data";
import type { Project, ProjectDetail } from "@/lib/types/litmatrix";

export async function listProjects(): Promise<Project[]> {
  return withDatabaseReadFallback(
    async (db) => {
      const rows = await db.select().from(projects);
      return rows.map(toProject);
    },
    () => [ocpmDemoProject],
  );
}

export async function getProjectById(projectId: string): Promise<ProjectDetail | null> {
  return withDatabaseReadFallback(
    async (db) => {
      const [projectRow] = await db.select().from(projects).where(eq(projects.id, projectId));

      if (!projectRow) {
        return null;
      }

      const [researchQuestionRows, keywordGroupRows] = await Promise.all([
        db.select().from(researchQuestions).where(eq(researchQuestions.projectId, projectId)),
        db.select().from(keywordGroups).where(eq(keywordGroups.projectId, projectId)),
      ]);

      return {
        ...toProject(projectRow),
        researchQuestions: researchQuestionRows.map(toResearchQuestion),
        keywordGroups: keywordGroupRows.map(toKeywordGroup),
      };
    },
    () => {
      if (projectId !== ocpmDemoProjectId) {
        return null;
      }

      return {
        ...ocpmDemoProject,
        researchQuestions: ocpmDemoResearchQuestions,
        keywordGroups: ocpmDemoKeywordGroups,
      };
    },
  );
}
