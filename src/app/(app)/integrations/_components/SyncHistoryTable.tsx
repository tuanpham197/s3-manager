"use client";

import { ClockIcon, TrashIcon, ArrowPathIcon } from "@heroicons/react/24/outline";
import { useCallback, useEffect, useState } from "react";
import { api, ApiError } from "@/lib/api";
import type { SyncEntry, SyncHistoryResponse, SyncTriggerResponse } from "@/types/api";

const STATUS_CONFIG: Record<
  SyncEntry["status"],
  { dot: string; label: string; text: string }
> = {
  success: { dot: "bg-[#16A34A]", label: "Success", text: "text-[#16A34A]" },
  running: { dot: "bg-[#2563EB] animate-pulse", label: "Running", text: "text-[#2563EB]" },
  failed:  { dot: "bg-[#DC2626]", label: "Failed",  text: "text-[#DC2626]" },
};

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleString();
  } catch {
    return iso;
  }
}

export default function SyncHistoryTable() {
  const [entries, setEntries] = useState<SyncEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncMsg, setSyncMsg] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchHistory = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await api.get<SyncHistoryResponse>("/api/sync/history?limit=20");
      setEntries(data.data);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to load sync history.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  const handleSyncNow = async () => {
    setIsSyncing(true);
    setSyncMsg(null);
    try {
      const res = await api.post<SyncTriggerResponse>("/api/sync");
      setSyncMsg(`Sync started (${res.sync_id}). Refresh history to see results.`);
      setTimeout(() => fetchHistory(), 3000);
    } catch (err) {
      setSyncMsg(err instanceof ApiError ? err.message : "Failed to trigger sync.");
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <section className="lg:col-span-12 bg-white rounded-2xl border border-[#E2E8F0] overflow-hidden">
      {/* Header */}
      <div className="px-8 py-5 flex items-center justify-between border-b border-[#F1F5F9]">
        <div className="flex items-center gap-3">
          <ClockIcon className="w-5 h-5 text-[#64748B]" />
          <h3 className="font-bold text-[#1E293B] text-lg">Sync History</h3>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={handleSyncNow}
            disabled={isSyncing}
            className="flex items-center gap-1.5 px-4 py-2 bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-bold rounded-xl transition-colors duration-150 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
          >
            <ArrowPathIcon className={`w-3.5 h-3.5 ${isSyncing ? "animate-spin" : ""}`} />
            {isSyncing ? "Starting…" : "Sync Now"}
          </button>
          <button
            onClick={fetchHistory}
            disabled={isLoading}
            className="flex items-center gap-1.5 text-xs font-bold text-[#64748B] hover:text-[#1E293B] uppercase tracking-widest cursor-pointer transition-colors duration-150 disabled:opacity-40"
            aria-label="Refresh sync history"
          >
            <ArrowPathIcon className={`w-3.5 h-3.5 ${isLoading ? "animate-spin" : ""}`} />
            Refresh
          </button>
          <button
            onClick={() => setEntries([])}
            className="flex items-center gap-1.5 text-xs font-bold text-[#DC2626] hover:text-[#B91C1C] uppercase tracking-widest cursor-pointer transition-colors duration-150"
            aria-label="Clear all sync logs"
          >
            <TrashIcon className="w-3.5 h-3.5" />
            Clear
          </button>
        </div>
      </div>

      {syncMsg && (
        <div className="px-8 py-3 bg-[#EFF6FF] border-b border-[#BFDBFE] text-[#2563EB] text-sm font-medium">
          {syncMsg}
        </div>
      )}

      {error && (
        <div className="px-8 py-3 bg-red-50 border-b border-red-200 text-red-700 text-sm">
          {error}
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[600px]">
          <thead>
            <tr className="bg-[#F8FAFC] border-b border-[#F1F5F9]">
              {["Sync ID", "Started", "Completed", "Status", "Added / Failed"].map((col, i) => (
                <th
                  key={col}
                  className={`px-8 py-3 text-[10px] font-bold text-[#64748B] uppercase tracking-widest ${
                    i === 4 ? "text-right" : ""
                  }`}
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#F1F5F9]">
            {isLoading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <tr key={i}>
                  {Array.from({ length: 5 }).map((__, j) => (
                    <td key={j} className="px-8 py-4">
                      <div className="h-3 bg-[#F1F5F9] rounded animate-pulse" />
                    </td>
                  ))}
                </tr>
              ))
            ) : entries.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-8 py-10 text-center text-sm text-[#94A3B8]">
                  No sync history yet.
                </td>
              </tr>
            ) : (
              entries.map((entry) => {
                const s = STATUS_CONFIG[entry.status] ?? STATUS_CONFIG.failed;
                return (
                  <tr key={entry.id} className="hover:bg-[#F8FAFC] transition-colors duration-150">
                    <td className="px-8 py-4">
                      <code className="text-xs text-[#475569] font-mono">{entry.id}</code>
                    </td>
                    <td className="px-8 py-4">
                      <span className="text-xs font-mono text-[#64748B]">
                        {formatDate(entry.started_at)}
                      </span>
                    </td>
                    <td className="px-8 py-4">
                      <span className="text-xs font-mono text-[#64748B]">
                        {entry.completed_at ? formatDate(entry.completed_at) : "—"}
                      </span>
                    </td>
                    <td className="px-8 py-4">
                      <div className="flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${s.dot}`} aria-hidden="true" />
                        <span className={`text-xs font-semibold ${s.text}`}>{s.label}</span>
                      </div>
                    </td>
                    <td className="px-8 py-4 text-right">
                      <span className="text-xs font-mono text-[#64748B]">
                        +{entry.videos_added} / {entry.videos_failed}
                      </span>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
