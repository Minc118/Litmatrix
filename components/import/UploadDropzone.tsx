import { FileUp } from "lucide-react";
import { InertActionBadge } from "@/components/common/InertActionBadge";

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
        PDF upload and parsing are not connected yet. Current demo uses seeded OCPM papers.
      </p>
      <button
        className="relative mt-6 inline-flex items-center gap-2 rounded-sm border border-border/60 bg-surface px-5 py-2.5 text-sm font-medium text-muted opacity-80"
        disabled
      >
        Select PDF
        <InertActionBadge label="Coming soon" />
      </button>
    </div>
  );
}
