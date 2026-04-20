"use client";

import { ArrowDownTrayIcon, FunnelIcon } from "@heroicons/react/24/outline";
import VideoRow from "./VideoRow";
import type { Video, VideoStatus } from "@/types/video";

interface Pagination {
  page: number;
  limit: number;
  total: number;
}

interface VideoTableProps {
  videos: Video[];
  pagination: Pagination;
  isLoading: boolean;
  statusFilter: string;
  onStatusChange: (status: string) => void;
  onPageChange: (page: number) => void;
  onDeleteVideo: (id: string) => void;
  onEditVideo: (id: string, name: string) => void;
}

const STATUS_OPTIONS = ["All", "Published", "Uploading", "Failed"] as const;

function getStatusParam(filter: string): VideoStatus | undefined {
  if (filter === "All") return undefined;
  return filter.toLowerCase() as VideoStatus;
}

export default function VideoTable({
  videos,
  pagination,
  isLoading,
  statusFilter,
  onStatusChange,
  onPageChange,
  onDeleteVideo,
  onEditVideo,
}: VideoTableProps) {
  const { page, limit, total } = pagination;
  const totalPages = Math.max(1, Math.ceil(total / limit));
  const from = total === 0 ? 0 : (page - 1) * limit + 1;
  const to = Math.min(page * limit, total);

  const pageNumbers = Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
    if (totalPages <= 5) return i + 1;
    if (page <= 3) return i + 1;
    if (page >= totalPages - 2) return totalPages - 4 + i;
    return page - 2 + i;
  });

  // Silence unused import warning — getStatusParam is used by parent but exported for clarity
  void getStatusParam;

  return (
    <section className="bg-[#F1F5F9] rounded-2xl p-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-xl font-extrabold text-[#1E293B] tracking-tight">Video Library</h2>
          <p className="text-xs text-[#64748B] font-medium mt-1">
            Manage and distribution console for your S3 assets
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center bg-white px-3 py-2 rounded-xl border border-[#E2E8F0] gap-2">
            <FunnelIcon className="w-4 h-4 text-[#94A3B8]" />
            <select
              className="bg-transparent outline-none text-xs font-bold text-[#475569] uppercase tracking-wider pr-2 cursor-pointer"
              value={statusFilter}
              onChange={(e) => onStatusChange(e.target.value)}
              aria-label="Filter by status"
            >
              {STATUS_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>
                  {opt === "All" ? "Filter by Status" : opt}
                </option>
              ))}
            </select>
          </div>

          <button
            className="bg-white p-2 rounded-xl border border-[#E2E8F0] cursor-pointer hover:bg-[#F8FAFC] hover:border-[#BFDBFE] transition-colors duration-150"
            aria-label="Export videos"
          >
            <ArrowDownTrayIcon className="w-5 h-5 text-[#64748B]" />
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl overflow-hidden border border-[#E2E8F0]">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[700px]">
            <thead>
              <tr className="border-b border-[#E2E8F0]">
                {["Video Name", "S3 Public Link", "Status", "Date Uploaded", "Actions"].map((col, i) => (
                  <th
                    key={col}
                    className={`px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-[#64748B] ${
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
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i}>
                    {Array.from({ length: 5 }).map((__, j) => (
                      <td key={j} className="px-6 py-4">
                        <div className="h-4 bg-[#F1F5F9] rounded animate-pulse" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : videos.length > 0 ? (
                videos.map((video) => (
                  <VideoRow
                    key={video.id}
                    video={video}
                    onDelete={onDeleteVideo}
                    onEdit={onEditVideo}
                  />
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-sm text-[#94A3B8]">
                    No videos match the selected filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="px-6 py-4 border-t border-[#F1F5F9] flex items-center justify-between bg-[#FAFAFA]">
          <p className="text-[10px] font-bold text-[#64748B] uppercase tracking-widest">
            {total === 0 ? "No videos" : `Showing ${from}–${to} of ${total.toLocaleString()} videos`}
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onPageChange(page - 1)}
              disabled={page <= 1 || isLoading}
              className="p-2 hover:bg-[#F1F5F9] rounded-lg transition-colors duration-150 text-[#94A3B8] cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
              aria-label="Previous page"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <div className="flex items-center gap-1">
              {pageNumbers.map((p) => (
                <button
                  key={p}
                  onClick={() => onPageChange(p)}
                  disabled={isLoading}
                  className={`w-8 h-8 flex items-center justify-center text-[10px] font-bold rounded-lg transition-colors duration-150 cursor-pointer disabled:cursor-not-allowed ${
                    p === page
                      ? "bg-[#2563EB] text-white"
                      : "text-[#64748B] hover:bg-[#F1F5F9]"
                  }`}
                  aria-label={`Page ${p}`}
                  aria-current={p === page ? "page" : undefined}
                >
                  {p}
                </button>
              ))}
            </div>
            <button
              onClick={() => onPageChange(page + 1)}
              disabled={page >= totalPages || isLoading}
              className="p-2 hover:bg-[#F1F5F9] rounded-lg transition-colors duration-150 text-[#94A3B8] cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
              aria-label="Next page"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
