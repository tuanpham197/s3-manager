"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/lib/api";
import type { SessionResponse } from "@/types/api";
import { ApiError } from "@/lib/api";

export default function SessionGuard({ children }: { children: React.ReactNode }) {
  const { isLoading, sessionToken, user, login, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;

    if (!sessionToken) {
      router.replace("/login");
      return;
    }

    if (!user) {
      api
        .get<SessionResponse>("/api/auth/session")
        .then((data) => login(data.user, sessionToken))
        .catch((err) => {
          if (err instanceof ApiError && err.status === 401) {
            logout();
            router.replace("/login");
          }
        });
    }
  }, [isLoading, sessionToken, user, login, logout, router]);

  if (isLoading || (!user && sessionToken)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-[#2563EB] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!sessionToken) return null;

  return <>{children}</>;
}
