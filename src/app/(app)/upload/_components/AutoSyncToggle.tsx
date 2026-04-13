"use client";

import { ArrowPathIcon } from "@heroicons/react/24/outline";
import { useState } from "react";

export default function AutoSyncToggle() {
  const [enabled, setEnabled] = useState(true);

  return (
    <div className="mt-6 flex items-center justify-between p-4 bg-[#F1F5F9] rounded-xl border border-[#E2E8F0]">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-lg bg-[#EFF6FF] flex items-center justify-center text-[#2563EB] flex-shrink-0">
          <ArrowPathIcon className="w-5 h-5" />
        </div>
        <div>
          <p className="text-sm font-semibold text-[#1E293B]">Auto-sync to Google Sheets</p>
          <p className="text-xs text-[#64748B]">Update project manifest automatically</p>
        </div>
      </div>

      <button
        role="switch"
        aria-checked={enabled}
        aria-label="Toggle auto-sync to Google Sheets"
        onClick={() => setEnabled((v) => !v)}
        className={`w-12 h-6 rounded-full relative flex items-center px-1 transition-colors duration-200 cursor-pointer focus-visible:ring-2 focus-visible:ring-[#2563EB] focus-visible:ring-offset-2 outline-none ${
          enabled ? "bg-[#2563EB]" : "bg-[#CBD5E1]"
        }`}
      >
        <div
          className={`w-4 h-4 bg-white rounded-full shadow-sm transition-transform duration-200 ${
            enabled ? "translate-x-6" : "translate-x-0"
          }`}
        />
      </button>
    </div>
  );
}
