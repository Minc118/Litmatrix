"use client";

import { AppSidebar } from "@/components/layout/AppSidebar";
import { WorkspaceTopBar } from "@/components/layout/WorkspaceTopBar";
import { UploadDropzone } from "@/components/import/UploadDropzone";
import { WorkflowSteps } from "@/components/import/WorkflowSteps";
import { useLitmatrixResource } from "@/lib/api/useLitmatrixResource";
import type { ProviderStatusResponse } from "@/lib/types/litmatrix";

export function NewAnalysisWorkspace() {
  const { data: providerStatus } = useLitmatrixResource<ProviderStatusResponse>("/api/providers/status");

  return (
    <main className="flex min-h-screen bg-background text-foreground">
      <AppSidebar />
      <section className="min-w-0 flex-1">
        <WorkspaceTopBar title="New Analysis" context="Import workspace" actionLabel="Demo" />
        <div className="grid gap-8 p-6 xl:grid-cols-[minmax(0,1fr)_360px]">
          <div className="space-y-8">
            <header>
              <p className="lm-label">Paper Intake</p>
              <h1 className="mt-2 text-3xl font-semibold tracking-tight text-foreground">Start a focused paper review</h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-muted">
                Upload a PDF to generate an overview before deciding whether it is worth deeper extraction.
              </p>
            </header>
            <UploadDropzone />
            <section className="lm-card p-6">
              <p className="lm-label">Workflow Guide</p>
              <div className="mt-6">
                <WorkflowSteps />
              </div>
            </section>
          </div>
          <aside className="space-y-6">
            <section className="lm-card p-6">
              <div className="mb-6 h-36 rounded bg-[linear-gradient(135deg,#eeeeee,#f8fafc)]" />
              <h2 className="text-xl font-semibold tracking-tight text-foreground">Focused Literature Review</h2>
              <p className="mt-3 text-sm leading-6 text-muted">
                Keep import, overview, extraction, review, and synthesis separate so every claim stays traceable.
              </p>
            </section>
            <section className="lm-card p-6">
              <p className="lm-label">Provider Status</p>
              <div className="mt-4 space-y-3">
                {[...(providerStatus?.providers ?? []), ...(providerStatus?.importers ?? [])].map((provider) => (
                  <div key={provider.id} className="rounded border border-border/50 bg-[#f8fafc] p-3">
                    <p className="text-sm font-semibold text-foreground">{provider.label}</p>
                    <p className="mt-1 text-xs leading-5 text-muted">{provider.message}</p>
                  </div>
                ))}
              </div>
            </section>
            <section className="lm-card p-6">
              <h3 className="text-sm font-bold text-foreground">Matrix Alignment</h3>
              <p className="mt-2 text-sm leading-6 text-muted">
                Confirmed insights will map to the active project matrix after review. This phase keeps that
                behavior static.
              </p>
            </section>
          </aside>
        </div>
      </section>
    </main>
  );
}
