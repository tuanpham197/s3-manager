"use client";

import { TableCellsIcon, ArrowPathIcon } from "@heroicons/react/24/outline";
import { useState } from "react";

const SHEETS = ["Video Metadata - Master", "Draft Uploads", "Archive Logs"];

export default function GoogleSheetsForm() {
  const [syncEnabled, setSyncEnabled] = useState(true);

  return (
    <section className="lg:col-span-5 bg-white rounded-2xl border border-[#E2E8F0] p-8 hover:border-[#BFDBFE] transition-colors duration-200">
      <div className="flex items-center gap-4 mb-8">
        <div className="w-12 h-12 bg-[#F1F5F9] rounded-full flex items-center justify-center text-[#16A34A] flex-shrink-0">
          <TableCellsIcon className="w-6 h-6" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-[#1E293B]">Google Sheets Integration</h3>
          <p className="text-[10px] text-[#64748B] font-bold uppercase tracking-wider mt-0.5">
            Metadata Syncing
          </p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Spreadsheet ID */}
        <div className="space-y-2">
          <label
            htmlFor="spreadsheet-id"
            className="text-[10px] font-bold text-[#64748B] uppercase tracking-widest block"
          >
            Spreadsheet ID
          </label>
          <input
            id="spreadsheet-id"
            type="text"
            defaultValue="1x9A_v_F3i7-Ym0-2B_Z"
            placeholder="Enter ID from URL"
            className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl py-3 px-4 text-sm text-[#1E293B] placeholder:text-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#2563EB]/30 focus:border-[#2563EB] transition-all duration-150"
          />
        </div>

        {/* Select Sheet */}
        <div className="space-y-2">
          <label
            htmlFor="sheet-select"
            className="text-[10px] font-bold text-[#64748B] uppercase tracking-widest block"
          >
            Select Sheet
          </label>
          <select
            id="sheet-select"
            className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl py-3 px-4 text-sm text-[#1E293B] focus:outline-none focus:ring-2 focus:ring-[#2563EB]/30 focus:border-[#2563EB] transition-all duration-150 cursor-pointer"
          >
            {SHEETS.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
        </div>

        {/* Real-time Sync Toggle */}
        <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl p-4 flex items-center justify-between cursor-pointer hover:border-[#BFDBFE] transition-colors duration-150">
          <div className="flex items-center gap-3">
            <ArrowPathIcon className="w-5 h-5 text-[#2563EB] flex-shrink-0" />
            <div>
              <p className="text-sm font-bold text-[#1E293B]">Real-time Sync</p>
              <p className="text-[11px] text-[#64748B]">Update sheet immediately on upload</p>
            </div>
          </div>

          <button
            role="switch"
            aria-checked={syncEnabled}
            aria-label="Toggle real-time sync"
            onClick={() => setSyncEnabled((v) => !v)}
            className={`w-11 h-6 rounded-full relative flex items-center px-0.5 transition-colors duration-200 cursor-pointer focus-visible:ring-2 focus-visible:ring-[#2563EB] focus-visible:ring-offset-2 outline-none flex-shrink-0 ${
              syncEnabled ? "bg-[#2563EB]" : "bg-[#CBD5E1]"
            }`}
          >
            <div
              className={`w-5 h-5 bg-white rounded-full shadow-sm transition-transform duration-200 ${
                syncEnabled ? "translate-x-5" : "translate-x-0"
              }`}
            />
          </button>
        </div>
      </div>
    </section>
  );
}
