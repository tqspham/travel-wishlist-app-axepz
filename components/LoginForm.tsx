"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getValidFromPath = (): string | null => {
    const from = searchParams.get("from");
    if (!from) return null;
    const publicPaths = ["/auth/login", "/auth/signup"];
    if (publicPaths.some((p) => from.startsWith(p))) {
      return null;
    }
    return from;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Invalid email or password");
        return;
      }

      const validFrom = getValidFromPath();
      router.push(validFrom || "/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--color-background)] flex items-center justify-center p-4">
      <div className="bg-[var(--color-surface)] rounded-lg shadow-lg p-8 w-full max-w-md border border-[var(--color-border)]">
        <h1 className="text-4xl font-bold text-[var(--color-primary)] mb-3" style={{ fontFamily: "'Georgia', 'Garamond', serif", letterSpacing: '0.02em' }}>Travel Wishlist</h1>
        <p className="text-[var(--color-muted-text)] mb-8 text-sm">Sign in to your account</p>

        {error && (
          <div className="mb-6 p-4 bg-[var(--color-danger)] bg-opacity-10 border border-[var(--color-danger)] rounded-lg text-[var(--color-danger)] text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-[var(--color-text)] mb-2">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              disabled={isLoading}
              required
              className="w-full px-4 py-3 border border-[var(--color-border)] rounded-lg focus:outline-none focus:border-[var(--color-secondary)] disabled:bg-[var(--color-background)] disabled:cursor-not-allowed bg-[var(--color-surface)] text-[var(--color-text)]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--color-text)] mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              disabled={isLoading}
              required
              className="w-full px-4 py-3 border border-[var(--color-border)] rounded-lg focus:outline-none focus:border-[var(--color-secondary)] disabled:bg-[var(--color-background)] disabled:cursor-not-allowed bg-[var(--color-surface)] text-[var(--color-text)]"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full px-4 py-3 bg-[var(--color-primary)] text-[var(--color-surface)] rounded-lg hover:bg-opacity-90 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-all text-center"
          >
            {isLoading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <p className="mt-6 text-center text-[var(--color-muted-text)] text-sm">
          Don't have an account?{" "}
          <Link href="/auth/signup" className="text-[var(--color-secondary)] hover:text-[var(--color-accent)] font-medium underline">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}
