"use client";

import { useState, useRef } from "react";
import { useParams } from "next/navigation";
import { FileUp, Loader2, CheckCircle2, AlertCircle } from "lucide-react";

export function UploadDropzone({ compact = false }: { compact?: boolean }) {
  const params = useParams();
  const projectId = params?.projectId as string | undefined;

  const [status, setStatus] = useState<"idle" | "uploading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [fileName, setFileName] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !projectId) return;

    setFileName(file.name);
    setStatus("uploading");
    setErrorMessage("");

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch(`/api/projects/${projectId}/papers`, {
        method: "POST",
        body: formData,
      });

      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.error?.message || "Failed to upload file");
      }

      setStatus("success");
      setTimeout(() => {
        setStatus("idle");
        window.location.reload();
      }, 1500);
    } catch (err) {
      setStatus("error");
      const msg = err instanceof Error ? err.message : "Upload failed";
      setErrorMessage(msg);
    }
  };

  const triggerSelect = () => {
    fileInputRef.current?.click();
  };

  return (
    <div
      className={`lm-panel relative flex flex-col items-center justify-center overflow-hidden border-dashed p-8 text-center ${
        compact ? "min-h-52" : "min-h-80"
      }`}
    >
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept=".pdf,.rdf"
        className="hidden"
      />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(228,226,225,0.7),_transparent_58%)]" />

      {status === "idle" && (
        <>
          <div className="relative flex h-14 w-14 items-center justify-center rounded bg-surface-muted text-foreground">
            <FileUp className="h-7 w-7" aria-hidden="true" />
          </div>
          <h3 className="relative mt-5 text-xl font-semibold tracking-tight text-foreground">Upload Paper PDF / Zotero RDF</h3>
          <p className="relative mt-2 max-w-md text-sm leading-6 text-muted">
            Drag & drop or select a PDF paper or Zotero RDF collection export.
          </p>
          <button
            onClick={triggerSelect}
            className="relative mt-6 inline-flex items-center gap-2 rounded-sm border border-[#1f2933] bg-[#1f2933] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#2b3642] cursor-pointer"
          >
            Select File
          </button>
        </>
      )}

      {status === "uploading" && (
        <div className="flex flex-col items-center justify-center space-y-4">
          <Loader2 className="h-10 w-10 animate-spin text-[#1c7ed6]" />
          <h3 className="text-lg font-semibold text-foreground">Uploading and parsing...</h3>
          <p className="text-xs text-muted font-mono">{fileName}</p>
        </div>
      )}

      {status === "success" && (
        <div className="flex flex-col items-center justify-center space-y-4">
          <CheckCircle2 className="h-12 w-12 text-green-600" />
          <h3 className="text-lg font-semibold text-foreground">Upload complete!</h3>
          <p className="text-xs text-muted">Reloading workspace...</p>
        </div>
      )}

      {status === "error" && (
        <div className="flex flex-col items-center justify-center space-y-4">
          <AlertCircle className="h-12 w-12 text-red-600" />
          <h3 className="text-lg font-semibold text-foreground">Upload failed</h3>
          <p className="text-xs text-red-500 max-w-xs">{errorMessage}</p>
          <button
            onClick={() => setStatus("idle")}
            className="rounded border border-border px-4 py-1.5 text-xs font-semibold text-muted hover:text-foreground"
          >
            Try Again
          </button>
        </div>
      )}
    </div>
  );
}

