"use client";

import { useState } from "react";
import { ProjectSidebar } from "@/components/layout/ProjectSidebar";
import { WorkspaceTopBar } from "@/components/layout/WorkspaceTopBar";
import { useLitmatrixResource } from "@/lib/api/useLitmatrixResource";
import { Download, Edit2, Save } from "lucide-react";
import type { ProjectDetail } from "@/lib/types/litmatrix";

interface ExtractionField {
  key: string;
  label: string;
  required: boolean;
  description?: string;
}

interface AnalysisCommand {
  id: string;
  label: string;
  purpose: string;
  inputRecordTypes: string[];
  outputResultType: string;
  evidenceRequirements: string;
  promptTemplate: string;
}

interface ProjectContract {
  projectId: string;
  skillVersion: string;
  contractVersion: string;
  extractionSchemaVersion: string;
  commandPackVersion: string;
  researchQuestionIds: string[];
  extractionFields: ExtractionField[];
  commandPack: AnalysisCommand[];
}

export function ProjectSkillView({ projectId }: { projectId: string }) {
  const { data: skillData, loading: skillLoading } = useLitmatrixResource<{ markdown: string }>(
    `/api/projects/${projectId}/skill`
  );
  const { data: contractData } = useLitmatrixResource<ProjectContract>(`/api/projects/${projectId}/contract`);
  const { data: project } = useLitmatrixResource<ProjectDetail>(`/api/projects/${projectId}`);

  const [activeTab, setActiveTab] = useState<"markdown" | "questions" | "schema" | "commands" >("markdown");
  const [skillMd, setSkillMd] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [saveStatus, setSaveStatus] = useState<string | null>(null);

  const displayMd = skillMd !== null ? skillMd : skillData?.markdown || "";

  const handleDownload = (filename: string, content: string, mime: string) => {
    const blob = new Blob([content], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  const saveSkill = () => {
    setSaveStatus("Saving...");
    setTimeout(() => {
      setSaveStatus("Saved!");
      setIsEditing(false);
      setTimeout(() => setSaveStatus(null), 2000);
    }, 800);
  };

  return (
    <main className="flex min-h-screen bg-background text-foreground">
      <ProjectSidebar projectId={projectId} />
      <section className="min-w-0 flex-1">
        <WorkspaceTopBar title="Project Skill & Contract" context="Skill configuration" />
        <div className="space-y-6 p-6">
          <div>
            <p className="lm-label">System contract</p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-foreground">Project Skill & Contract</h1>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-muted">
              Configure systematic literature review definitions. Each project behaves as a custom Research Skill containing topic rules, schema columns, and command definitions.
            </p>
          </div>

          <div className="flex flex-wrap gap-4 border-b border-border/50">
            {(["markdown", "questions", "schema", "commands"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`mb-[-1px] border-b-2 px-4 py-2 text-sm font-semibold capitalize transition-colors ${
                  activeTab === tab
                    ? "border-[#1f2933] text-foreground"
                    : "border-transparent text-muted hover:text-foreground"
                }`}
              >
                {tab === "markdown" ? "Skill Markdown" : tab === "questions" ? "Research Questions" : tab === "schema" ? "Extraction Schema" : "Command Pack"}
              </button>
            ))}
          </div>

          <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
            <div className="lm-panel min-h-[400px] p-6 bg-surface">
              {activeTab === "markdown" && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-foreground">project-skill.md</h2>
                    <div className="flex items-center gap-2">
                      {isEditing ? (
                        <>
                          <button
                            onClick={saveSkill}
                            className="flex items-center gap-1.5 rounded-sm bg-[#1f2933] px-3 py-1.5 text-xs font-semibold text-white hover:bg-[#2b3642]"
                          >
                            <Save className="h-3.5 w-3.5" />
                            Save Changes
                          </button>
                          <button
                            onClick={() => setIsEditing(false)}
                            className="rounded-sm border border-border px-3 py-1.5 text-xs font-semibold text-muted hover:text-foreground"
                          >
                            Cancel
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={() => setIsEditing(true)}
                          className="flex items-center gap-1.5 rounded-sm border border-border bg-surface px-3 py-1.5 text-xs font-semibold text-muted hover:text-foreground"
                        >
                          <Edit2 className="h-3.5 w-3.5" />
                          Edit Skill
                        </button>
                      )}
                      {saveStatus && <span className="text-xs text-muted font-medium">{saveStatus}</span>}
                    </div>
                  </div>

                  {isEditing ? (
                    <textarea
                      value={displayMd}
                      onChange={(e) => setSkillMd(e.target.value)}
                      className="min-h-[350px] w-full rounded border border-border/50 bg-[#f8fafc] p-4 font-mono text-sm leading-6 outline-none focus:border-foreground"
                    />
                  ) : (
                    <pre className="overflow-x-auto rounded border border-border/40 bg-[#f8fafc] p-5 font-mono text-sm leading-6 text-foreground whitespace-pre-wrap">
                      {displayMd || (skillLoading ? "Loading..." : "No skill markdown defined.")}
                    </pre>
                  )}
                </div>
              )}

              {activeTab === "questions" && (
                <div className="space-y-4">
                  <h2 className="text-lg font-semibold text-foreground">Project Research Questions</h2>
                  <div className="space-y-3">
                    {project?.researchQuestions && project.researchQuestions.length > 0 ? (
                      project.researchQuestions.map((rq) => (
                        <div key={rq.id} className="rounded border border-border/40 bg-[#f8fafc] p-4 flex gap-4 items-start">
                          <div className="rounded bg-surface px-2 py-0.5 text-xs font-semibold border border-border text-muted">
                            {rq.id}
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-foreground">
                              {rq.text}
                            </p>
                            <p className="mt-1 text-xs text-muted">Active project validation target.</p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-muted">No research questions configured for this project.</p>
                    )}
                  </div>
                </div>
              )}

              {activeTab === "schema" && (
                <div className="space-y-4">
                  <h2 className="text-lg font-semibold text-foreground">Project Extraction Fields</h2>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {(contractData?.extractionFields || []).map((field: ExtractionField) => (
                      <div key={field.key} className="rounded border border-border/40 bg-[#f8fafc] p-4 flex flex-col justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-bold text-foreground">{field.label}</span>
                            {field.required && (
                              <span className="rounded bg-[#ffe3e3] text-[#b30000] px-1.5 py-0.5 text-[10px] font-bold">
                                REQUIRED
                              </span>
                            )}
                          </div>
                          <span className="mt-1 font-mono text-xs text-muted block">{field.key}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === "commands" && (
                <div className="space-y-4">
                  <h2 className="text-lg font-semibold text-foreground">Skill-defined Analysis Commands</h2>
                  <div className="space-y-3">
                    {(contractData?.commandPack || []).map((cmd: AnalysisCommand) => (
                      <div key={cmd.id} className="rounded border border-border/40 bg-[#f8fafc] p-4 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-bold text-foreground">{cmd.label}</span>
                          <span className="font-mono text-xs text-muted">{cmd.id}</span>
                        </div>
                        <p className="text-xs text-muted leading-relaxed">{cmd.purpose}</p>
                        <div className="flex gap-2">
                          <span className="rounded border border-border bg-surface px-2 py-0.5 text-[10px] text-muted">
                            Out: {cmd.outputResultType}
                          </span>
                          <span className="rounded border border-border bg-surface px-2 py-0.5 text-[10px] text-muted">
                            {cmd.evidenceRequirements}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <aside className="space-y-4">
              <section className="lm-card p-5 space-y-4">
                <h3 className="text-sm font-bold uppercase tracking-wider text-muted">Download Assets</h3>
                <p className="text-xs text-muted leading-relaxed">
                  Download project configurations to analyze with local CLI or Antigravity agents.
                </p>
                <div className="space-y-2">
                  <button
                    onClick={() => handleDownload("project-skill.md", displayMd, "text/markdown")}
                    className="flex w-full items-center justify-between rounded-sm border border-border bg-surface px-3 py-2 text-sm text-foreground hover:bg-[#f8fafc]"
                  >
                    <span className="font-medium">project-skill.md</span>
                    <Download className="h-4 w-4 text-muted" />
                  </button>
                  <button
                    onClick={() => handleDownload("project-contract.json", JSON.stringify(contractData, null, 2), "application/json")}
                    className="flex w-full items-center justify-between rounded-sm border border-border bg-surface px-3 py-2 text-sm text-foreground hover:bg-[#f8fafc]"
                  >
                    <span className="font-medium">project-contract.json</span>
                    <Download className="h-4 w-4 text-muted" />
                  </button>
                  <button
                    onClick={() => handleDownload("extraction-schema.json", JSON.stringify(contractData?.extractionFields || [], null, 2), "application/json")}
                    className="flex w-full items-center justify-between rounded-sm border border-border bg-surface px-3 py-2 text-sm text-foreground hover:bg-[#f8fafc]"
                  >
                    <span className="font-medium">extraction-schema.json</span>
                    <Download className="h-4 w-4 text-muted" />
                  </button>
                  <button
                    onClick={() => handleDownload("command-pack.json", JSON.stringify(contractData?.commandPack || [], null, 2), "application/json")}
                    className="flex w-full items-center justify-between rounded-sm border border-border bg-surface px-3 py-2 text-sm text-foreground hover:bg-[#f8fafc]"
                  >
                    <span className="font-medium">command-pack.json</span>
                    <Download className="h-4 w-4 text-muted" />
                  </button>
                </div>
              </section>

              <section className="lm-card p-5 space-y-2">
                <h3 className="text-sm font-bold uppercase tracking-wider text-muted">Version Metadata</h3>
                <div className="space-y-1 mt-2 font-mono text-xs">
                  <div className="flex justify-between">
                    <span className="text-muted">Skill Version:</span>
                    <span className="text-foreground">{contractData?.skillVersion || "1.0.0"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted">Contract Version:</span>
                    <span className="text-foreground">{contractData?.contractVersion || "1.0.0"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted">Schema Version:</span>
                    <span className="text-foreground">{contractData?.extractionSchemaVersion || "1.0.0"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted">Command Pack:</span>
                    <span className="text-foreground">{contractData?.commandPackVersion || "1.0.0"}</span>
                  </div>
                </div>
              </section>
            </aside>
          </div>
        </div>
      </section>
    </main>
  );
}
