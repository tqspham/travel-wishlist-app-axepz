"use client";

import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { useState } from "react";

export default function LogoutButton() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleLogout = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
      });

      if (response.ok) {
        router.push("/auth/login");
      }
    } catch (err) {
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleLogout}
      disabled={isLoading}
      className="flex items-center gap-2 px-4 py-3 bg-[var(--color-danger)] bg-opacity-10 text-[var(--color-danger)] rounded-lg hover:bg-opacity-20 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-colors"
    >
      <LogOut size={18} strokeWidth={1.5} />
      {isLoading ? "Logging out..." : "Log Out"}
    </button>
  );
}
