import "server-only";

export interface ExtractionField {
  key: string;
  label: string;
  required: boolean;
  description?: string;
}

export interface AnalysisCommand {
  id: string;
  label: string;
  purpose: string;
  inputRecordTypes: string[];
  outputResultType: string;
  evidenceRequirements: string;
  promptTemplate: string;
}

export interface ProjectContract {
  projectId: string;
  skillVersion: string;
  contractVersion: string;
  extractionSchemaVersion: string;
  commandPackVersion: string;
  researchQuestionIds: string[];
  extractionFields: ExtractionField[];
  commandPack: AnalysisCommand[];
}

const DEFAULT_EXTRACTION_FIELDS: ExtractionField[] = [
  { key: "researchProblem", label: "Research Problem", required: true },
  { key: "researchQuestions", label: "Research Questions Addressed", required: false },
  { key: "method", label: "Method / Approach", required: true },
  { key: "contribution", label: "Main Contribution", required: false },
  { key: "keyConcepts", label: "Key Concepts", required: false },
  { key: "evaluationMethod", label: "Evaluation Method", required: false },
  { key: "dataset", label: "Dataset / Empirical Material", required: false },
  { key: "findings", label: "Findings", required: true },
  { key: "limitations", label: "Limitations", required: false },
  { key: "futureWork", label: "Future Work", required: false },
  { key: "researchGap", label: "Research Gap", required: false },
  { key: "usefulEvidence", label: "Useful Evidence", required: false },
  { key: "relevance", label: "Relevance to User's Paper", required: false },
  { key: "writingUse", label: "Possible Use in Writing", required: false },
];

const DEFAULT_COMMANDS: AnalysisCommand[] = [
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
  {
    id: "gap",
    label: "Find research gap",
    purpose: "Pinpoint gaps in evaluation, dataset, or method coverage.",
    inputRecordTypes: ["extraction-field"],
    outputResultType: "gap-item",
    evidenceRequirements: "Requires confirmed limitation records.",
    promptTemplate: "Based on limitations in ${records}, identify the primary research gap.",
  },
  {
    id: "argument",
    label: "Build argument",
    purpose: "Formulate a core survey claim backed by verified evidence.",
    inputRecordTypes: ["extraction-field", "gap-item"],
    outputResultType: "argument-candidate",
    evidenceRequirements: "Requires verified evidence citations.",
    promptTemplate: "Draft a thesis argument based on the findings in ${records}.",
  },
];

// OCPM Specialized Configs
const OCPM_EXTRACTION_FIELDS: ExtractionField[] = [
  ...DEFAULT_EXTRACTION_FIELDS,
  { key: "ocelUsage", label: "OCEL Usage", required: false, description: "Check if the paper mentions Object-Centric Event Logs standard." },
  { key: "objectCentricDataModel", label: "Object-Centric Data Model", required: false, description: "Details of the modeling approach." },
  { key: "convergenceDivergence", label: "Convergence / Divergence Issue", required: false },
  { key: "caseNotion", label: "Case Notion", required: false },
];

const OCPM_COMMANDS: AnalysisCommand[] = [
  ...DEFAULT_COMMANDS,
  {
    id: "compare_data_models",
    label: "Compare object-centric data models",
    purpose: "Contrast data structures and modeling choices.",
    inputRecordTypes: ["extraction-field"],
    outputResultType: "comparison-result",
    evidenceRequirements: "Requires objectCentricDataModel values.",
    promptTemplate: "Analyze and compare the object-centric data models of: ${records}.",
  },
  {
    id: "analyze_convergence",
    label: "Analyze convergence / divergence evidence",
    purpose: "Synthesize evidence of convergence/divergence process issues.",
    inputRecordTypes: ["extraction-field"],
    outputResultType: "consensus-conflict",
    evidenceRequirements: "Requires convergenceDivergence records.",
    promptTemplate: "Synthesize process convergence or divergence claims in: ${records}.",
  },
];

export function getProjectSkillMarkdown(projectId: string): string {
  const isOcpm = projectId === "ocpm-demo";
  const topic = isOcpm ? "Object-Centric Process Mining" : "Literature Review Topic";
  
  return `# Project Skill: ${topic} Systematic Literature Review

## Purpose
This skill guides the AI and external tools in reviewing papers and extracting evidence for the systematic review on: **${topic}**.

## Research Questions
${isOcpm ? `- **rq-ocpm-1**: How do object-centric approaches address limitations of case-centric process mining?
- **rq-ocpm-2**: Which analysis tasks are supported by current OCPM methods and tools?` : `- **rq-1**: What are the main methods used in the literature?
- **rq-2**: What are the primary findings and research gaps?`}

## Evidence Rules
* Only extract values explicitly supported by paper quotes.
* If a field is not found in the text, use: \`Not specified in the provided text.\`.
* Do not fabricate page numbers; mark as unverified if unsure.

## Extraction Fields
${(isOcpm ? OCPM_EXTRACTION_FIELDS : DEFAULT_EXTRACTION_FIELDS)
  .map((f) => `* **${f.key}** (${f.label})${f.required ? " [REQUIRED]" : ""}${f.description ? `: ${f.description}` : ""}`)
  .join("\n")}

## Analysis Commands
${(isOcpm ? OCPM_COMMANDS : DEFAULT_COMMANDS)
  .map((c) => `* **${c.id}** (${c.label}): ${c.purpose}`)
  .join("\n")}
`;
}

export function getProjectContract(projectId: string): ProjectContract {
  const isOcpm = projectId === "ocpm-demo";
  return {
    projectId,
    skillVersion: "1.0.0",
    contractVersion: "1.0.0",
    extractionSchemaVersion: "1.0.0",
    commandPackVersion: "1.0.0",
    researchQuestionIds: isOcpm ? ["rq-ocpm-1", "rq-ocpm-2"] : ["rq-1", "rq-2"],
    extractionFields: isOcpm ? OCPM_EXTRACTION_FIELDS : DEFAULT_EXTRACTION_FIELDS,
    commandPack: isOcpm ? OCPM_COMMANDS : DEFAULT_COMMANDS,
  };
}
