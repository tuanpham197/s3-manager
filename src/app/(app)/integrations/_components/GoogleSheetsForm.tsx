"use client";

import { TableCellsIcon, ArrowPathIcon } from "@heroicons/react/24/outline";
import { useEffect, useRef, useState } from "react";
import { api, ApiError } from "@/lib/api";
import type { SheetsConfig, SheetsConfigRequest } from "@/types/api";

interface Props {
  onDirtyChange: (dirty: boolean) => void;
  saveRef: React.MutableRefObject<(() => Promise<void>) | null>;
  discardRef: React.MutableRefObject<(() => void) | null>;
}

interface FormState {
  spreadsheet_id: string;
  sheet_name: string;
  realtime_sync: boolean;
}

const EMPTY: FormState = { spreadsheet_id: "", sheet_name: "", realtime_sync: true };

export default function GoogleSheetsForm({ onDirtyChange, saveRef, discardRef }: Props) {
  const [form, setForm] = useState<FormState>(EMPTY);
  const [loaded, setLoaded] = useState<FormState>(EMPTY);
  const [connectedEmail, setConnectedEmail] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const isDirty = useRef(false);

  useEffect(() => {
    api
      .get<SheetsConfig>("/api/integrations/sheets")
      .then((data) => {
        const state: FormState = {
          spreadsheet_id: data.spreadsheet_id ?? "",
          sheet_name: data.sheet_name ?? "",
          realtime_sync: true,
        };
        setForm(state);
        setLoaded(state);
        if (data.service_account_email) setConnectedEmail(data.service_account_email);
      })
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, []);

  const checkDirty = (next: FormState, base: FormState) => {
    const dirty =
      next.spreadsheet_id !== base.spreadsheet_id ||
      next.sheet_name !== base.sheet_name ||
      next.realtime_sync !== base.realtime_sync;
    if (dirty !== isDirty.current) {
      isDirty.current = dirty;
      onDirtyChange(dirty);
    }
  };

  const patch = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((prev) => {
      const next = { ...prev, [key]: value };
      checkDirty(next, loaded);
      return next;
    });
    setError(null);
  };

  const handleSave = async () => {
    setError(null);
    try {
      const body: SheetsConfigRequest = {
        spreadsheet_id: form.spreadsheet_id,
        sheet_name: form.sheet_name,
        service_account_key: {},
      };
      const res = await api.put<{ ok: boolean; service_account_email?: string }>(
        "/api/integrations/sheets",
        body,
      );
      if (res.service_account_email) setConnectedEmail(res.service_account_email);
      setLoaded(form);
      isDirty.current = false;
      onDirtyChange(false);
    } catch (err) {
      setError(
        err instanceof ApiError ? err.message : "Failed to save Sheets configuration.",
      );
      throw err;
    }
  };

  const handleDiscard = () => {
    setForm(loaded);
    setError(null);
    isDirty.current = false;
    onDirtyChange(false);
  };

  useEffect(() => {
    saveRef.current = handleSave;
    discardRef.current = handleDiscard;
  });

  return (
    <section className="lg:col-span-5 bg-white rounded-2xl border border-[#E2E8F0] p-8 hover:border-[#BFDBFE] transition-colors duration-200">
      <div className="flex items-center gap-4 mb-8">
        <div className="w-12 h-12 bg-[#F1F5F9] rounded-full flex items-center justify-center text-[#16A34A] flex-shrink-0">
          <TableCellsIcon className="w-6 h-6" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-[#1E293B]">Google Sheets Integration</h3>
          <p className="text-[10px] text-[#64748B] font-bold uppercase tracking-wider mt-0.5">
            {connectedEmail ?? "Metadata Syncing"}
          </p>
        </div>
      </div>

      {error && (
        <div role="alert" className="mb-6 bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl">
          {error}
        </div>
      )}

      <fieldset disabled={isLoading} className="space-y-6">
        {/* Spreadsheet ID */}
        <div className="space-y-2">
          <label htmlFor="spreadsheet-id" className="text-[10px] font-bold text-[#64748B] uppercase tracking-widest block">
            Spreadsheet ID
          </label>
          <input
            id="spreadsheet-id"
            type="text"
            value={form.spreadsheet_id}
            onChange={(e) => patch("spreadsheet_id", e.target.value)}
            placeholder="Enter ID from URL"
            className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl py-3 px-4 text-sm text-[#1E293B] placeholder:text-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#2563EB]/30 focus:border-[#2563EB] transition-all duration-150"
          />
        </div>

        {/* Sheet Name */}
        <div className="space-y-2">
          <label htmlFor="sheet-name" className="text-[10px] font-bold text-[#64748B] uppercase tracking-widest block">
            Sheet Name
          </label>
          <input
            id="sheet-name"
            type="text"
            value={form.sheet_name}
            onChange={(e) => patch("sheet_name", e.target.value)}
            placeholder="e.g. Videos"
            className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl py-3 px-4 text-sm text-[#1E293B] placeholder:text-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#2563EB]/30 focus:border-[#2563EB] transition-all duration-150"
          />
        </div>

        {/* Real-time Sync Toggle */}
        <div
          className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl p-4 flex items-center justify-between hover:border-[#BFDBFE] transition-colors duration-150"
        >
          <div className="flex items-center gap-3">
            <ArrowPathIcon className="w-5 h-5 text-[#2563EB] flex-shrink-0" />
            <div>
              <p className="text-sm font-bold text-[#1E293B]">Real-time Sync</p>
              <p className="text-[11px] text-[#64748B]">Update sheet immediately on upload</p>
            </div>
          </div>

          <button
            type="button"
            role="switch"
            aria-checked={form.realtime_sync}
            aria-label="Toggle real-time sync"
            onClick={() => patch("realtime_sync", !form.realtime_sync)}
            className={`w-11 h-6 rounded-full relative flex items-center px-0.5 transition-colors duration-200 cursor-pointer focus-visible:ring-2 focus-visible:ring-[#2563EB] focus-visible:ring-offset-2 outline-none flex-shrink-0 ${
              form.realtime_sync ? "bg-[#2563EB]" : "bg-[#CBD5E1]"
            }`}
          >
            <div
              className={`w-5 h-5 bg-white rounded-full shadow-sm transition-transform duration-200 ${
                form.realtime_sync ? "translate-x-5" : "translate-x-0"
              }`}
            />
          </button>
        </div>
      </fieldset>
    </section>
  );
}
