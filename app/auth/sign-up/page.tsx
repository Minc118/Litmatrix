"use client";

import { useState, startTransition, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { authClient } from "@/lib/auth/client";
import { Loader2, AlertCircle } from "lucide-react";

function SignUpForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/projects";

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) {
      setError("Please fill in all fields.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { error: authError } = await authClient.signUp.email({
        email,
        password,
        name,
      });

      if (authError) {
        setError(authError.message || "Onboarding failed. Please try again.");
        setLoading(false);
      } else {
        startTransition(() => {
          router.push(callbackUrl);
          router.refresh();
        });
      }
    } catch {
      setError("An unexpected error occurred during sign-up.");
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md rounded-lg border border-[#30363d] bg-[#161b22] p-8 shadow-2xl">
      <header className="text-center">
        <h1 className="text-3xl font-extrabold tracking-tight text-[#f0f6fc]">LitMatrix</h1>
        <p className="mt-2 text-sm text-[#8b949e]">AI-assisted literature review workspace</p>
        <h2 className="mt-6 text-xl font-bold text-[#f0f6fc]">Create your account</h2>
      </header>

      {error && (
        <div className="mt-6 flex items-start gap-2.5 rounded-md border border-[#f85149]/40 bg-[#f85149]/10 p-3 text-sm text-[#f85149]">
          <AlertCircle className="h-5 w-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <div>
          <label htmlFor="name" className="block text-xs font-semibold text-[#8b949e] uppercase tracking-wide">
            Full Name
          </label>
          <input
            id="name"
            type="text"
            placeholder="Jane Doe"
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={loading}
            className="mt-1.5 w-full rounded-md border border-[#30363d] bg-[#0d1117] px-3 py-2.5 text-sm text-[#c9d1d9] outline-none placeholder:text-[#484f58] focus:border-[#58a6ff] transition-colors"
            required
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-xs font-semibold text-[#8b949e] uppercase tracking-wide">
            Email Address
          </label>
          <input
            id="email"
            type="email"
            placeholder="name@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
            className="mt-1.5 w-full rounded-md border border-[#30363d] bg-[#0d1117] px-3 py-2.5 text-sm text-[#c9d1d9] outline-none placeholder:text-[#484f58] focus:border-[#58a6ff] transition-colors"
            required
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-xs font-semibold text-[#8b949e] uppercase tracking-wide">
            Password
          </label>
          <input
            id="password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
            className="mt-1.5 w-full rounded-md border border-[#30363d] bg-[#0d1117] px-3 py-2.5 text-sm text-[#c9d1d9] outline-none placeholder:text-[#484f58] focus:border-[#58a6ff] transition-colors"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="flex w-full items-center justify-center gap-2 rounded-md bg-[#238636] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#2ea043] focus:outline-none disabled:opacity-50"
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Creating account...
            </>
          ) : (
            "Sign Up"
          )}
        </button>
      </form>

      <footer className="mt-8 border-t border-[#30363d] pt-6 text-center text-sm text-[#8b949e]">
        Already have an account?{" "}
        <Link href={`/auth/sign-in?callbackUrl=${encodeURIComponent(callbackUrl)}`} className="font-semibold text-[#58a6ff] hover:underline">
          Sign In
        </Link>
      </footer>
    </div>
  );
}

export default function SignUpPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#0d1117] px-4 text-white">
      <Suspense fallback={<div className="text-[#8b949e] text-sm flex items-center gap-2"><Loader2 className="h-4 w-4 animate-spin" /> Loading sign up...</div>}>
        <SignUpForm />
      </Suspense>
    </main>
  );
}
