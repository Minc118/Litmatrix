"use client";

import { useEffect, useState } from "react";
import { apiGet, LitMatrixApiError } from "@/lib/api/litmatrixClient";

function summarizeData(data: unknown): string {
  if (Array.isArray(data)) {
    return `${data.length} records`;
  }
  if (data === null) {
    return "No record";
  }
  if (typeof data === "object") {
    return `${Object.keys(data as Record<string, unknown>).length} fields`;
  }
  return String(data);
}

export function DataPreview({ endpoint, label }: { endpoint: string; label: string }) {
  const [data, setData] = useState<unknown>(null);
  const [summary, setSummary] = useState("Loading");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    apiGet<unknown>(endpoint)
      .then((result) => {
        if (!active) {
          return;
        }
        setData(result);
        setSummary(summarizeData(result));
        setError(null);
      })
      .catch((err: unknown) => {
        if (!active) {
          return;
        }
        const message =
          err instanceof LitMatrixApiError ? `${err.code}: ${err.message}` : "Unable to load demo data.";
        setError(message);
        setSummary("Unavailable");
      });

    return () => {
      active = false;
    };
  }, [endpoint]);

  return (
    <section className="rounded border border-border bg-surface p-5 shadow-sm">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-muted">{label}</p>
          <p className="mt-1 text-sm text-muted">{endpoint}</p>
        </div>
        <div className="rounded-sm border border-border bg-surface-muted px-3 py-2 text-sm font-medium">
          {summary}
        </div>
      </div>
      {error ? (
        <p className="mt-4 rounded-sm border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">{error}</p>
      ) : (
        <pre className="mt-4 max-h-80 overflow-auto rounded-sm bg-[#f8fafc] p-4 text-xs leading-5 text-muted">
          {JSON.stringify(data, null, 2)}
        </pre>
      )}
    </section>
  );
}
