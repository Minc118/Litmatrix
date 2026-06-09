import { FileUp } from "lucide-react";

export function UploadDropzone({ compact = false }: { compact?: boolean }) {
  return (
    <div
      className={`lm-panel relative flex flex-col items-center justify-center overflow-hidden border-dashed p-8 text-center ${
        compact ? "min-h-52" : "min-h-80"
      }`}
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(228,226,225,0.7),_transparent_58%)]" />
      <div className="relative flex h-14 w-14 items-center justify-center rounded bg-surface-muted text-foreground">
        <FileUp className="h-7 w-7" aria-hidden="true" />
      </div>
      <h3 className="relative mt-5 text-xl font-semibold tracking-tight text-foreground">Upload Paper PDF</h3>
      <p className="relative mt-2 max-w-md text-sm leading-6 text-muted">
        Drag and drop your PDFs here, or click to browse. Upload behavior is disabled in this demo phase.
      </p>
      <button className="relative mt-6 rounded-sm bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground opacity-70" disabled>
        Select PDF
      </button>
    </div>
  );
}
