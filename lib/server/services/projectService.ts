import "server-only";

import * as projectRepository from "@/lib/server/repositories/projectRepository";
import { registerProjectSkill, type ExtractionField, type AnalysisCommand, type ProjectContract } from "@/lib/server/skills/projectSkills";

export async function listProjects() {
  return projectRepository.listProjects();
}

export async function getProject(projectId: string) {
  return projectRepository.getProjectById(projectId);
}

export async function createProject(data: {
  title: string;
  topic: string;
  reviewType: string;
  writingGoal: string;
  researchQuestions: string[];
  extractionFields: Array<{ key: string; label: string; required: boolean; description?: string }>;
}) {
  const projectId = data.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  const id = projectId || "custom-project";

  const rqs = data.researchQuestions.map((rq) => ({ text: rq }));

  const projectDetail = await projectRepository.createProject({
    id,
    title: data.title,
    description: `Topic: ${data.topic}. Type: ${data.reviewType}. Goal: ${data.writingGoal}`,
    demo: false
  }, rqs);

  const fields: ExtractionField[] = data.extractionFields.map((f) => ({
    key: f.key,
    label: f.label,
    required: f.required,
    description: f.description
  }));

  const commands: AnalysisCommand[] = [
    {
      id: "compare",
      label: "Compare selected records",
      purpose: "Compare methodology, findings, and limitation patterns.",
      inputRecordTypes: ["extraction-field"],
      outputResultType: "comparison-result",
      evidenceRequirements: "Requires confirmed matrix records.",
      promptTemplate: "Compare the methods and findings of: ${records}. Identify consensus and contradictions.",
    },
    {
      id: "synthesize",
      label: "Synthesize theme",
      purpose: "Cluster records around a common theme and summarize literature consensus.",
      inputRecordTypes: ["extraction-field"],
      outputResultType: "theme-cluster",
      evidenceRequirements: "Requires at least 2 papers.",
      promptTemplate: "Synthesize a common theme for the following: ${records}.",
    },
  ];

  const contract: ProjectContract = {
    projectId: id,
    skillVersion: "1.0.0",
    contractVersion: "1.0.0",
    extractionSchemaVersion: "1.0.0",
    commandPackVersion: "1.0.0",
    researchQuestionIds: projectDetail.researchQuestions.map((rq) => rq.id),
    extractionFields: fields,
    commandPack: commands,
  };

  const markdown = `# Project Skill: ${data.topic} Systematic Literature Review

## Purpose
This skill guides the AI and external tools in reviewing papers and extracting evidence for the systematic review on: **${data.topic}**.

## Research Questions
${projectDetail.researchQuestions.map((rq) => `- **${rq.id}**: ${rq.text}`).join("\n")}

## Evidence Rules
* Only extract values explicitly supported by paper quotes.
* If a field is not found in the text, use: \`Not specified in the provided text.\`.
* Do not fabricate page numbers; mark as unverified if unsure.

## Extraction Fields
${fields.map((f) => `* **${f.key}** (${f.label})${f.required ? " [REQUIRED]" : ""}${f.description ? `: ${f.description}` : ""}`).join("\n")}

## Analysis Commands
${commands.map((c) => `* **${c.id}** (${c.label}): ${c.purpose}`).join("\n")}
`;

  registerProjectSkill(id, markdown, contract);

  return projectDetail;
}

