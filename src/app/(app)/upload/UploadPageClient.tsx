"use client";

import { useCallback, useRef, useState } from "react";
import DropZone from "./_components/DropZone";
import UploadProgressItem, { type UploadItem } from "./_components/UploadProgressItem";
import AutoSyncToggle from "./_components/AutoSyncToggle";
import SystemInfoBento from "./_components/SystemInfoBento";
import Link from "next/link";
import { api, ApiError } from "@/lib/api";
import { getVideoDuration, formatTimeRemaining, xhrPut } from "@/lib/upload";
import type { UploadPresignResponse, UploadCompleteResponse } from "@/types/api";

interface XhrSignal {
  aborted: boolean;
  xhr?: XMLHttpRequest;
}

export default function UploadPageClient() {
  const [uploads, setUploads] = useState<UploadItem[]>([]);
  const signalMap = useRef<Map<string, XhrSignal>>(new Map());

  const updateItem = useCallback((id: string, patch: Partial<UploadItem>) => {
    setUploads((prev) => prev.map((u) => (u.id === id ? { ...u, ...patch } : u)));
  }, []);

  const uploadFile = useCallback(
    async (file: File, id: string) => {
      const signal: XhrSignal = { aborted: false };
      signalMap.current.set(id, signal);

      try {
        // 1. Get presigned URL
        const presign = await api.post<UploadPresignResponse>("/api/upload/presign", {
          filename: file.name,
          content_type: file.type || "video/mp4",
          size: file.size,
        });

        if (signal.aborted) return;

        // 2. PUT directly to S3
        await xhrPut(
          presign.upload_url,
          file,
          (pct, secondsLeft) => {
            updateItem(id, {
              progress: pct,
              timeRemaining: formatTimeRemaining(secondsLeft),
            });
          },
          signal,
        );

        if (signal.aborted) return;

        // 3. Notify backend upload is complete
        const durationSeconds = await getVideoDuration(file);
        let s3Link = `s3://${presign.s3_bucket}/${presign.s3_key}`;

        try {
          const result = await api.post<UploadCompleteResponse>("/api/upload/complete", {
            s3_key: presign.s3_key,
            s3_bucket: presign.s3_bucket,
            filename: file.name,
            size: file.size,
            duration_seconds: durationSeconds,
          });
          s3Link = result.video.s3_link;
        } catch {
          // File is in S3 — still show success with derived link
        }

        updateItem(id, { status: "success", s3Link, progress: 100, timeRemaining: undefined });
      } catch (err) {
        if (err instanceof Error && err.message === "Upload cancelled") return;
        const message =
          err instanceof ApiError ? err.message : "Upload failed. Please try again.";
        updateItem(id, { status: "error", timeRemaining: message });
      } finally {
        signalMap.current.delete(id);
      }
    },
    [updateItem],
  );

  const handleFilesSelected = useCallback(
    (files: File[]) => {
      const newItems: UploadItem[] = files.map((file) => ({
        id: `${Date.now()}-${Math.random().toString(36).slice(2)}-${file.name}`,
        name: file.name,
        status: "uploading",
        progress: 0,
      }));

      setUploads((prev) => [...prev, ...newItems]);
      newItems.forEach((item) => uploadFile(files[newItems.indexOf(item)], item.id));
    },
    [uploadFile],
  );

  const handleCancel = useCallback((id: string) => {
    const signal = signalMap.current.get(id);
    if (signal) {
      signal.aborted = true;
      signal.xhr?.abort();
      signalMap.current.delete(id);
    }
    setUploads((prev) => prev.filter((u) => u.id !== id));
  }, []);

  const activeCount = uploads.filter((u) => u.status === "uploading").length;

  return (
    <main className="ml-0 md:ml-64 flex-1 min-h-screen pt-[57px] pb-20 md:pb-12 px-6">
      <div className="max-w-4xl mx-auto space-y-8 py-8">
        {/* Breadcrumb */}
        <nav
          aria-label="Breadcrumb"
          className="flex items-center gap-2 text-[10px] font-bold tracking-widest uppercase text-[#64748B]"
        >
          <Link
            href="/dashboard"
            className="hover:text-[#2563EB] transition-colors duration-150 cursor-pointer"
          >
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
              <h2 className="text-xl font-bold text-[#1E293B] tracking-tight">Current Uploads</h2>
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

        <SystemInfoBento />
      </div>
    </main>
  );
}
