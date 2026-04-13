"use client";

import { ArrowDownTrayIcon, FunnelIcon } from "@heroicons/react/24/outline";
import VideoRow from "./VideoRow";
import type { Video } from "@/types/video";
import { useState } from "react";

const MOCK_VIDEOS: Video[] = [
  {
    id: "1",
    name: "Brand_Promo_V1_Final.mp4",
    size: "142.5 MB",
    duration: "00:45",
    s3Link: "s3://prod-cdn/vid/829...03.mp4",
    status: "published",
    date: "Oct 24, 2023",
    time: "10:45 AM",
    thumbnail:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuD0zrK2gC7579EvJIWPlPMQBz88IiWK2yilpAmiYU9kx8I9TpZLo7e9FU1i8_ZTezPZrq-cdSYteqojxSuDsZ2uJLpcxHfbKXTB_pUardL9d4Q0aJunOkDgViPVq1Xn2iBjeFSgrS5kJJ3n0Jciw9abEVejtlLb4OrHzjOj00YZpDfg170H9bqvhAqS7CAjAM5o9lc5pWNpgUkFhuML3HqJmgJLMSeHqKbn9rKZBg1mFkk2JO_GQj3HgG9tGQMSar3Iqg7eSSKgX4c",
  },
  {
    id: "2",
    name: "Product_Explainer_RAW.mov",
    size: "2.4 GB",
    duration: "12:30",
    s3Link: "s3://prod-cdn/tmp/u91...92.mov",
    status: "uploading",
    uploadProgress: 84,
    date: "Today",
    time: "02:15 PM",
    thumbnail:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCk-EdsonzqnQjDz8cbnkaV7UfcfHtErmbBLVpePlyTjGIse8zXWm9VaQc7B_OxbKqeKn6jb9tig707B7rbLtZjP0FlRwh7xUl3pE_5FCv2hHdugnsO4CSqN_UNbaVHa32T11B1O2O4t1pUurqfkO2BuU5b86ADGnb_sJNwbo_Py4TWkmABJZg7nP2BZtvL-td0jqAzVFxgxP19RCgszONJDCpDof6F9t3Z--gcj0QjupyiDFjYFIcfY9gVPZC-ri-BNoEeRU7PGCk",
  },
  {
    id: "3",
    name: "Tutorial_Lesson_01.mp4",
    size: "890 MB",
    duration: "24:12",
    s3Link: "s3://prod-cdn/edu/921...84.mp4",
    status: "published",
    date: "Oct 21, 2023",
    time: "09:30 AM",
    thumbnail:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAfLVkH7b3egSu-5-Oz7WRxFyuqAPwbU3JLx2WStrK-ZKtQUwnFK4rDPOVuaKuyudrBOuWuagHt7uzkq15m9WMxGryibZfyvdX2-WO8aOjMxJ782lBv7vrj67EaIv6kxTnPjT0HaCmQfpkdkmGeE62Ve983U4-0LEAlOHTotuugn0RNA7VxCihFp9E9jmj7yU4b29par2iTyKqOY2rQT-eLuwQ4hqiPTtJrnwHOUCUJRR9b8RMrVHc7CJx8RuUsLsVNDPGeEYUPZdM",
  },
];

const STATUS_OPTIONS = ["All", "Published", "Uploading", "Failed"] as const;

export default function VideoTable() {
  const [statusFilter, setStatusFilter] = useState<string>("All");

  const filteredVideos = MOCK_VIDEOS.filter((v) => {
    if (statusFilter === "All") return true;
    return v.status === statusFilter.toLowerCase();
  });

  return (
    <section className="bg-[#F1F5F9] rounded-2xl p-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-xl font-extrabold text-[#1E293B] tracking-tight">
            Video Library
          </h2>
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
              onChange={(e) => setStatusFilter(e.target.value)}
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

      {/* Table */}
      <div className="bg-white rounded-2xl overflow-hidden border border-[#E2E8F0]">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[700px]">
            <thead>
              <tr className="border-b border-[#E2E8F0]">
                {["Video Name", "S3 Public Link", "Status", "Date Uploaded", "Actions"].map(
                  (col, i) => (
                    <th
                      key={col}
                      className={`px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-[#64748B] ${
                        i === 4 ? "text-right" : ""
                      }`}
                    >
                      {col}
                    </th>
                  )
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F1F5F9]">
              {filteredVideos.length > 0 ? (
                filteredVideos.map((video) => <VideoRow key={video.id} video={video} />)
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

        {/* Pagination */}
        <div className="px-6 py-4 border-t border-[#F1F5F9] flex items-center justify-between bg-[#FAFAFA]">
          <p className="text-[10px] font-bold text-[#64748B] uppercase tracking-widest">
            Showing 1–15 of 1,284 videos
          </p>
          <div className="flex items-center gap-2">
            <button
              className="p-2 hover:bg-[#F1F5F9] rounded-lg transition-colors duration-150 text-[#94A3B8] cursor-pointer"
              aria-label="Previous page"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <div className="flex items-center gap-1">
              {[1, 2, 3].map((page) => (
                <button
                  key={page}
                  className={`w-8 h-8 flex items-center justify-center text-[10px] font-bold rounded-lg transition-colors duration-150 cursor-pointer ${
                    page === 1
                      ? "bg-[#2563EB] text-white"
                      : "text-[#64748B] hover:bg-[#F1F5F9]"
                  }`}
                  aria-label={`Page ${page}`}
                  aria-current={page === 1 ? "page" : undefined}
                >
                  {page}
                </button>
              ))}
            </div>
            <button
              className="p-2 hover:bg-[#F1F5F9] rounded-lg transition-colors duration-150 text-[#94A3B8] cursor-pointer"
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
