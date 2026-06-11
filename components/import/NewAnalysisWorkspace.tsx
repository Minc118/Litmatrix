"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { WorkspaceTopBar } from "@/components/layout/WorkspaceTopBar";
import { Plus, Trash, AlertTriangle, ChevronRight, ChevronLeft, Check, Loader2 } from "lucide-react";

interface ExtractionFieldSelection {
  key: string;
  label: string;
  required: boolean;
  description: string;
  selected: boolean;
}

const DEFAULT_FIELDS: ExtractionFieldSelection[] = [
  { key: "researchProblem", label: "Research Problem", required: true, description: "The core research problem addressed by the paper", selected: true },
  { key: "researchQuestions", label: "Research Questions Addressed", required: false, description: "Which of your research questions this paper addresses", selected: true },
  { key: "method", label: "Method / Approach", required: true, description: "The methodologies, techniques, or algorithms proposed", selected: true },
  { key: "contribution", label: "Main Contribution", required: false, description: "The main contribution or artifact produced by the paper", selected: true },
  { key: "keyConcepts", label: "Key Concepts", required: false, description: "Key terminology and concept definitions", selected: true },
  { key: "evaluationMethod", label: "Evaluation Method", required: false, description: "How the researchers evaluated their proposal", selected: true },
  { key: "dataset", label: "Dataset / Empirical Material", required: false, description: "The datasets, benchmarks, or empirical subjects used", selected: true },
  { key: "findings", label: "Findings", required: true, description: "Key results, findings, and evaluation metrics", selected: true },
  { key: "limitations", label: "Limitations", required: false, description: "Known limitations acknowledged in the text", selected: true },
  { key: "futureWork", label: "Future Work", required: false, description: "Avenues for future research indicated by authors", selected: true },
  { key: "researchGap", label: "Research Gap", required: false, description: "Identified research gaps or unresolved challenges", selected: true },
  { key: "usefulEvidence", label: "Useful Evidence", required: false, description: "Key quotes or evidence snippets of interest", selected: true },
  { key: "relevance", label: "Relevance to User's Paper", required: false, description: "Direct relevance to your own research topic", selected: false },
  { key: "writingUse", label: "Possible Use in Writing", required: false, description: "Where or how you might cite/discuss this in your paper", selected: false },
];

