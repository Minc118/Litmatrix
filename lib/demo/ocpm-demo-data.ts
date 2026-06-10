import type {
  AISuggestion,
  AnalysisRun,
  ArgumentCandidate,
  ConsensusConflictItem,
  ExtractionMatrixRow,
  GapItem,
  ImportJob,
  InnovationOpportunity,
  KeywordGroup,
  Paper,
  PaperOverview,
  PresentationPlan,
  Project,
  ResearchQuestion,
  ReviewDecision,
  ThemeCluster,
  WritingPlan,
} from "../types/litmatrix";

export const ocpmDemoProjectId = "ocpm-demo";

const createdAt = "2026-01-15T09:00:00.000Z";
const updatedAt = "2026-01-15T09:00:00.000Z";
const missing = "Not specified in the provided text.";

export const ocpmDemoProject: Project = {
  id: ocpmDemoProjectId,
  title: "Object-Centric Process Mining Survey",
  description:
    "Demo SLR workspace for comparing object-centric process mining foundations, tooling, and research gaps.",
  status: "active",
  demo: true,
  createdAt,
  updatedAt,
};

export const ocpmDemoResearchQuestions: ResearchQuestion[] = [
  {
    id: "rq-ocpm-1",
    projectId: ocpmDemoProjectId,
    text: "How do object-centric approaches address limitations of case-centric process mining?",
    rationale: "Frames the survey around the core modeling motivation.",
    createdAt,
    updatedAt,
  },
  {
    id: "rq-ocpm-2",
    projectId: ocpmDemoProjectId,
    text: "Which analysis tasks are supported by current OCPM methods and tools?",
    rationale: "Connects paper-level extraction to matrix and synthesis views.",
    createdAt,
    updatedAt,
  },
];

export const ocpmDemoKeywordGroups: KeywordGroup[] = [
  {
    id: "kw-ocpm-concepts",
    projectId: ocpmDemoProjectId,
    label: "Core concepts",
    keywords: ["object-centric process mining", "OCEL", "event log", "process discovery"],
    createdAt,
    updatedAt,
  },
  {
    id: "kw-ocpm-analysis",
    projectId: ocpmDemoProjectId,
    label: "Analysis tasks",
    keywords: ["conformance checking", "performance analysis", "multi-object processes"],
    createdAt,
    updatedAt,
  },
];

export const ocpmDemoPapers: Paper[] = [
  {
    id: "van2019object",
    projectId: ocpmDemoProjectId,
    title: "Demo paper: object-centric process mining foundations (2019)",
    authors: [],
    year: 2019,
    venue: null,
    doi: null,
    url: null,
    abstract:
      "Demo metadata placeholder describing a foundational object-centric process mining contribution.",
    zoteroItemKey: null,
    pdfFileId: null,
    tags: ["foundations", "object-centric"],
    createdAt,
    updatedAt,
  },
  {
    id: "van2021object",
    projectId: ocpmDemoProjectId,
    title: "Demo paper: object-centric event data and analysis tasks (2021)",
    authors: [],
    year: 2021,
    venue: null,
    doi: null,
    url: null,
    abstract:
      "Demo metadata placeholder about event data models and analysis tasks for multiple object types.",
    zoteroItemKey: null,
    pdfFileId: null,
    tags: ["event-data", "analysis"],
    createdAt,
    updatedAt,
  },
  {
    id: "van2023object",
    projectId: ocpmDemoProjectId,
    title: "Demo paper: recent perspectives on object-centric process mining (2023)",
    authors: [],
    year: 2023,
    venue: null,
    doi: null,
    url: null,
    abstract:
      "Demo metadata placeholder summarizing recent directions for object-centric process mining.",
    zoteroItemKey: null,
    pdfFileId: null,
    tags: ["survey", "directions"],
    createdAt,
    updatedAt,
  },
  {
    id: "berti2023advancements",
    projectId: ocpmDemoProjectId,
    title: "Demo paper: advancements in object-centric process mining (2023)",
    authors: [],
    year: 2023,
    venue: null,
    doi: null,
    url: null,
    abstract:
      "Demo metadata placeholder focused on tool support and practical analysis capabilities.",
    zoteroItemKey: null,
    pdfFileId: null,
    tags: ["tooling", "advancements"],
    createdAt,
    updatedAt,
  },
  {
    id: "li2018extracting",
    projectId: ocpmDemoProjectId,
    title: "Demo paper: extracting process knowledge from multi-object data (2018)",
    authors: [],
    year: 2018,
    venue: null,
    doi: null,
    url: null,
    abstract:
      "Demo metadata placeholder about extracting process knowledge when event data is not case-centric.",
    zoteroItemKey: null,
    pdfFileId: null,
    tags: ["extraction", "multi-object"],
    createdAt,
    updatedAt,
  },
];

