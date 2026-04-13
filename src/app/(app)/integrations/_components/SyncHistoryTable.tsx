"use client";

import { ClockIcon, TrashIcon } from "@heroicons/react/24/outline";
import { useState } from "react";

type LogStatus = "success" | "active" | "critical";

interface SyncLogEntry {
  id: string;
  event: string;
  source: "Google Sheets" | "AWS S3" | "API Auth";
  status: LogStatus;
  timestamp: string;
}

const INITIAL_LOGS: SyncLogEntry[] = [
  {
    id: "1",
    event: 'Updated row 45 in "Video Metadata - Master"',
    source: "Google Sheets",
    status: "success",
    timestamp: "2023-10-27 14:22:10",
  },
  {
    id: "2",
    event: "Connection established",
    source: "AWS S3",
    status: "active",
    timestamp: "2023-10-27 14:20:05",
  },
  {
    id: "3",
    event: "Batch export: 12 objects indexed",
    source: "Google Sheets",
    status: "success",
    timestamp: "2023-10-27 12:45:30",
  },
  {
    id: "4",
    event: "Re-authentication failed: Invalid token",
    source: "API Auth",
    status: "critical",
    timestamp: "2023-10-27 09:12:00",
  },
];

const SOURCE_STYLES: Record<string, string> = {
  "Google Sheets": "bg-[#DBEAFE] text-[#1E40AF]",
  "AWS S3": "bg-[#EDE9FE] text-[#5B21B6]",
  "API Auth": "bg-[#FEE2E2] text-[#991B1B]",
};

const STATUS_CONFIG: Record<LogStatus, { dot: string; label: string; text: string }> = {
  success: { dot: "bg-[#16A34A]", label: "Success", text: "text-[#16A34A]" },
  active: { dot: "bg-[#16A34A]", label: "Active", text: "text-[#16A34A]" },
  critical: { dot: "bg-[#DC2626]", label: "Critical", text: "text-[#DC2626]" },
};

export default function SyncHistoryTable() {
  const [logs, setLogs] = useState<SyncLogEntry[]>(INITIAL_LOGS);

  return (
    <section className="lg:col-span-12 bg-white rounded-2xl border border-[#E2E8F0] overflow-hidden">
      {/* Header */}
      <div className="px-8 py-5 flex items-center justify-between border-b border-[#F1F5F9]">
        <div className="flex items-center gap-3">
          <ClockIcon className="w-5 h-5 text-[#64748B]" />
          <h3 className="font-bold text-[#1E293B] text-lg">Sync History</h3>
        </div>
        <button
          onClick={() => setLogs([])}
          className="flex items-center gap-1.5 text-xs font-bold text-[#DC2626] hover:text-[#B91C1C] uppercase tracking-widest cursor-pointer transition-colors duration-150"
          aria-label="Clear all sync logs"
        >
          <TrashIcon className="w-3.5 h-3.5" />
          Clear Logs
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[600px]">
          <thead>
            <tr className="bg-[#F8FAFC] border-b border-[#F1F5F9]">
              {["Event", "Source", "Status", "Timestamp"].map((col, i) => (
                <th
                  key={col}
                  className={`px-8 py-3 text-[10px] font-bold text-[#64748B] uppercase tracking-widest ${
                    i === 3 ? "text-right" : ""
                  }`}
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#F1F5F9]">
            {logs.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-8 py-10 text-center text-sm text-[#94A3B8]">
                  No sync logs available.
                </td>
              </tr>
            ) : (
              logs.map((log) => {
                const status = STATUS_CONFIG[log.status];
                return (
                  <tr
                    key={log.id}
                    className="hover:bg-[#F8FAFC] transition-colors duration-150"
                  >
                    <td className="px-8 py-4">
                      <p className="text-sm font-medium text-[#1E293B]">{log.event}</p>
                    </td>
                    <td className="px-8 py-4">
                      <span
                        className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-tighter ${
                          SOURCE_STYLES[log.source] ?? "bg-[#F1F5F9] text-[#475569]"
                        }`}
                      >
                        {log.source}
                      </span>
                    </td>
                    <td className="px-8 py-4">
                      <div className="flex items-center gap-2">
                        <span
                          className={`w-2 h-2 rounded-full ${status.dot}`}
                          aria-hidden="true"
                        />
                        <span className={`text-xs font-semibold ${status.text}`}>
                          {status.label}
                        </span>
                      </div>
                    </td>
                    <td className="px-8 py-4 text-right">
                      <span className="text-xs font-mono text-[#64748B]">{log.timestamp}</span>
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
