"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  BookOpen,
  Brain,
  Download,
  FileText,
  FolderKanban,
  Lightbulb,
  Network,
  Rows3,
  Settings2,
  Upload,
} from "lucide-react";

const navItems = [
  { label: "Dashboard", href: "", icon: FolderKanban },
  { label: "Papers", href: "/papers", icon: BookOpen },
  { label: "Overview", href: "/overview", icon: FileText },
  { label: "AI Analysis", href: "/analysis", icon: Brain },
  { label: "Review", href: "/review", icon: Lightbulb },
  { label: "Matrix", href: "/matrix", icon: Rows3 },
  { label: "Tools", href: "/tools", icon: Settings2 },
  { label: "Themes", href: "/themes", icon: Network },
  { label: "Gaps", href: "/gaps", icon: BarChart3 },
  { label: "Arguments", href: "/arguments", icon: Lightbulb },
  { label: "Innovation", href: "/innovation", icon: Brain },
  { label: "Writing Plan", href: "/writing-plan", icon: FileText },
  { label: "Presentation", href: "/presentation-plan", icon: BarChart3 },
  { label: "Export", href: "/export", icon: Download },
] as const;

export function ProjectSidebar({ projectId }: { projectId: string }) {
  const pathname = usePathname();
  const projectLabel = projectId === "ocpm-demo" ? "OCPM Survey" : projectId;

  return (
    <aside className="flex min-h-screen w-[280px] shrink-0 flex-col border-r border-border/50 bg-[#f8fafc]">
      <div className="border-b border-border/40 p-6">
        <p className="text-xs font-semibold uppercase tracking-widest text-muted">LitMatrix</p>
        <h1 className="mt-1 text-lg font-bold tracking-tight text-foreground">{projectLabel}</h1>
      </div>
      <div className="p-4">
        <Link
          href="/new"
          className="flex items-center justify-center gap-2 rounded-sm bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
        >
          <Upload className="h-4 w-4" aria-hidden="true" />
          Upload Paper
        </Link>
      </div>
      <nav className="flex-1 space-y-1 p-4">
        {navItems.map((item) => {
          const Icon = item.icon;
          const href = `/projects/${projectId}${item.href}`;
          const active = pathname === href;
          return (
            <Link
              key={item.label}
              href={href}
              className={`flex items-center gap-3 rounded px-3 py-2 text-sm transition-colors ${
                active ? "bg-foreground text-primary-foreground" : "text-muted hover:bg-surface-muted hover:text-foreground"
              }`}
            >
              <Icon className="h-4 w-4" aria-hidden="true" />
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="border-t border-border/40 p-4 text-xs leading-5 text-muted">
        Demo workspace. Provider actions are disabled.
      </div>
    </aside>
  );
}
