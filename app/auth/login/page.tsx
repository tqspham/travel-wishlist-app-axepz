import { Suspense } from "react";
import LoginForm from "@/components/LoginForm";

function LoginFallback() {
  return (
    <div className="min-h-screen bg-[var(--color-background)] flex items-center justify-center p-4">
      <div className="bg-[var(--color-surface)] rounded-lg shadow-lg p-8 w-full max-w-md border border-[var(--color-border)]">
        <h1 className="text-4xl font-bold text-[var(--color-primary)] mb-2" style={{ fontFamily: "'Georgia', 'Garamond', serif" }}>Travel Wishlist</h1>
        <p className="text-[var(--color-muted-text)] mb-8">Sign in to your account</p>
        <div className="flex justify-center items-center py-12">
          <div className="animate-pulse rounded-full h-12 w-12 bg-[var(--color-secondary)] opacity-50"></div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<LoginFallback />}>
      <LoginForm />
    </Suspense>
  );
}
