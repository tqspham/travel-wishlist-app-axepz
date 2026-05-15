"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

export default function SignupForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
    passwordConfirm?: string;
    general?: string;
  }>({});

  const getValidFromPath = (): string | null => {
    const from = searchParams.get("from");
    if (!from) return null;
    const publicPaths = ["/auth/login", "/auth/signup"];
    if (publicPaths.some((p) => from.startsWith(p))) {
      return null;
    }
    return from;
  };

  const validateInputs = (): boolean => {
    const newErrors: typeof errors = {};

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      newErrors.email = "Invalid email format";
    }

    if (password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }

    if (password !== passwordConfirm) {
      newErrors.passwordConfirm = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateInputs()) {
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setErrors({ general: data.error || "Sign up failed" });
        return;
      }

      const validFrom = getValidFromPath();
      router.push(validFrom || "/");
    } catch (err) {
      setErrors({
        general: err instanceof Error ? err.message : "An error occurred",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--color-background)] flex items-center justify-center p-4">
      <div className="bg-[var(--color-surface)] rounded-lg shadow-lg p-8 w-full max-w-md border border-[var(--color-border)]">
        <h1 className="text-4xl font-bold text-[var(--color-primary)] mb-3" style={{ fontFamily: "'Georgia', 'Garamond', serif", letterSpacing: '0.02em' }}>Travel Wishlist</h1>
        <p className="text-[var(--color-muted-text)] mb-8 text-sm">Create your account</p>

        {errors.general && (
          <div className="mb-6 p-4 bg-[var(--color-danger)] bg-opacity-10 border border-[var(--color-danger)] rounded-lg text-[var(--color-danger)] text-sm">
            {errors.general}
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
            {errors.email && (
              <p className="mt-2 text-sm text-[var(--color-danger)]">{errors.email}</p>
            )}
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
            {errors.password && (
              <p className="mt-2 text-sm text-[var(--color-danger)]">{errors.password}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--color-text)] mb-2">
              Confirm Password
            </label>
            <input
              type="password"
              value={passwordConfirm}
              onChange={(e) => setPasswordConfirm(e.target.value)}
              placeholder="••••••••"
              disabled={isLoading}
              required
              className="w-full px-4 py-3 border border-[var(--color-border)] rounded-lg focus:outline-none focus:border-[var(--color-secondary)] disabled:bg-[var(--color-background)] disabled:cursor-not-allowed bg-[var(--color-surface)] text-[var(--color-text)]"
            />
            {errors.passwordConfirm && (
              <p className="mt-2 text-sm text-[var(--color-danger)]">{errors.passwordConfirm}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full px-4 py-3 bg-[var(--color-primary)] text-[var(--color-surface)] rounded-lg hover:bg-opacity-90 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-all text-center"
          >
            {isLoading ? "Creating account..." : "Sign Up"}
          </button>
        </form>

        <p className="mt-6 text-center text-[var(--color-muted-text)] text-sm">
          Already have an account?{" "}
          <Link href="/auth/login" className="text-[var(--color-secondary)] hover:text-[var(--color-accent)] font-medium underline">
            Log In
          </Link>
        </p>
      </div>
    </div>
  );
}