export function NewAnalysisWorkspace() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form State
  const [title, setTitle] = useState("");
  const [topic, setTopic] = useState("");
  const [reviewType, setReviewType] = useState("Systematic Literature Review");
  const [writingGoal, setWritingGoal] = useState("Survey Paper");
  const [rqs, setRqs] = useState<string[]>([""]);
  const [fields, setFields] = useState<ExtractionFieldSelection[]>(DEFAULT_FIELDS);
  const [customFields, setCustomFields] = useState<Array<{ key: string; label: string; description: string }>>([]);
  const [newCustomKey, setNewCustomKey] = useState("");
  const [newCustomLabel, setNewCustomLabel] = useState("");
  const [newCustomDesc, setNewCustomDesc] = useState("");

  const handleAddRq = () => {
    setRqs([...rqs, ""]);
  };

  const handleRemoveRq = (index: number) => {
    const newRqs = [...rqs];
    newRqs.splice(index, 1);
    setRqs(newRqs);
  };

  const handleRqChange = (index: number, val: string) => {
    const newRqs = [...rqs];
    newRqs[index] = val;
    setRqs(newRqs);
  };

  const handleToggleField = (key: string) => {
    setFields(
      fields.map((f) => {
        if (f.key === key && !f.required) {
          return { ...f, selected: !f.selected };
        }
        return f;
      })
    );
  };

  const handleAddCustomField = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCustomKey || !newCustomLabel) return;
    const cleanKey = newCustomKey.toLowerCase().replace(/[^a-z0-9]+/g, "");
    if (fields.some((f) => f.key === cleanKey) || customFields.some((f) => f.key === cleanKey)) {
      alert("A field with this key already exists.");
      return;
    }
    setCustomFields([...customFields, { key: cleanKey, label: newCustomLabel, description: newCustomDesc }]);
    setNewCustomKey("");
    setNewCustomLabel("");
    setNewCustomDesc("");
  };

  const handleRemoveCustomField = (key: string) => {
    setCustomFields(customFields.filter((f) => f.key !== key));
  };

  const handleSubmit = async () => {
    if (!title || !topic) {
      setError("Project Title and Topic are required.");
      setStep(1);
      return;
    }
    setLoading(true);
    setError(null);

    const activeRqs = rqs.filter((r) => r.trim() !== "");
    const selectedFields = [
      ...fields.filter((f) => f.selected).map((f) => ({ key: f.key, label: f.label, required: f.required, description: f.description })),
      ...customFields.map((f) => ({ key: f.key, label: f.label, required: false, description: f.description })),
    ];

    try {
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          topic,
          reviewType,
          writingGoal,
          researchQuestions: activeRqs.length > 0 ? activeRqs : ["What are the main methods and findings?"],
          extractionFields: selectedFields,
        }),
      });

      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.error?.message || "Failed to create project");
      }

      // Successful creation! Redirect to the project dashboard page
      router.push(`/projects/${json.data.id}`);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "An unexpected error occurred.";
      setError(msg);
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen bg-background text-foreground">
      <AppSidebar />
      <section className="min-w-0 flex-1">
        <WorkspaceTopBar title="New Analysis" context="Setup workspace" />
        <div className="mx-auto max-w-4xl p-6 md:p-10 space-y-8">
          <div>
            <p className="lm-label">Topic-Agnostic Setup</p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-foreground">Create Literature Review Project</h1>
            <p className="mt-2 text-sm leading-6 text-muted">
              Define your custom systematic literature review topic, questions, and evidence schema.
            </p>
          </div>

          {/* Stepper Header */}
          <div className="flex items-center justify-between border-b border-border/50 pb-4">
            <div className="flex gap-6 text-sm font-semibold">
              <span className={step === 1 ? "text-foreground border-b-2 border-foreground pb-4 mb-[-18px]" : "text-muted"}>1. Project Info</span>
              <span className={step === 2 ? "text-foreground border-b-2 border-foreground pb-4 mb-[-18px]" : "text-muted"}>2. Research Questions</span>
              <span className={step === 3 ? "text-foreground border-b-2 border-foreground pb-4 mb-[-18px]" : "text-muted"}>3. Extraction Schema</span>
            </div>
            <span className="text-xs text-muted font-medium">Step {step} of 3</span>
          </div>

          {error && (
            <div className="rounded border border-red-200 bg-red-50 p-4 text-sm text-red-700 flex gap-2">
              <AlertTriangle className="h-5 w-5 shrink-0 text-red-500" />
              <div>
                <p className="font-semibold">Error Creating Project</p>
                <p className="mt-1">{error}</p>
              </div>
            </div>
          )}

          {/* Step 1: Info */}
          {step === 1 && (
            <div className="lm-card p-6 space-y-6">
              <div className="space-y-4">
                <div>
                  <label htmlFor="project-title" className="block text-sm font-semibold text-foreground">Project Title</label>
                  <input
                    id="project-title"
                    type="text"
                    placeholder="e.g., Deep Learning in Medical Imaging"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="mt-2 w-full rounded border border-border/80 bg-surface px-4 py-2.5 text-sm outline-none focus:border-foreground transition-colors"
                  />
                </div>
                <div>
                  <label htmlFor="project-topic" className="block text-sm font-semibold text-foreground">Research Topic</label>
                  <input
                    id="project-topic"
                    type="text"
                    placeholder="e.g., Computer-aided diagnosis of pulmonary nodules using CNNs"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    className="mt-2 w-full rounded border border-border/80 bg-surface px-4 py-2.5 text-sm outline-none focus:border-foreground transition-colors"
                  />
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="review-type" className="block text-sm font-semibold text-foreground">Review Type</label>
                    <select
                      id="review-type"
                      value={reviewType}
                      onChange={(e) => setReviewType(e.target.value)}
                      className="mt-2 w-full rounded border border-border/80 bg-surface px-4 py-2.5 text-sm outline-none focus:border-foreground transition-colors"
                    >
                      <option>Systematic Literature Review</option>
                      <option>Survey Paper / Overview</option>
                      <option>Thesis Survey Chapter</option>
                      <option>Seminar Paper Workspace</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="writing-goal" className="block text-sm font-semibold text-foreground">Writing Goal</label>
                    <input
                      id="writing-goal"
                      type="text"
                      placeholder="e.g., Complete Survey Paper for CVPR"
                      value={writingGoal}
                      onChange={(e) => setWritingGoal(e.target.value)}
                      className="mt-2 w-full rounded border border-border/80 bg-surface px-4 py-2.5 text-sm outline-none focus:border-foreground transition-colors"
                    />
                  </div>
                </div>
              </div>

              <div className="rounded border border-amber-200 bg-amber-50/50 p-4 flex gap-3">
                <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
                <div className="text-xs text-amber-800 leading-relaxed">
                  <p className="font-semibold">Local Session Storage Warning</p>
                  <p className="mt-1">
                    Database persistence is currently configured as in-memory / local fallback. The project you create will be stored in server process memory and will remain accessible during your current session, but it **will be deleted upon server restart**.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Research Questions */}
          {step === 2 && (
            <div className="lm-card p-6 space-y-6">
              <div>
                <h2 className="text-lg font-semibold text-foreground">Define Research Questions</h2>
                <p className="text-xs text-muted mt-1">
                  Add the core research questions you want this review to address. Every gap, argument, and matrix cell will map back to these questions.
                </p>
              </div>

              <div className="space-y-3">
                {rqs.map((rq, index) => (
                  <div key={index} className="flex gap-2 items-center">
                    <span className="font-mono text-xs text-muted w-12 shrink-0">RQ-{index + 1}</span>
                    <input
                      type="text"
                      placeholder={`e.g., What neural network architectures achieve the highest accuracy?`}
                      value={rq}
                      onChange={(e) => handleRqChange(index, e.target.value)}
                      className="flex-1 rounded border border-border/80 bg-surface px-4 py-2 text-sm outline-none focus:border-foreground transition-colors"
                    />
                    {rqs.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveRq(index)}
                        className="p-2 text-muted hover:text-red-600 transition-colors"
                        title="Remove question"
                      >
                        <Trash className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>

              <button
                type="button"
                onClick={handleAddRq}
                className="flex items-center gap-1.5 text-xs font-semibold text-[#1f2933] hover:text-black border border-dashed border-border/80 rounded px-4 py-2 hover:bg-[#f8fafc] transition-all"
              >
                <Plus className="h-3.5 w-3.5" />
                Add Research Question
              </button>
            </div>
          )}

          {/* Step 3: Extraction Fields */}
          {step === 3 && (
            <div className="space-y-6">
              <div className="lm-card p-6 space-y-6">
                <div>
                  <h2 className="text-lg font-semibold text-foreground">Define Extraction Schema</h2>
                  <p className="text-xs text-muted mt-1">
                    Select which fields to include in your literature matrix. The system will guide AI extractors and validate user reviews against these choices.
                  </p>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  {fields.map((f) => (
                    <div
                      key={f.key}
                      onClick={() => !f.required && handleToggleField(f.key)}
                      className={`rounded border p-4 cursor-pointer select-none transition-all flex items-start gap-3 ${
                        f.selected
                          ? "border-foreground bg-surface"
                          : "border-border/50 bg-[#f8fafc] opacity-60 hover:opacity-80"
                      }`}
                    >
                      <div className={`mt-0.5 rounded border flex items-center justify-center h-4 w-4 ${f.selected ? "border-foreground bg-[#1f2933] text-white" : "border-border bg-white"}`}>
                        {f.selected && <Check className="h-3 w-3 stroke-[3]" />}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold text-foreground">{f.label}</span>
                          {f.required && (
                            <span className="rounded bg-[#ffe3e3] text-[#b30000] px-1 py-0.5 text-[9px] font-bold">
                              REQUIRED
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-muted mt-1 leading-relaxed">{f.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Custom Fields Card */}
              <div className="lm-card p-6 space-y-6">
                <div>
                  <h2 className="text-lg font-semibold text-foreground">Add Custom Extraction Fields</h2>
                  <p className="text-xs text-muted mt-1">
                    Tailor the extraction matrix to your specific review topic.
                  </p>
                </div>

                {customFields.length > 0 && (
                  <div className="space-y-2 border-b border-border/40 pb-4">
                    <p className="text-xs font-semibold text-muted">Active Custom Fields:</p>
                    <div className="grid gap-2 sm:grid-cols-2">
                      {customFields.map((cf) => (
                        <div key={cf.key} className="rounded border border-border/50 bg-surface px-4 py-3 flex items-center justify-between">
                          <div>
                            <span className="text-sm font-semibold text-foreground">{cf.label}</span>
                            <span className="block font-mono text-[10px] text-muted">{cf.key}</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleRemoveCustomField(cf.key)}
                            className="p-1.5 text-muted hover:text-red-600 transition-colors"
                          >
                            <Trash className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <form onSubmit={handleAddCustomField} className="grid gap-4 sm:grid-cols-3 items-end bg-[#f8fafc] p-4 rounded border border-border/30">
                  <div>
                    <label htmlFor="custom-label" className="block text-xs font-semibold text-foreground">Field Label</label>
                    <input
                      id="custom-label"
                      type="text"
                      placeholder="e.g., Accuracy Metric"
                      value={newCustomLabel}
                      onChange={(e) => {
                        setNewCustomLabel(e.target.value);
                        setNewCustomKey(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, ""));
                      }}
                      className="mt-1.5 w-full rounded border border-border/80 bg-surface px-3 py-1.5 text-xs outline-none focus:border-foreground"
                    />
                  </div>
                  <div>
                    <label htmlFor="custom-key" className="block text-xs font-semibold text-foreground">Field Key (camelCase)</label>
                    <input
                      id="custom-key"
                      type="text"
                      placeholder="e.g., accuracyMetric"
                      value={newCustomKey}
                      onChange={(e) => setNewCustomKey(e.target.value.replace(/[^a-zA-Z0-9]+/g, ""))}
                      className="mt-1.5 w-full rounded border border-border/80 bg-surface px-3 py-1.5 text-xs outline-none focus:border-foreground"
                    />
                  </div>
                  <div className="flex gap-2">
                    <div className="flex-1">
                      <label htmlFor="custom-desc" className="block text-xs font-semibold text-foreground">Description</label>
                      <input
                        id="custom-desc"
                        type="text"
                        placeholder="e.g., Metric used (F1, AUC, etc.)"
                        value={newCustomDesc}
                        onChange={(e) => setNewCustomDesc(e.target.value)}
                        className="mt-1.5 w-full rounded border border-border/80 bg-surface px-3 py-1.5 text-xs outline-none focus:border-foreground"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={!newCustomKey || !newCustomLabel}
                      className="rounded bg-[#1f2933] text-white px-3 py-1.5 text-xs font-semibold hover:bg-black disabled:opacity-40 transition-colors h-[31px] flex items-center justify-center"
                    >
                      Add
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Navigation Controls */}
          <div className="flex justify-between items-center pt-4 border-t border-border/40">
            <button
              type="button"
              onClick={() => setStep(step - 1)}
              disabled={step === 1 || loading}
              className="flex items-center gap-1.5 rounded border border-border px-4 py-2 text-sm font-semibold hover:bg-[#f8fafc] disabled:opacity-40 transition-all text-muted hover:text-foreground"
            >
              <ChevronLeft className="h-4 w-4" />
              Back
            </button>

            {step < 3 ? (
              <button
                type="button"
                onClick={() => {
                  if (step === 1 && (!title || !topic)) {
                    setError("Project Title and Topic are required.");
                    return;
                  }
                  setError(null);
                  setStep(step + 1);
                }}
                className="flex items-center gap-1.5 rounded bg-[#1f2933] text-white px-5 py-2 text-sm font-semibold hover:bg-black transition-all"
              >
                Continue
                <ChevronRight className="h-4 w-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={loading}
                className="flex items-center gap-1.5 rounded bg-[#1c7ed6] hover:bg-[#1971c2] text-white px-6 py-2 text-sm font-semibold transition-all disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Creating Workspace...
                  </>
                ) : (
                  <>
                    Create Project
                    <ChevronRight className="h-4 w-4" />
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
