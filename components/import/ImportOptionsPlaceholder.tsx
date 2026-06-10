import { DataPreview } from "@/components/common/DataPreview";
import { Badge } from "@/components/common/Badge";

export function ImportOptionsPlaceholder() {
  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
      <section className="rounded border border-border bg-surface p-6">
        <h2 className="text-lg font-semibold">New analysis insertion point</h2>
        <p className="mt-2 text-sm leading-6 text-muted">
          Reserved for the prototype upload workspace. PDF upload, Zotero import, and Antigravity import are
          visible as planned integrations only; no provider or importer calls run from this UI.
        </p>
        <div className="mt-5 grid gap-3 sm:grid-cols-3">
          <Badge>PDF upload coming soon</Badge>
          <Badge>Zotero not connected</Badge>
          <Badge>Manual import placeholder</Badge>
        </div>
      </section>
      <DataPreview endpoint="/api/providers/status" label="Provider status API" />
    </div>
  );
}
