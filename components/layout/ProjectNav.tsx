import Link from "next/link";

const projectLinks = [
  ["Dashboard", ""],
  ["Papers", "/papers"],
  ["Overview", "/overview"],
  ["AI Analysis", "/analysis"],
  ["Review", "/review"],
  ["Matrix", "/matrix"],
  ["Tools", "/tools"],
  ["Themes", "/themes"],
  ["Gaps", "/gaps"],
  ["Arguments", "/arguments"],
  ["Innovation", "/innovation"],
  ["Writing", "/writing-plan"],
  ["Presentation", "/presentation-plan"],
  ["Export", "/export"],
] as const;

export function ProjectNav({ projectId }: { projectId: string }) {
  return (
    <aside className="rounded border border-border bg-surface p-4">
      <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted">Project Workspace</p>
      <div className="grid gap-1">
        {projectLinks.map(([label, href]) => (
          <Link
            key={label}
            href={`/projects/${projectId}${href}`}
            className="rounded-sm px-3 py-2 text-sm text-muted hover:bg-surface-muted hover:text-foreground"
          >
            {label}
          </Link>
        ))}
      </div>
    </aside>
  );
}
