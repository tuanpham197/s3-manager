"use client";

import { EyeIcon, EyeSlashIcon, ArrowRightIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { useState } from "react";

export default function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <form className="space-y-6" noValidate>
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

      {/* CTA — gradient fill per DESIGN.md */}
      <button
        type="submit"
        className="w-full text-white font-bold py-4 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer hover:brightness-110 active:scale-[0.99]"
        style={{
          background: "linear-gradient(135deg, #004ac6, #2563eb)",
          boxShadow: "0 8px 24px rgba(0, 74, 198, 0.2)",
        }}
      >
        <span>Sign In to Dashboard</span>
        <ArrowRightIcon className="w-4 h-4" />
      </button>
    </form>
  );
}
