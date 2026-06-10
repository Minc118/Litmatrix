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
  FilePlus2,
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
        <Link href="/" className="text-xs font-semibold uppercase tracking-widest text-muted hover:text-foreground">
          LitMatrix
        </Link>
        <h1 className="mt-1 text-lg font-bold tracking-tight text-foreground">{projectLabel}</h1>
      </div>
      <div className="p-4">
        <Link
          href="/new"
          className="flex items-center justify-center gap-2 rounded-sm border border-[#1f2933] bg-[#1f2933] px-4 py-2 text-sm font-semibold !text-white shadow-sm transition-colors hover:bg-[#2b3642] [&_span]:!text-white [&_svg]:!text-white"
        >
          <FilePlus2 className="h-4 w-4 text-white stroke-white" aria-hidden="true" />
          <span className="!text-white">New Analysis</span>
        </Link>
        <p className="mt-2 text-xs leading-5 text-muted">PDF upload is visual-only; demo data uses seeded OCPM papers.</p>
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
                active
                  ? "border border-[#1f2933] bg-[#1f2933] font-semibold !text-white shadow-sm [&_span]:!text-white [&_svg]:!text-white"
                  : "border border-transparent text-muted hover:border-border/50 hover:bg-surface-muted hover:text-foreground"
              }`}
              aria-current={active ? "page" : undefined}
            >
              <Icon className={`h-4 w-4 ${active ? "text-white stroke-white" : ""}`} aria-hidden="true" />
              <span className={active ? "!text-white" : ""}>{item.label}</span>
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
