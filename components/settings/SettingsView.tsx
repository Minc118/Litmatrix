"use client";

import { AppSidebar } from "@/components/layout/AppSidebar";
import { WorkspaceTopBar } from "@/components/layout/WorkspaceTopBar";
import { InertActionBadge } from "@/components/common/InertActionBadge";
import { ImportIntegrationStatus } from "@/components/import/ImportIntegrationStatus";
import { useLitmatrixResource } from "@/lib/api/useLitmatrixResource";
import type { ProviderStatusResponse } from "@/lib/types/litmatrix";

export function SettingsView() {
  const { data: providerStatus } = useLitmatrixResource<ProviderStatusResponse>("/api/providers/status");

  return (
    <main className="flex min-h-screen bg-background text-foreground">
      <AppSidebar />
      <section className="min-w-0 flex-1">
        <WorkspaceTopBar title="Profile & Settings" context="Account" actionLabel="Save" />
        <div className="grid gap-6 p-6 xl:grid-cols-[minmax(0,1fr)_380px]">
          <section className="lm-card p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="lm-label">Profile</p>
                <h1 className="mt-2 text-2xl font-semibold tracking-tight text-foreground">Demo Researcher</h1>
                <p className="mt-2 text-sm leading-6 text-muted">
                  Local demo account shell for future workspace and authentication settings.
                </p>
              </div>
              <InertActionBadge />
            </div>
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              {[
                ["Display name", "Demo Researcher"],
                ["Workspace mode", providerStatus?.demoMode ? "Demo fallback enabled" : "Database-backed"],
                ["Default project", "OCPM Survey"],
                ["Persistence", providerStatus?.demoMode ? "Provider actions gated" : "Configured when DB is available"],
              ].map(([label, value]) => (
                <div key={label} className="rounded border border-border/50 bg-[#f8fafc] p-4">
                  <p className="lm-label">{label}</p>
                  <p className="mt-2 text-sm font-medium text-foreground">{value}</p>
                </div>
              ))}
            </div>
          </section>
          <aside className="space-y-6">
            <section className="lm-card p-6">
              <p className="lm-label">Provider Configuration</p>
              <div className="mt-4 space-y-3">
                {[...(providerStatus?.providers ?? []), ...(providerStatus?.importers ?? [])].map((provider) => (
                  <div key={provider.id} className="rounded border border-border/50 bg-[#f8fafc] p-3">
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-sm font-semibold text-foreground">{provider.label}</p>
                      <span className="rounded-sm border border-border bg-surface px-2 py-1 text-[11px] font-semibold text-muted">
                        {provider.available ? "Available" : provider.configured ? "Configured" : "Missing"}
                      </span>
                    </div>
                    <p className="mt-2 text-xs leading-5 text-muted">{provider.message}</p>
                  </div>
                ))}
              </div>
            </section>
            <section className="lm-card p-6">
              <p className="lm-label">Security Boundary</p>
              <p className="mt-3 text-sm leading-6 text-muted">
                Secrets are read only by server-side code. Frontend settings display status only.
              </p>
            </section>
            <ImportIntegrationStatus providerStatus={providerStatus} compact />
          </aside>
        </div>
      </section>
    </main>
  );
}
