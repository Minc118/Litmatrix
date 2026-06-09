import { TopNav } from "@/components/layout/TopNav";

export function WorkspaceShell({
  title,
  eyebrow,
  description,
  children,
}: {
  title: string;
  eyebrow?: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <main className="min-h-screen bg-background">
      <TopNav />
      <div className="mx-auto max-w-7xl px-6 py-10">
        <header className="mb-8 border-b border-border pb-6">
          {eyebrow ? <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted">{eyebrow}</p> : null}
          <h1 className="text-3xl font-semibold tracking-tight text-foreground">{title}</h1>
          {description ? <p className="mt-3 max-w-3xl text-base leading-7 text-muted">{description}</p> : null}
        </header>
        {children}
      </div>
    </main>
  );
}
