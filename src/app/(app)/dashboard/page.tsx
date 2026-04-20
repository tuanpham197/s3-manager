"use client";

import { useState, useEffect, useCallback } from "react";
import MetricCard from "@/components/dashboard/MetricCard";
import VideoTable from "@/components/dashboard/VideoTable";
import { api, ApiError } from "@/lib/api";
import type { VideoListResponse } from "@/types/api";
import type { Video, VideoStatus } from "@/types/video";

const LIMIT = 20;

export default function DashboardPage() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [pagination, setPagination] = useState({ page: 1, limit: LIMIT, total: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("All");
  const [fetchError, setFetchError] = useState<string | null>(null);

  const fetchVideos = useCallback(async (page: number, status: string) => {
    setIsLoading(true);
    setFetchError(null);
    try {
      const params = new URLSearchParams({ page: String(page), limit: String(LIMIT) });
      if (status !== "All") params.set("status", status.toLowerCase() as VideoStatus);

      const data = await api.get<VideoListResponse>(`/api/videos?${params}`);
      setVideos(data.data);
      setPagination(data.pagination);
    } catch (err) {
      setFetchError(err instanceof ApiError ? err.message : "Failed to load videos.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchVideos(1, statusFilter);
  }, [fetchVideos, statusFilter]);

  const handleStatusChange = (status: string) => {
    setStatusFilter(status);
  };

  const handlePageChange = (page: number) => {
    fetchVideos(page, statusFilter);
  };

  const handleDeleteVideo = async (id: string) => {
    setVideos((prev) => prev.filter((v) => v.id !== id));
    setPagination((prev) => ({ ...prev, total: Math.max(0, prev.total - 1) }));
    try {
      await api.delete(`/api/videos/${id}`);
    } catch {
      fetchVideos(pagination.page, statusFilter);
    }
  };

  const handleEditVideo = async (id: string, name: string) => {
    setVideos((prev) => prev.map((v) => (v.id === id ? { ...v, name } : v)));
    try {
      await api.patch(`/api/videos/${id}`, { name });
    } catch {
      fetchVideos(pagination.page, statusFilter);
    }
  };

  return (
    <main className="ml-64 flex-1 p-8 min-h-screen">
      <section className="mb-12">
        <h1 className="text-3xl font-extrabold text-[#1E293B] mb-8 tracking-tight">
          Architecture Overview
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <MetricCard
            title="Total Videos"
            value={isLoading ? "—" : pagination.total.toLocaleString()}
            badge="12%"
            badgePositive
            footer="Managed across 4 regions"
          />
          <MetricCard
            title="Storage Used"
            value="4.2"
            unit="TB"
            progress={65}
            progressLabel="65% of S3 Standard quota"
          />
          <MetricCard
            title="Last Sync"
            value="4 mins ago"
            syncImage="https://lh3.googleusercontent.com/aida-public/AB6AXuDiDyGxAoKiQ0GRDVlLfpZWZn-GVr-ZhJ90dO4zLRVWxLJ7LxlFK06IXsxQoW9p_r0BFR1drTIZcsO3jSmr44D2PkkUozdbV6M6yxz8hnGX-NygOSNAe0wn2qnTmGFDFyMJNMICmIYBx0YNJ5-GFi8dj3QkW_S3DEL4Agtistlih2f6m_m8s-1Ni9w6TtzAX0iCOJ8q3VRdqrpLMO72vxQEBAc-pPw9TsakyPt00lVOQAXPuIdrBQkz8BaGEFsjoOiN9IJwib1_4Lg"
            syncStatus="Google Sheets Connected"
            footer="Asset index fully synced"
          />
        </div>
      </section>

      {fetchError && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl">
          {fetchError}
        </div>
      )}

      <VideoTable
        videos={videos}
        pagination={pagination}
        isLoading={isLoading}
        statusFilter={statusFilter}
        onStatusChange={handleStatusChange}
        onPageChange={handlePageChange}
        onDeleteVideo={handleDeleteVideo}
        onEditVideo={handleEditVideo}
      />
    </main>
  );
}