export const ocpmDemoPaperOverviews: PaperOverview[] = [
  {
    id: "overview-van2019object",
    projectId: ocpmDemoProjectId,
    paperId: "van2019object",
    analysisSource: "mock",
    evidenceLevel: "abstract-based",
    status: "accepted",
    confidence: "medium",
    problem: "Case-centric event logs can obscure relationships between multiple interacting business objects.",
    objective: "Introduce or motivate object-centric modeling for process mining analysis.",
    method: "Conceptual modeling and illustrative analysis workflow.",
    dataset: missing,
    findings: "Object-centric representations can preserve relationships across multiple object types.",
    limitations: "Evaluation scope is not specified in the demo text.",
    evidence: [
      {
        paperId: "van2019object",
        sourceField: "abstract",
        note: "Demo abstract placeholder mentions foundational object-centric process mining.",
      },
    ],
    createdAt,
    updatedAt,
  },
  {
    id: "overview-van2021object",
    projectId: ocpmDemoProjectId,
    paperId: "van2021object",
    analysisSource: "mock",
    evidenceLevel: "abstract-based",
    status: "accepted",
    confidence: "medium",
    problem: "Multi-object processes need event data structures that avoid forcing every event into a single case notion.",
    objective: "Describe event data models and analysis tasks for object-centric process mining.",
    method: "Conceptual analysis of event data and process mining tasks.",
    dataset: missing,
    findings: "Object-centric event data supports analysis across related object types.",
    limitations: missing,
    evidence: [
      {
        paperId: "van2021object",
        sourceField: "abstract",
        note: "Demo abstract placeholder mentions event data models and analysis tasks.",
      },
    ],
    createdAt,
    updatedAt,
  },
  {
    id: "overview-van2023object",
    projectId: ocpmDemoProjectId,
    paperId: "van2023object",
    analysisSource: "mock",
    evidenceLevel: "metadata-only",
    status: "pending-review",
    confidence: "tentative",
    problem: "Recent OCPM work needs consolidation across models, tools, and evaluation practices.",
    objective: "Summarize recent perspectives and directions.",
    method: missing,
    dataset: missing,
    findings: "The demo metadata suggests a survey or perspective contribution.",
    limitations: "Only metadata-level evidence is available in this demo record.",
    evidence: [
      {
        paperId: "van2023object",
        sourceField: "metadata",
        note: "Demo title and tags indicate recent perspectives and directions.",
      },
    ],
    createdAt,
    updatedAt,
  },
];

export const ocpmDemoAISuggestions: AISuggestion[] = [
  {
    id: "suggestion-method-van2019object",
    projectId: ocpmDemoProjectId,
    paperId: "van2019object",
    analysisSource: "mock",
    evidenceLevel: "abstract-based",
    status: "accepted",
    confidence: "medium",
    suggestionType: "extraction-field",
    title: "Extract method",
    content: "Conceptual modeling and illustrative workflow for object-centric process mining.",
    targetField: "method",
    evidence: [
      {
        paperId: "van2019object",
        sourceField: "abstract",
        note: "Demo abstract-level evidence only.",
      },
    ],
    createdAt,
    updatedAt,
  },
  {
    id: "suggestion-gap-van2021object",
    projectId: ocpmDemoProjectId,
    paperId: "van2021object",
    analysisSource: "mock",
    evidenceLevel: "abstract-based",
    status: "edited",
    confidence: "medium",
    suggestionType: "gap",
    title: "Clarify evaluation gap",
    content:
      "The paper motivates object-centric analysis tasks, but this demo text does not specify evaluation breadth.",
    targetField: "researchGap",
    evidence: [
      {
        paperId: "van2021object",
        sourceField: "abstract",
        note: "No dataset or evaluation detail is present in the demo abstract placeholder.",
      },
    ],
    createdAt,
    updatedAt,
  },
  {
    id: "suggestion-theme-berti2023advancements",
    projectId: ocpmDemoProjectId,
    paperId: "berti2023advancements",
    analysisSource: "mock",
    evidenceLevel: "metadata-only",
    status: "pending-review",
    confidence: "tentative",
    suggestionType: "theme",
    title: "Tooling and practical adoption",
    content:
      "The metadata suggests a possible theme around tool support, but full details require source review.",
    targetField: "theme",
    evidence: [
      {
        paperId: "berti2023advancements",
        sourceField: "metadata",
        note: "Demo tags include tooling and advancements.",
      },
    ],
    createdAt,
    updatedAt,
  },
  {
    id: "suggestion-reject-li2018extracting",
    projectId: ocpmDemoProjectId,
    paperId: "li2018extracting",
    analysisSource: "mock",
    evidenceLevel: "metadata-only",
    status: "rejected",
    confidence: "low",
    suggestionType: "extraction-field",
    title: "Assume benchmark dataset",
    content: "This suggestion was rejected because the demo metadata does not specify a benchmark dataset.",
    targetField: "dataset",
    evidence: [
      {
        paperId: "li2018extracting",
        sourceField: "metadata",
        note: "Dataset details are not present in the provided demo metadata.",
      },
    ],
    createdAt,
    updatedAt,
  },
];

