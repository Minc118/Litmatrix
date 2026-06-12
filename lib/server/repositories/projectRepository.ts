import "server-only";

import { eq } from "drizzle-orm";
import { withDatabaseReadFallback } from "@/lib/server/db/fallback";
import { keywordGroups, projects, researchQuestions } from "@/lib/server/db/schema";
import { toKeywordGroup, toProject, toResearchQuestion } from "@/lib/server/db/mappers";
import { getOptionalDb } from "@/lib/server/db/client";
import {
  ocpmDemoKeywordGroups,
  ocpmDemoProject,
  ocpmDemoProjectId,
  ocpmDemoResearchQuestions,
} from "@/lib/demo/ocpm-demo-data";
import type { Project, ProjectDetail } from "@/lib/types/litmatrix";

const globalForProjects = globalThis as unknown as {
  inMemoryProjects?: Map<string, ProjectDetail>;
};

const inMemoryProjects = globalForProjects.inMemoryProjects ?? new Map<string, ProjectDetail>();

if (process.env.NODE_ENV !== "production") {
  globalForProjects.inMemoryProjects = inMemoryProjects;
}

export async function listProjects(userId?: string | null): Promise<Project[]> {
  const dbProjects = await withDatabaseReadFallback(
    async (db) => {
      if (!userId) {
        return [];
      }
      const rows = await db.select().from(projects).where(eq(projects.userId, userId));
      return rows.map(toProject);
    },
    () => [ocpmDemoProject],
  );

  const all = [...dbProjects];
  for (const p of inMemoryProjects.values()) {
    if (p.demo || (userId && p.userId === userId)) {
      if (!all.some((x) => x.id === p.id)) {
        all.push({
          id: p.id,
          title: p.title,
          description: p.description,
          status: p.status,
          demo: p.demo,
          userId: p.userId,
          createdAt: p.createdAt,
          updatedAt: p.updatedAt,
        });
      }
    }
  }
  return all;
}

export async function getProjectById(projectId: string): Promise<ProjectDetail | null> {
  console.log(`[REPOSITORY] getProjectById lookup: ${projectId}, stored keys:`, Array.from(inMemoryProjects.keys()));
  if (inMemoryProjects.has(projectId)) {
    return inMemoryProjects.get(projectId)!;
  }
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

export async function createProject(
  projectData: { id: string; title: string; description?: string | null; demo?: boolean; userId?: string | null },
  rqs: Array<{ text: string }>
): Promise<ProjectDetail> {
  const now = new Date().toISOString();
  const projectDetail: ProjectDetail = {
    id: projectData.id,
    title: projectData.title,
    description: projectData.description || null,
    status: "active",
    demo: projectData.demo ?? false,
    userId: projectData.userId || null,
    createdAt: now,
    updatedAt: now,
    researchQuestions: rqs.map((rq, index) => ({
      id: `rq-${projectData.id}-${index + 1}`,
      projectId: projectData.id,
      text: rq.text,
      rationale: null,
      createdAt: now,
      updatedAt: now,
    })),
    keywordGroups: [],
  };

  inMemoryProjects.set(projectData.id, projectDetail);
  console.log(`[REPOSITORY] createProject saved: ${projectData.id}, stored keys:`, Array.from(inMemoryProjects.keys()));

  try {
    const db = getOptionalDb();
    if (db) {
      await db.insert(projects).values({
        id: projectData.id,
        title: projectData.title,
        description: projectData.description || null,
        status: "active",
        userId: projectData.userId || null,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      for (const rq of projectDetail.researchQuestions) {
        await db.insert(researchQuestions).values({
          id: rq.id,
          projectId: rq.projectId,
          text: rq.text,
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      }
    }
  } catch (err) {
    console.error("Failed to persist project in DB fallback, using in-memory only:", err);
  }

  return projectDetail;
}

