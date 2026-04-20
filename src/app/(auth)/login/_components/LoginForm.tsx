"use client";

import { EyeIcon, EyeSlashIcon, ArrowRightIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { api, ApiError } from "@/lib/api";
import type { LoginResponse } from "@/types/api";

export default function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);

  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    const form = e.currentTarget;
    const email = (form.elements.namedItem("email") as HTMLInputElement).value.trim();
    const password = (form.elements.namedItem("password") as HTMLInputElement).value;

    if (!email || !password) {
      setError("Email and password are required.");
      return;
    }

    setIsPending(true);
    try {
      const data = await api.post<LoginResponse>("/api/auth/login", { email, password });
      login(data.user, data.sessionToken);
      router.replace("/dashboard");
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) {
        setError("Invalid email or password.");
      } else {
        setError("Something went wrong. Please try again.");
      }
    } finally {
      setIsPending(false);
    }
  };

  return (
    <form className="space-y-6" noValidate onSubmit={handleSubmit}>
      {error && (
        <div
          role="alert"
          className="bg-red-50 border border-red-200 text-red-700 text-sm font-medium px-4 py-3 rounded-xl"
        >
          {error}
        </div>
      )}

      {/* Email */}
      <div className="space-y-2">
        <label
          htmlFor="email"
          className="text-[0.75rem] font-semibold text-[#434655] uppercase tracking-wider block"
        >
          Email Address
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          placeholder="name@company.com"
          className="w-full bg-white rounded-xl px-4 py-3 text-sm text-[#0b1c30] placeholder:text-[#94A3B8] focus:outline-none focus:ring-4 focus:ring-[#004ac6]/10 focus:shadow-[0_0_0_1px_#004ac6] transition-all duration-200"
          style={{
            boxShadow: "inset 0 0 0 1px rgba(195, 198, 215, 0.15)",
          }}
        />
      </div>

      {/* Password */}
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <label
            htmlFor="password"
            className="text-[0.75rem] font-semibold text-[#434655] uppercase tracking-wider block"
          >
            Password
          </label>
          <Link
            href="/forgot-password"
            className="text-xs font-semibold text-[#004ac6] hover:underline transition-colors duration-150 cursor-pointer"
          >
            Forgot password?
          </Link>
        </div>
        <div className="relative">
          <input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            placeholder="••••••••"
            className="w-full bg-white rounded-xl px-4 py-3 pr-12 text-sm text-[#0b1c30] placeholder:text-[#94A3B8] focus:outline-none focus:ring-4 focus:ring-[#004ac6]/10 focus:shadow-[0_0_0_1px_#004ac6] transition-all duration-200"
            style={{
              boxShadow: "inset 0 0 0 1px rgba(195, 198, 215, 0.15)",
            }}
          />
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[#434655] hover:text-[#004ac6] transition-colors duration-150 cursor-pointer p-1 rounded-md focus:outline-none focus:ring-2 focus:ring-[#004ac6]/20"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? (
              <EyeSlashIcon className="w-5 h-5" />
            ) : (
              <EyeIcon className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>

      {/* Remember me */}
      <div className="flex items-center gap-2">
        <input
          id="remember"
          type="checkbox"
          className="w-4 h-4 rounded accent-[#004ac6] cursor-pointer"
        />
        <label
          htmlFor="remember"
          className="text-sm text-[#434655] select-none cursor-pointer"
        >
          Remember this device
        </label>
      </div>

      {/* CTA */}
      <button
        type="submit"
        disabled={isPending}
        className="w-full text-white font-bold py-4 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer hover:brightness-110 active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed"
        style={{
          background: "linear-gradient(135deg, #004ac6, #2563eb)",
          boxShadow: "0 8px 24px rgba(0, 74, 198, 0.2)",
        }}
      >
        {isPending ? (
          <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
        ) : (
          <>
            <span>Sign In to Dashboard</span>
            <ArrowRightIcon className="w-4 h-4" />
          </>
        )}
      </button>
    </form>
  );
}