export const ocpmDemoReviewDecisions: ReviewDecision[] = [
  {
    id: "decision-method-van2019object",
    projectId: ocpmDemoProjectId,
    paperId: "van2019object",
    suggestionId: "suggestion-method-van2019object",
    decision: "accepted",
    editedContent: null,
    reviewerNote: "Accepted as abstract-based demo extraction.",
    createdAt,
    updatedAt,
  },
  {
    id: "decision-gap-van2021object",
    projectId: ocpmDemoProjectId,
    paperId: "van2021object",
    suggestionId: "suggestion-gap-van2021object",
    decision: "edited",
    editedContent:
      "Evaluation breadth is unclear from the provided abstract-level demo evidence.",
    reviewerNote: "Edited to avoid overclaiming.",
    createdAt,
    updatedAt,
  },
  {
    id: "decision-reject-li2018extracting",
    projectId: ocpmDemoProjectId,
    paperId: "li2018extracting",
    suggestionId: "suggestion-reject-li2018extracting",
    decision: "rejected",
    editedContent: null,
    reviewerNote: "Rejected because no dataset evidence is available.",
    createdAt,
    updatedAt,
  },
];

export const ocpmDemoExtractionMatrixRows: ExtractionMatrixRow[] = [
  {
    id: "matrix-van2019object-method",
    projectId: ocpmDemoProjectId,
    paperId: "van2019object",
    analysisSource: "mock",
    evidenceLevel: "abstract-based",
    status: "accepted",
    confidence: "medium",
    fieldKey: "method",
    fieldLabel: "Method",
    suggestedValue: "Conceptual modeling and illustrative workflow.",
    confirmedValue: "Conceptual modeling and illustrative workflow.",
    confirmedByDecisionId: "decision-method-van2019object",
    evidence: [
      {
        paperId: "van2019object",
        sourceField: "abstract",
        note: "Accepted from abstract-level demo extraction.",
      },
    ],
    createdAt,
    updatedAt,
  },
  {
    id: "matrix-van2021object-gap",
    projectId: ocpmDemoProjectId,
    paperId: "van2021object",
    analysisSource: "mock",
    evidenceLevel: "abstract-based",
    status: "edited",
    confidence: "medium",
    fieldKey: "researchGap",
    fieldLabel: "Research Gap",
    suggestedValue:
      "The paper motivates object-centric analysis tasks, but this demo text does not specify evaluation breadth.",
    confirmedValue:
      "Evaluation breadth is unclear from the provided abstract-level demo evidence.",
    confirmedByDecisionId: "decision-gap-van2021object",
    evidence: [
      {
        paperId: "van2021object",
        sourceField: "abstract",
        note: "Edited to avoid claiming a gap beyond the available demo evidence.",
      },
    ],
    createdAt,
    updatedAt,
  },
  {
    id: "matrix-li2018extracting-dataset",
    projectId: ocpmDemoProjectId,
    paperId: "li2018extracting",
    analysisSource: "mock",
    evidenceLevel: "metadata-only",
    status: "rejected",
    confidence: "low",
    fieldKey: "dataset",
    fieldLabel: "Dataset",
    suggestedValue: "Benchmark dataset.",
    confirmedValue: null,
    confirmedByDecisionId: "decision-reject-li2018extracting",
    evidence: [
      {
        paperId: "li2018extracting",
        sourceField: "metadata",
        note: "Rejected because dataset information is not specified in the provided text.",
      },
    ],
    createdAt,
    updatedAt,
  },
];

