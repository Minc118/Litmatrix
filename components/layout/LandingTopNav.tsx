"use client";

import Link from "next/link";
import { Menu } from "lucide-react";
import { authClient } from "@/lib/auth/client";
import { useRouter } from "next/navigation";

export function LandingTopNav() {
  const { data: session } = authClient.useSession();
  const router = useRouter();

  const handleSignOut = async () => {
    await authClient.signOut();
    router.refresh();
  };

  return (
    <nav className="fixed top-0 z-50 w-full border-b border-border/40 bg-[#fdfdfd]/90 backdrop-blur-sm">
      <div className="mx-auto flex max-w-screen-2xl items-center justify-between px-6 py-5 md:px-12">
        <div className="flex items-center gap-8">
          <Link href="/" className="text-xl font-bold tracking-tight text-foreground">
            LitMatrix
          </Link>
          <div className="hidden items-center gap-6 md:flex">
            <a className="text-sm font-medium text-muted transition-colors hover:text-foreground" href="#features">
              Features
            </a>
            <a className="text-sm font-medium text-muted transition-colors hover:text-foreground" href="#methodology">
              Methodology
            </a>
            <Link className="text-sm font-medium text-muted transition-colors hover:text-foreground" href="/projects">
              Library
            </Link>
          </div>
        </div>
        <div className="hidden items-center gap-4 md:flex">
          {session ? (
            <>
              <Link href="/projects" className="text-sm font-medium text-muted transition-colors hover:text-foreground">
                Dashboard
              </Link>
              <button
                onClick={handleSignOut}
                className="text-sm font-medium text-muted transition-colors hover:text-foreground"
              >
                Sign Out
              </button>
            </>
          ) : (
            <Link href="/auth/sign-in" className="text-sm font-medium text-muted transition-colors hover:text-foreground">
              Sign In
            </Link>
          )}
          <Link
            href="/new"
            className="rounded-sm border border-[#1f2933] bg-[#1f2933] px-4 py-2 text-sm font-semibold !text-white transition-colors hover:bg-[#2b3642] [&_span]:!text-white [&_svg]:!text-white"
          >
            <span className="!text-white">Start New Analysis</span>
          </Link>
        </div>
        <button className="p-2 text-muted md:hidden" aria-label="Open navigation" disabled>
          <Menu className="h-5 w-5" aria-hidden="true" />
        </button>
      </div>
    </nav>
  );
}
