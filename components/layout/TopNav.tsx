import Link from "next/link";

export function TopNav() {
  return (
    <nav className="sticky top-0 z-40 border-b border-border bg-[#fdfdfd]/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link href="/" className="text-lg font-bold tracking-tight">
          LitMatrix
        </Link>
        <div className="flex items-center gap-4 text-sm text-muted">
          <Link href="/new" className="hover:text-foreground">
            New Analysis
          </Link>
          <Link href="/projects" className="hover:text-foreground">
            Projects
          </Link>
          <Link
            href="/projects/ocpm-demo"
            className="rounded-sm border border-[#1f2933] bg-[#1f2933] px-3 py-2 !text-white [&_span]:!text-white [&_svg]:!text-white"
          >
            <span className="!text-white">Demo Project</span>
          </Link>
        </div>
      </div>
    </nav>
  );
}