export const ocpmDemoThemeClusters: ThemeCluster[] = [
  {
    id: "theme-multi-object-modeling",
    projectId: ocpmDemoProjectId,
    analysisSource: "mock",
    evidenceLevel: "mixed",
    status: "accepted",
    confidence: "medium",
    label: "Multi-object event modeling",
    summary:
      "Confirmed demo extraction values point to object-centric modeling as a response to case-centric simplification.",
    supportingPaperIds: ["van2019object", "van2021object"],
    supportingMatrixRowIds: ["matrix-van2019object-method"],
    evidence: [
      {
        paperId: "van2019object",
        sourceField: "abstract",
        note: "Supports the modeling theme at abstract level.",
      },
      {
        paperId: "van2021object",
        sourceField: "abstract",
        note: "Supports the event data and analysis task theme at abstract level.",
      },
    ],
    createdAt,
    updatedAt,
  },
];

export const ocpmDemoConsensusConflictItems: ConsensusConflictItem[] = [
  {
    id: "consensus-object-centric-need",
    projectId: ocpmDemoProjectId,
    analysisSource: "mock",
    evidenceLevel: "mixed",
    status: "accepted",
    confidence: "medium",
    itemType: "consensus",
    claim:
      "The confirmed demo records consistently frame object-centric modeling as useful for multi-object process data.",
    supportingPaperIds: ["van2019object", "van2021object"],
    evidence: [
      {
        paperId: "van2019object",
        sourceField: "abstract",
        note: "Abstract-level support for object-centric modeling.",
      },
      {
        paperId: "van2021object",
        sourceField: "abstract",
        note: "Abstract-level support for object-centric event data.",
      },
    ],
    createdAt,
    updatedAt,
  },
  {
    id: "complementarity-tooling-evaluation",
    projectId: ocpmDemoProjectId,
    analysisSource: "mock",
    evidenceLevel: "metadata-only",
    status: "pending-review",
    confidence: "tentative",
    itemType: "complementarity",
    claim:
      "Tooling-oriented and foundations-oriented demo records may complement each other, but details need review.",
    supportingPaperIds: ["van2019object", "berti2023advancements"],
    evidence: [
      {
        paperId: "berti2023advancements",
        sourceField: "metadata",
        note: "Metadata-only signal for tooling theme.",
      },
    ],
    createdAt,
    updatedAt,
  },
];

export const ocpmDemoGapItems: GapItem[] = [
  {
    id: "gap-evaluation-breadth",
    projectId: ocpmDemoProjectId,
    analysisSource: "mock",
    evidenceLevel: "abstract-based",
    status: "accepted",
    confidence: "medium",
    gapType: "evaluation",
    title: "Evaluation breadth is unclear in abstract-level evidence",
    description:
      "Confirmed extraction notes that evaluation breadth is not specified in the provided abstract-level demo text.",
    supportingPaperIds: ["van2021object"],
    evidence: [
      {
        paperId: "van2021object",
        sourceField: "abstract",
        note: "Confirmed matrix row records the missing evaluation breadth.",
      },
    ],
    createdAt,
    updatedAt,
  },
];

export const ocpmDemoArgumentCandidates: ArgumentCandidate[] = [
  {
    id: "argument-modeling-before-tooling",
    projectId: ocpmDemoProjectId,
    analysisSource: "mock",
    evidenceLevel: "mixed",
    status: "accepted",
    confidence: "medium",
    claim:
      "A survey should separate object-centric modeling foundations from tooling and evaluation maturity.",
    rationale:
      "Confirmed demo records support the modeling theme, while evaluation and tooling details remain less certain.",
    supportingPaperIds: ["van2019object", "van2021object", "berti2023advancements"],
    relatedGapIds: ["gap-evaluation-breadth"],
    evidence: [
      {
        paperId: "van2019object",
        sourceField: "abstract",
        note: "Supports modeling foundation theme.",
      },
      {
        paperId: "van2021object",
        sourceField: "abstract",
        note: "Supports event data and analysis task theme.",
      },
    ],
    createdAt,
    updatedAt,
  },
];

export const ocpmDemoInnovationOpportunities: InnovationOpportunity[] = [
  {
    id: "innovation-evidence-aware-matrix",
    projectId: ocpmDemoProjectId,
    analysisSource: "mock",
    evidenceLevel: "mixed",
    status: "saved-as-idea",
    confidence: "tentative",
    title: "Evidence-aware OCPM comparison matrix",
    opportunity:
      "Create a matrix that distinguishes metadata-only, abstract-based, and full-text claims when comparing OCPM methods.",
    rationale:
      "The demo workflow shows that synthesis quality depends on clearly separating confirmed extraction values from tentative suggestions.",
    supportingPaperIds: ["van2019object", "van2021object", "berti2023advancements"],
    relatedGapIds: ["gap-evaluation-breadth"],
    evidence: [
      {
        paperId: "van2021object",
        sourceField: "abstract",
        note: "Evaluation detail is incomplete in demo evidence.",
      },
    ],
    createdAt,
    updatedAt,
  },
];

