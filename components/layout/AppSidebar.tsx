"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Archive, FilePlus2, FolderOpen, Import, Moon, Search, Settings, UserCircle } from "lucide-react";

function sidebarItemClass(active: boolean) {
  return `flex items-center gap-3 rounded px-3 py-2 text-sm transition-colors ${
    active ? "bg-foreground text-primary-foreground" : "text-muted hover:bg-surface-muted hover:text-foreground"
  }`;
}

export function AppSidebar({ projectId = "ocpm-demo" }: { projectId?: string }) {
  const pathname = usePathname();

  return (
    <aside className="flex min-h-screen w-[280px] shrink-0 flex-col border-r border-border/50 bg-[#f8fafc]">
      <div className="border-b border-border/40 p-6">
        <h1 className="text-lg font-bold tracking-tight text-foreground">LitMatrix</h1>
        <p className="mt-1 text-xs text-muted">AI Research Workspace</p>
      </div>
      <div className="p-4">
        <Link href="/new" className={sidebarItemClass(pathname === "/new")}>
          <FilePlus2 className="h-4 w-4" aria-hidden="true" />
          New Analysis
        </Link>
      </div>
      <div className="px-4">
        <label className="flex items-center gap-2 rounded border border-border/50 bg-surface px-3 py-2 text-sm text-muted">
          <Search className="h-4 w-4" aria-hidden="true" />
          <input className="w-full bg-transparent outline-none placeholder:text-muted" placeholder="Search library" disabled />
        </label>
      </div>
      <div className="flex-1 overflow-auto p-4">
        <p className="lm-label mb-2">Recent Analysis</p>
        <div className="space-y-1">
          <Link href={`/projects/${projectId}/overview`} className={sidebarItemClass(pathname.includes("/overview"))}>
            <FolderOpen className="h-4 w-4" aria-hidden="true" />
            OCPM Overview
          </Link>
          <Link href={`/projects/${projectId}/matrix`} className={sidebarItemClass(pathname.includes("/matrix"))}>
            <FolderOpen className="h-4 w-4" aria-hidden="true" />
            Extraction Matrix
          </Link>
        </div>
        <p className="lm-label mb-2 mt-6">Projects</p>
        <div className="space-y-1">
          <Link href={`/projects/${projectId}`} className={sidebarItemClass(pathname === `/projects/${projectId}`)}>
            <FolderOpen className="h-4 w-4" aria-hidden="true" />
            OCPM Survey
          </Link>
          <span className={sidebarItemClass(false)}>
            <Archive className="h-4 w-4" aria-hidden="true" />
            Archived
          </span>
        </div>
      </div>
      <div className="border-t border-border/40 p-4">
        <div className="mb-3 rounded border border-border/50 bg-surface p-3">
          <div className="mb-2 flex items-center gap-2 text-sm text-muted">
            <Import className="h-4 w-4" aria-hidden="true" />
            Import/Export
          </div>
          <div className="flex items-center gap-2 text-sm text-muted">
            <Moon className="h-4 w-4" aria-hidden="true" />
            Theme
          </div>
        </div>
        <div className="flex items-center gap-3 rounded bg-surface p-3">
          <UserCircle className="h-8 w-8 text-muted" aria-hidden="true" />
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-foreground">Demo Researcher</p>
            <p className="truncate text-xs text-muted">demo mode</p>
          </div>
          <Settings className="ml-auto h-4 w-4 text-muted" aria-hidden="true" />
        </div>
      </div>
    </aside>
  );
}
