import Link from "next/link";
import LoginForm from "./_components/LoginForm";
import { CloudIcon, KeyIcon } from "@heroicons/react/24/outline";

export const metadata = {
  title: "Sign In | S3 Video Manager",
  description: "Sign in to manage your S3 video assets",
};

export default function LoginPage() {
  return (
    <main className="min-h-screen flex items-center justify-center relative overflow-hidden px-4 py-16 bg-[#f8f9ff]">
      {/* Dot grid pattern */}
      <div
        className="absolute inset-0 z-0 opacity-40"
        style={{
          backgroundImage: "radial-gradient(#d3e4fe 0.75px, transparent 0.75px)",
          backgroundSize: "28px 28px",
        }}
        aria-hidden="true"
      />

      {/* Animated ambient blobs */}
      <div
        className="absolute top-[-12%] right-[-8%] w-[45%] h-[45%] bg-[#d3e4fe] rounded-full blur-[140px] opacity-50 z-0 pointer-events-none"
        style={{ animation: "float-blob 12s ease-in-out infinite" }}
        aria-hidden="true"
      />
      <div
        className="absolute bottom-[-12%] left-[-8%] w-[35%] h-[35%] bg-[#acbfff] rounded-full blur-[120px] opacity-30 z-0 pointer-events-none"
        style={{ animation: "float-blob 15s ease-in-out infinite reverse" }}
        aria-hidden="true"
      />

      <div
        className="relative z-10 w-full max-w-[440px]"
        style={{ animation: "fade-in-up 0.6s ease-out both" }}
      >
        {/* Brand */}
        <div className="flex flex-col items-center mb-10">
          <div
            className="w-14 h-14 rounded-xl flex items-center justify-center mb-4"
            style={{
              background: "linear-gradient(135deg, #004ac6, #2563eb)",
              boxShadow: "0 8px 32px rgba(0, 74, 198, 0.25)",
            }}
          >
            <CloudIcon className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-extrabold tracking-tighter text-[#0b1c30] font-[Manrope]">
            S3 Video Manager
          </h1>
          <p className="text-[#434655] text-xs uppercase tracking-widest mt-2 font-medium">
            Stratus Core Architecture
          </p>
        </div>

        {/* Card — tonal layering: white card on surface background, no border */}
        <div
          className="bg-white/95 backdrop-blur-sm p-8 md:p-10 rounded-2xl"
          style={{
            boxShadow: "0 0 40px rgba(11, 28, 48, 0.04)",
          }}
        >
          <header className="mb-8">
            <h2 className="text-xl font-bold text-[#0b1c30] mb-1 font-[Manrope]">
              Welcome back
            </h2>
            <p className="text-[#434655] text-sm">
              Enter your credentials to manage your assets.
            </p>
          </header>

          <LoginForm />

          {/* Divider */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full h-px bg-[#eff4ff]" />
            </div>
            <div className="relative flex justify-center text-xs uppercase tracking-widest">
              <span className="bg-white px-4 text-[#434655] font-medium">
                Alternative Sign In
              </span>
            </div>
          </div>

          {/* Social — no borders, use surface-low bg for tonal separation */}
          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              className="flex items-center justify-center gap-2 py-3 px-4 bg-[#eff4ff] rounded-xl hover:bg-[#d3e4fe] transition-colors duration-200 text-sm font-semibold text-[#0b1c30] cursor-pointer"
            >
              {/* Google G SVG from Simple Icons */}
              <svg className="w-5 h-5" viewBox="0 0 24 24" aria-hidden="true">
                <path
                  d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                  fill="#4285F4"
                />
              </svg>
              Google
            </button>
            <button
              type="button"
              className="flex items-center justify-center gap-2 py-3 px-4 bg-[#eff4ff] rounded-xl hover:bg-[#d3e4fe] transition-colors duration-200 text-sm font-semibold text-[#0b1c30] cursor-pointer"
            >
              <KeyIcon className="w-5 h-5 text-[#434655]" />
              SSO
            </button>
          </div>
        </div>

        {/* Footer */}
        <footer
          className="mt-10 flex flex-col items-center gap-4"
          style={{ animation: "fade-in-up 0.6s ease-out 0.15s both" }}
        >
          <p className="text-sm text-[#434655]">
            Don&apos;t have an account?{" "}
            <Link
              href="/request-access"
              className="text-[#004ac6] font-bold hover:underline cursor-pointer"
            >
              Request access
            </Link>
          </p>
          <div className="flex items-center gap-6">
            <Link
              href="/privacy"
              className="text-[0.65rem] uppercase tracking-widest text-[#434655] hover:text-[#004ac6] transition-colors duration-150 cursor-pointer"
            >
              Privacy Policy
            </Link>
            <div className="w-1 h-1 rounded-full bg-[#c3c6d7]" aria-hidden="true" />
            <Link
              href="/status"
              className="text-[0.65rem] uppercase tracking-widest text-[#434655] hover:text-[#004ac6] transition-colors duration-150 cursor-pointer"
            >
              Architecture Status
            </Link>
          </div>
        </footer>
      </div>
    </main>
  );
}
