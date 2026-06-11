"use client";

import { useState } from "react";
import { ProjectSidebar } from "@/components/layout/ProjectSidebar";
import { WorkspaceTopBar } from "@/components/layout/WorkspaceTopBar";
import { useLitmatrixResource } from "@/lib/api/useLitmatrixResource";
import { AlertCircle, CheckCircle2, Info, RefreshCw, Upload } from "lucide-react";
import type { ImportJob } from "@/lib/types/litmatrix";

type ValidationResult = {
  success: boolean;
  errors?: Array<{ path?: string; message: string }>;
  counts?: {
    recordsCreated: number;
    recordsUpdated: number;
    recordsSkipped: number;
    recordsRejected: number;
  };
  comparisonPossible?: boolean;
  isDryRun?: boolean;
};

type ImportSummary = {
  recordsCreated: number;
  recordsUpdated: number;
  recordsSkipped: number;
  recordsRejected: number;
  importJobId: string;
};

export function ImportConsoleView({ projectId }: { projectId: string }) {
  const [inputMethod, setInputMethod] = useState<"paste" | "upload">("paste");
  const [jsonInput, setJsonInput] = useState<string>("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [validationResult, setValidationResult] = useState<ValidationResult | null>(null);
  const [confirmedRealImport, setConfirmedRealImport] = useState<boolean>(false);
  const [importStatus, setImportStatus] = useState<"idle" | "success" | "failed">("idle");
  const [importSummary, setImportSummary] = useState<ImportSummary | null>(null);

  // Fetch job history
  const { data: jobHistory, reload: reloadHistory } = useLitmatrixResource<ImportJob[]>(
    `/api/projects/${projectId}/import-jobs`
  );

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setErrorMsg(null);
    setValidationResult(null);
    setImportStatus("idle");
    setImportSummary(null);

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        // Basic check to see if it is JSON
        JSON.parse(text);
        setJsonInput(text);
      } catch {
        setErrorMsg("Selected file is not valid JSON.");
      }
    };
    reader.onerror = () => {
      setErrorMsg("Failed to read JSON file.");
    };
    reader.readAsText(file);
  };

  const handleValidateSchema = () => {
    setErrorMsg(null);
    setValidationResult(null);
    setImportStatus("idle");
    setImportSummary(null);

    if (!jsonInput.trim()) {
      setErrorMsg("Please paste or upload a JSON payload first.");
      return;
    }

    try {
      const parsed = JSON.parse(jsonInput) as Record<string, unknown>;
      
      // Project boundary validation in UI
      if (parsed.projectId !== projectId) {
        setErrorMsg(
          `Project boundary violation: Payload projectId ("${parsed.projectId}") does not match this workspace ID ("${projectId}").`
        );
        return;
      }

      // Payload looks like valid JSON. Let's Zod validation by calling the API dryRun
      handleRunDryRun(parsed, true); // true means validation only, skip full count comparison if desired (or just run dry-run)
    } catch {
      setErrorMsg("Invalid JSON syntax. Please check for trailing commas or mismatched brackets.");
    }
  };

  const handleRunDryRun = async (parsedPayload?: Record<string, unknown>, isValidationOnly: boolean = false) => {
    setErrorMsg(null);
    setIsLoading(true);
    setImportStatus("idle");
    setImportSummary(null);

    let payloadToSend = parsedPayload;
    if (!payloadToSend) {
      try {
        payloadToSend = JSON.parse(jsonInput) as Record<string, unknown>;
      } catch {
        setErrorMsg("Invalid JSON syntax.");
        setIsLoading(false);
        return;
      }
    }

    // Project boundary validation
    if (payloadToSend.projectId !== projectId) {
      setErrorMsg(
        `Project boundary violation: Payload projectId ("${payloadToSend.projectId}") does not match this workspace ID ("${projectId}").`
      );
      setIsLoading(false);
      return;
    }

    try {
      const res = await fetch(`/api/import/antigravity-json?dryRun=true&projectId=${projectId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payloadToSend),
      });

      const json = await res.json();
      if (!res.ok) {
        if (json.code === "IMPORT_VALIDATION_FAILED" && json.details?.validationErrors) {
          setValidationResult({
            success: false,
            errors: json.details.validationErrors,
          });
        } else {
          setErrorMsg(json.message || "Dry-run validation request failed.");
        }
      } else {
        setValidationResult({
          success: true,
          errors: [],
          counts: {
            recordsCreated: json.data.recordsCreated,
            recordsUpdated: json.data.recordsUpdated,
            recordsSkipped: json.data.recordsSkipped,
            recordsRejected: json.data.recordsRejected,
          },
          comparisonPossible: json.data.comparisonPossible,
          isDryRun: !isValidationOnly,
        });
      }
    } catch {
      setErrorMsg("Network error encountered during dry-run validation.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleExecuteImport = async () => {
    if (!validationResult || !validationResult.success) {
      setErrorMsg("You must run validation / dry-run successfully before importing.");
      return;
    }

    setErrorMsg(null);
    setIsLoading(true);
    setImportStatus("idle");
    setImportSummary(null);

    try {
      const payloadToSend = JSON.parse(jsonInput) as Record<string, unknown>;
      const res = await fetch(`/api/import/antigravity-json?projectId=${projectId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payloadToSend),
      });

      const json = await res.json();
      if (!res.ok) {
        setImportStatus("failed");
        setErrorMsg(json.message || "Import execution failed.");
      } else {
        setImportStatus("success");
        setImportSummary(json.data as ImportSummary);
        setJsonInput(""); // Clear input on success
        setValidationResult(null);
        setConfirmedRealImport(false);
        void reloadHistory();
      }
    } catch {
      setImportStatus("failed");
      setErrorMsg("Network error occurred during import execution.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen bg-background text-foreground">
      <ProjectSidebar projectId={projectId} />
      <section className="min-w-0 flex-1">
        <WorkspaceTopBar title="Import Console" context="Project Tools" />
        <div className="grid gap-6 p-6 xl:grid-cols-[1fr_420px]">
          
          {/* Main workspace */}
          <div className="space-y-6">
            <header>
              <p className="lm-label">JSON Importer</p>
              <h1 className="mt-2 text-2xl font-bold tracking-tight text-foreground">Antigravity JSON Import Console</h1>
              <p className="mt-2 text-sm leading-6 text-muted">
                Import papers, extractions, AI suggestions, and synthesis plans directly into this workspace.
              </p>
            </header>

            {/* Console Input area */}
            <div className="lm-card p-6">
              <div className="flex border-b border-border/40 pb-4">
                <button
                  className={`px-4 py-2 text-sm font-semibold transition-colors border-b-2 -mb-4 ${
                    inputMethod === "paste"
                      ? "border-foreground text-foreground"
                      : "border-transparent text-muted hover:text-foreground"
                  }`}
                  onClick={() => setInputMethod("paste")}
                >
                  Paste JSON Payload
                </button>
                <button
                  className={`px-4 py-2 text-sm font-semibold transition-colors border-b-2 -mb-4 ${
                    inputMethod === "upload"
                      ? "border-foreground text-foreground"
                      : "border-transparent text-muted hover:text-foreground"
                  }`}
                  onClick={() => setInputMethod("upload")}
                >
                  Upload JSON File
                </button>
              </div>

              <div className="mt-6">
                {inputMethod === "paste" ? (
                  <div>
                    <label htmlFor="json-paste-area" className="block text-xs font-bold uppercase tracking-wider text-muted mb-2">
                      JSON Payload
                    </label>
                    <textarea
                      id="json-paste-area"
                      className="w-full h-80 rounded border border-border/60 bg-[#fafafa] p-4 font-mono text-xs text-foreground focus:border-foreground focus:outline-none"
                      placeholder='{\n  "projectId": "ocpm-project",\n  "papers": [...]\n}'
                      value={jsonInput}
                      onChange={(e) => {
                        setJsonInput(e.target.value);
                        setValidationResult(null);
                        setErrorMsg(null);
                        setImportStatus("idle");
                      }}
                      disabled={isLoading}
                    />
                  </div>
                ) : (
                  <div className="rounded border-2 border-dashed border-border/80 bg-[#fafafa] p-8 text-center">
                    <Upload className="mx-auto h-8 w-8 text-muted" aria-hidden="true" />
                    <div className="mt-4 flex flex-col items-center justify-center text-sm leading-6 text-muted">
                      <label
                        htmlFor="file-upload"
                        className="relative cursor-pointer rounded-sm bg-surface px-3 py-1.5 text-xs font-semibold text-foreground border border-border hover:bg-surface-muted focus-within:outline-none"
                      >
                        <span>Select JSON File</span>
                        <input
                          id="file-upload"
                          name="file-upload"
                          type="file"
                          accept=".json"
                          className="sr-only"
                          onChange={handleFileChange}
                          disabled={isLoading}
                        />
                      </label>
                      <p className="mt-2 text-xs text-muted">Only JSON files up to 10MB are supported.</p>
                    </div>
                    {jsonInput && (
                      <div className="mt-4 rounded bg-[#e6fffa] border border-[#b2f5ea] p-2 text-xs font-medium text-[#006d5b]">
                        ✓ File loaded successfully ({jsonInput.length} characters)
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Action buttons */}
              <div className="mt-6 flex flex-wrap gap-3 border-t border-border/40 pt-6">
                <button
                  className="rounded-sm bg-surface border border-border hover:bg-surface-muted px-4 py-2 text-sm font-semibold text-foreground transition-colors disabled:opacity-50"
                  onClick={handleValidateSchema}
                  disabled={isLoading}
                >
                  Validate Schema
                </button>
                <button
                  className="rounded-sm bg-surface border border-border hover:bg-surface-muted px-4 py-2 text-sm font-semibold text-foreground transition-colors disabled:opacity-50"
                  onClick={() => handleRunDryRun()}
                  disabled={isLoading}
                >
                  Dry-Run Preview
                </button>
                
                {validationResult?.success && (
                  <div className="flex items-center gap-3 ml-auto">
                    <label className="inline-flex items-center gap-2 text-xs font-semibold text-foreground cursor-pointer">
                      <input
                        type="checkbox"
                        className="rounded border-border"
                        checked={confirmedRealImport}
                        onChange={(e) => setConfirmedRealImport(e.target.checked)}
                      />
                      Confirm Real Import
                    </label>
                    <button
                      className={`rounded-sm px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors disabled:opacity-50 ${
                        confirmedRealImport
                          ? "bg-foreground hover:bg-foreground/90"
                          : "bg-foreground/50 cursor-not-allowed"
                      }`}
                      onClick={handleExecuteImport}
                      disabled={isLoading || !confirmedRealImport}
                    >
                      Execute Import
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Error notifications */}
            {errorMsg && (
              <div className="rounded border border-danger/30 bg-[#fff5f5] p-4 flex gap-3">
                <AlertCircle className="h-5 w-5 text-danger shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-danger">Error Encountered</p>
                  <p className="mt-1 text-xs leading-5 text-danger">{errorMsg}</p>
                </div>
              </div>
            )}

            {/* Validation Errors Pane */}
            {validationResult && !validationResult.success && validationResult.errors && (
              <div className="rounded border border-danger/30 bg-[#fff5f5] p-5">
                <div className="flex gap-2">
                  <AlertCircle className="h-5 w-5 text-danger" />
                  <h3 className="text-sm font-bold text-danger">Validation Failed ({validationResult.errors.length} errors)</h3>
                </div>
                <div className="mt-4 max-h-56 overflow-y-auto rounded bg-surface border border-border/50 font-mono text-[11px] text-foreground p-3 space-y-2">
                  {validationResult.errors.map((err, idx) => (
                    <div key={idx} className="border-b border-border/30 pb-1.5 last:border-0 last:pb-0">
                      <span className="font-semibold text-danger">{err.path || "root"}:</span> {err.message}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Dry-Run Result Preview */}
            {validationResult?.success && validationResult.counts && (
              <div className="rounded border border-success/30 bg-[#f6ffed] p-5">
                <div className="flex items-center justify-between gap-3 flex-wrap">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-success" />
                    <h3 className="text-sm font-bold text-success">
                      {validationResult.isDryRun ? "Dry-Run Preview Successful" : "Schema Validation Successful"}
                    </h3>
                  </div>
                  <span className="rounded-sm bg-[#e8ffdb] px-2 py-0.5 text-xs font-semibold text-[#389e0d]">
                    Ready to Import
                  </span>
                </div>

                {!validationResult.comparisonPossible && (
                  <div className="mt-3 rounded border border-warning/30 bg-[#fffbe6] p-3 flex gap-2.5">
                    <Info className="h-4.5 w-4.5 text-warning shrink-0 mt-0.5" />
                    <p className="text-xs leading-5 text-warning">
                      <strong>Demo Mode (No Database Configured)</strong>: Existing-record comparison is not available in demo mode. The counts below reflect the raw entities defined in the payload. Real import will remain disabled.
                    </p>
                  </div>
                )}

                <div className="mt-4 grid grid-cols-3 gap-3">
                  <div className="rounded border border-border/50 bg-surface p-4 text-center">
                    <p className="text-2xl font-bold text-foreground">{validationResult.counts.recordsCreated}</p>
                    <p className="mt-1 text-xs text-muted">To Create</p>
                  </div>
                  <div className="rounded border border-border/50 bg-surface p-4 text-center">
                    <p className="text-2xl font-bold text-foreground">{validationResult.counts.recordsUpdated}</p>
                    <p className="mt-1 text-xs text-muted">To Update</p>
                  </div>
                  <div className="rounded border border-border/50 bg-surface p-4 text-center">
                    <p className="text-2xl font-bold text-foreground">{validationResult.counts.recordsSkipped}</p>
                    <p className="mt-1 text-xs text-muted">Skipped (Reviewed)</p>
                  </div>
                </div>
              </div>
            )}

            {/* Import Execution Result */}
            {importStatus === "success" && importSummary && (
              <div className="rounded border border-success/30 bg-[#f6ffed] p-5">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-success" />
                  <h3 className="text-sm font-bold text-success">Import Completed Successfully</h3>
                </div>
                <p className="mt-2 text-xs leading-5 text-muted">
                  Payload was successfully ingested. Import Job ID: <span className="font-mono bg-surface border border-border px-1 py-0.5 rounded text-foreground">{importSummary.importJobId}</span>
                </p>
                <div className="mt-4 grid grid-cols-4 gap-3">
                  <div className="rounded border border-border/50 bg-surface p-3 text-center">
                    <p className="text-lg font-bold text-foreground">{importSummary.recordsCreated}</p>
                    <p className="mt-1 text-[10px] text-muted">Created</p>
                  </div>
                  <div className="rounded border border-border/50 bg-surface p-3 text-center">
                    <p className="text-lg font-bold text-foreground">{importSummary.recordsUpdated}</p>
                    <p className="mt-1 text-[10px] text-muted">Updated</p>
                  </div>
                  <div className="rounded border border-border/50 bg-surface p-3 text-center">
                    <p className="text-lg font-bold text-foreground">{importSummary.recordsSkipped}</p>
                    <p className="mt-1 text-[10px] text-muted">Skipped</p>
                  </div>
                  <div className="rounded border border-border/50 bg-surface p-3 text-center">
                    <p className="text-lg font-bold text-danger">{importSummary.recordsRejected}</p>
                    <p className="mt-1 text-[10px] text-muted">Rejected</p>
                  </div>
                </div>
              </div>
            )}

          </div>

          {/* Sidebar Panel */}
          <div className="space-y-6">
            <section className="lm-card p-5">
              <h3 className="text-sm font-bold text-foreground">Import Details</h3>
              <p className="mt-2 text-xs leading-5 text-muted">
                Antigravity JSON imports allow importing research synthesis assets directly. The importer operates under strict boundary protections:
              </p>
              <ul className="mt-3 text-xs leading-5 text-muted list-disc pl-4 space-y-1">
                <li>Matches payload <code>projectId</code> against active project workspace.</li>
                <li><strong>Protects Reviews</strong>: Existing AI suggestions or extraction rows that have been accepted or edited by reviewers are locked and will never be overwritten.</li>
                <li><strong>Evidence Normalization</strong>: Normalized evidence levels protect full-text claims without generating fake citations.</li>
              </ul>
            </section>

            {/* History logs */}
            <section className="lm-card p-5">
              <div className="flex items-center justify-between gap-3">
                <p className="text-xs font-bold uppercase tracking-wider text-foreground">Import Job History</p>
                <button
                  className="rounded p-1 hover:bg-surface-muted text-muted hover:text-foreground transition-colors"
                  onClick={() => void reloadHistory()}
                  title="Reload history log"
                  disabled={isLoading}
                >
                  <RefreshCw className={`h-3.5 w-3.5 ${isLoading ? "animate-spin" : ""}`} />
                </button>
              </div>

              <div className="mt-4 space-y-3 max-h-[460px] overflow-y-auto">
                {!jobHistory || jobHistory.length === 0 ? (
                  <p className="text-center text-xs text-muted py-6">No past import jobs found.</p>
                ) : (
                  jobHistory.map((job) => {
                    const date = new Date(job.createdAt).toLocaleDateString(undefined, {
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    });
                    const isFailed = job.status === "failed";
                    const isSuccess = job.status === "imported";

                    return (
                      <div key={job.id} className="rounded border border-border/50 bg-[#f8fafc] p-3 text-xs">
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-mono font-semibold text-foreground text-[10px]">{job.id}</span>
                          <span
                            className={`rounded-sm px-1.5 py-0.5 text-[10px] font-bold ${
                              isSuccess
                                ? "bg-[#e6fffa] text-[#006d5b]"
                                : isFailed
                                ? "bg-[#fff5f5] text-danger"
                                : "bg-surface text-muted"
                            }`}
                          >
                            {job.status}
                          </span>
                        </div>
                        <p className="mt-2 text-muted leading-4 font-medium">{job.inputSummary}</p>
                        {job.validationErrors && job.validationErrors.length > 0 && (
                          <div className="mt-2 text-[10px] text-danger border-t border-border/30 pt-2 font-mono">
                            Error: {job.validationErrors[0].message}
                          </div>
                        )}
                        <div className="mt-2.5 flex items-center justify-between gap-2 border-t border-border/20 pt-2 text-[10px] text-muted">
                          <span>{date}</span>
                          {isSuccess && (
                            <span>
                              +{job.recordsCreated} created / -{job.recordsRejected} rejected
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </section>
          </div>

        </div>
      </section>
    </main>
  );
}
