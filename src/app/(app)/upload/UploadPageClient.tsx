"use client";

import { useCallback, useState } from "react";
import DropZone from "./_components/DropZone";
import UploadProgressItem, { type UploadItem } from "./_components/UploadProgressItem";
import AutoSyncToggle from "./_components/AutoSyncToggle";
import SystemInfoBento from "./_components/SystemInfoBento";
import Link from "next/link";

// Seed with mock data matching the HTML design
const MOCK_UPLOADS: UploadItem[] = [
  {
    id: "mock-1",
    name: "marketing_hero_v1.mp4",
    status: "uploading",
    progress: 45,
    timeRemaining: "Time Remaining: 2 mins",
  },
  {
    id: "mock-2",
    name: "intro_v2.mov",
    status: "success",
    s3Link: "s3://video-bucket/uploads/intro_v2_99x.mov",
  },
];

export default function UploadPageClient() {
  const [uploads, setUploads] = useState<UploadItem[]>(MOCK_UPLOADS);

  const handleFilesSelected = useCallback((files: File[]) => {
    const newItems: UploadItem[] = files.map((file) => ({
      id: `${Date.now()}-${file.name}`,
      name: file.name,
      status: "uploading",
      progress: 0,
    }));
    setUploads((prev) => [...prev, ...newItems]);

    // Simulate upload progress for demo
    newItems.forEach((item) => {
      let progress = 0;
      const interval = setInterval(() => {
        progress += Math.floor(Math.random() * 8) + 3;
        if (progress >= 100) {
          clearInterval(interval);
          setUploads((prev) =>
            prev.map((u) =>
              u.id === item.id
                ? { ...u, status: "success", s3Link: `s3://prod-cdn/uploads/${item.name}` }
                : u
            )
          );
        } else {
          setUploads((prev) =>
            prev.map((u) => (u.id === item.id ? { ...u, progress } : u))
          );
        }
      }, 300);
    });
  }, []);

  const handleCancel = useCallback((id: string) => {
    setUploads((prev) => prev.filter((u) => u.id !== id));
  }, []);

  const activeCount = uploads.filter((u) => u.status === "uploading").length;

  return (
    <main className="ml-0 md:ml-64 flex-1 min-h-screen pt-[57px] pb-20 md:pb-12 px-6">
      <div className="max-w-4xl mx-auto space-y-8 py-8">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-[10px] font-bold tracking-widest uppercase text-[#64748B]">
          <Link href="/dashboard" className="hover:text-[#2563EB] transition-colors duration-150 cursor-pointer">
            Dashboard
          </Link>
          <span aria-hidden="true">/</span>
          <span className="text-[#1E293B]">Video Upload</span>
        </nav>

        {/* Upload Card */}
        <section className="bg-white rounded-2xl border border-[#E2E8F0] p-8">
          <div className="flex flex-col items-center text-center mb-8">
            <h1 className="text-3xl font-extrabold text-[#1E293B] mb-2 tracking-tight">
              Upload New Video
            </h1>
            <p className="text-[#64748B] max-w-md text-sm leading-relaxed">
              Distribute high-resolution video assets directly to your S3 storage nodes with
              editorial-grade optimization.
            </p>
          </div>

          <DropZone onFilesSelected={handleFilesSelected} />
          <AutoSyncToggle />
        </section>

        {/* Current Uploads */}
        {uploads.length > 0 && (
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-[#1E293B] tracking-tight">
                Current Uploads
              </h2>
              {activeCount > 0 && (
                <span className="px-2.5 py-0.5 bg-[#DBEAFE] text-[#2563EB] text-[10px] font-bold rounded-full uppercase tracking-wide">
                  {activeCount} Active {activeCount === 1 ? "Task" : "Tasks"}
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 gap-4">
              {uploads.map((item) => (
                <UploadProgressItem key={item.id} item={item} onCancel={handleCancel} />
              ))}
            </div>
          </section>
        )}

        {/* System Info Bento */}
        <SystemInfoBento />
      </div>
    </main>
  );
}
