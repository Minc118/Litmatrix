"use client";

import Link from "next/link";
import { ArrowRight, FolderKanban, Rows3 } from "lucide-react";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { WorkspaceTopBar } from "@/components/layout/WorkspaceTopBar";
import { LoadingPanel } from "@/components/common/LoadingPanel";
import { useLitmatrixResource } from "@/lib/api/useLitmatrixResource";
import type { Project } from "@/lib/types/litmatrix";

export function ProjectsIndexView() {
  const { data: projects, loading } = useLitmatrixResource<Project[]>("/api/projects");

  return (
    <main className="flex min-h-screen bg-background text-foreground">
      <AppSidebar />
      <section className="min-w-0 flex-1">
        <WorkspaceTopBar title="Projects" context="Analysis Store" actionLabel="New" />
        <div className="space-y-6 p-6">
          <header>
            <p className="lm-label">Research workspaces</p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-foreground">Project Library</h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-muted">
              Projects are loaded through the LitMatrix API and backed by normalized Analysis Store data.
            </p>
          </header>

          {loading ? (
            <LoadingPanel />
          ) : (
            <div className="grid gap-4 lg:grid-cols-2">
              {(projects ?? []).map((project) => (
                <Link
                  key={project.id}
                  href={`/projects/${project.id}`}
                  className="lm-card group block p-6 transition-colors hover:bg-[#f8fafc]"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded border border-border/50 bg-surface-muted text-foreground">
                      <FolderKanban className="h-5 w-5" aria-hidden="true" />
                    </div>
                    <span className="rounded-sm border border-border/50 bg-surface px-2 py-1 text-xs font-semibold text-muted">
                      {project.demo ? "Demo" : project.status ?? "Project"}
                    </span>
                  </div>
                  <h2 className="mt-5 text-xl font-semibold tracking-tight text-foreground">{project.title}</h2>
                  <p className="mt-2 text-sm leading-6 text-muted">{project.description}</p>
                  <div className="mt-6 flex items-center justify-between border-t border-border/40 pt-4 text-sm">
                    <span className="inline-flex items-center gap-2 text-muted">
                      <Rows3 className="h-4 w-4" aria-hidden="true" />
                      Matrix-ready workspace
                    </span>
                    <span className="inline-flex items-center gap-2 font-medium text-foreground">
                      Open
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