export const ocpmDemoWritingPlan: WritingPlan = {
  id: "writing-plan-ocpm-demo",
  projectId: ocpmDemoProjectId,
  analysisSource: "mock",
  evidenceLevel: "mixed",
  status: "accepted",
  confidence: "medium",
  title: "OCPM Survey Writing Plan",
  sections: [
    {
      id: "writing-section-1",
      heading: "Motivation: limits of case-centric logs",
      purpose: "Explain why multi-object process data motivates object-centric modeling.",
      supportingPaperIds: ["van2019object", "van2021object"],
      notes: "Use only confirmed extraction rows for final claims.",
    },
    {
      id: "writing-section-2",
      heading: "Evidence maturity and open evaluation questions",
      purpose: "Separate confirmed findings from tentative gaps about evaluation breadth.",
      supportingPaperIds: ["van2021object"],
      notes: "Do not overclaim evaluation results without full-text evidence.",
    },
  ],
  evidence: [
    {
      paperId: "van2019object",
      sourceField: "abstract",
      note: "Supports the motivation section at abstract level.",
    },
    {
      paperId: "van2021object",
      sourceField: "abstract",
      note: "Supports the evaluation gap section at abstract level.",
    },
  ],
  createdAt,
  updatedAt,
};

export const ocpmDemoPresentationPlan: PresentationPlan = {
  id: "presentation-plan-ocpm-demo",
  projectId: ocpmDemoProjectId,
  analysisSource: "mock",
  evidenceLevel: "mixed",
  status: "accepted",
  confidence: "medium",
  title: "OCPM Survey Presentation Plan",
  slides: [
    {
      id: "slide-1",
      title: "Why object-centric process mining?",
      objective: "Frame the need for multi-object analysis.",
      supportingPaperIds: ["van2019object", "van2021object"],
      speakerNotes: "Use demo evidence labels to distinguish abstract-based claims.",
    },
    {
      id: "slide-2",
      title: "From extraction matrix to synthesis",
      objective: "Show that confirmed extraction values drive themes, gaps, and arguments.",
      supportingPaperIds: ["van2019object", "van2021object", "berti2023advancements"],
      speakerNotes: "Avoid presenting pending-review suggestions as facts.",
    },
  ],
  evidence: [
    {
      paperId: "van2019object",
      sourceField: "abstract",
      note: "Supports the motivation slide at abstract level.",
    },
    {
      paperId: "van2021object",
      sourceField: "abstract",
      note: "Supports the synthesis workflow slide at abstract level.",
    },
  ],
  createdAt,
  updatedAt,
};

export const ocpmDemoAnalysisRuns: AnalysisRun[] = [
  {
    id: "analysis-run-demo-overview",
    projectId: ocpmDemoProjectId,
    runType: "overview",
    analysisSource: "mock",
    status: "completed",
    startedAt: createdAt,
    completedAt: updatedAt,
    errorCode: null,
    errorMessage: null,
    createdAt,
    updatedAt,
  },
];

export const ocpmDemoImportJobs: ImportJob[] = [
  {
    id: "import-job-demo-seed",
    projectId: ocpmDemoProjectId,
    importType: "manual-notes",
    analysisSource: "mock",
    status: "imported",
    inputSummary: "Seeded deterministic OCPM demo records.",
    recordsCreated: 5,
    recordsRejected: 0,
    validationErrors: [],
    createdAt,
    updatedAt,
  },
];

export const ocpmDemoData = {
  project: ocpmDemoProject,
  researchQuestions: ocpmDemoResearchQuestions,
  keywordGroups: ocpmDemoKeywordGroups,
  papers: ocpmDemoPapers,
  paperOverviews: ocpmDemoPaperOverviews,
  aiSuggestions: ocpmDemoAISuggestions,
  reviewDecisions: ocpmDemoReviewDecisions,
  extractionMatrixRows: ocpmDemoExtractionMatrixRows,
  themeClusters: ocpmDemoThemeClusters,
  consensusConflictItems: ocpmDemoConsensusConflictItems,
  gapItems: ocpmDemoGapItems,
  argumentCandidates: ocpmDemoArgumentCandidates,
  innovationOpportunities: ocpmDemoInnovationOpportunities,
  writingPlan: ocpmDemoWritingPlan,
  presentationPlan: ocpmDemoPresentationPlan,
  analysisRuns: ocpmDemoAnalysisRuns,
  importJobs: ocpmDemoImportJobs,
};
