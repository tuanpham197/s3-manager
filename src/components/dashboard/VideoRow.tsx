"use client";

import {
  ClipboardDocumentIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  XMarkIcon,
  PlayCircleIcon,
  CheckIcon,
} from "@heroicons/react/24/outline";
import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import type { Video } from "@/types/video";

interface VideoRowProps {
  video: Video;
  onDelete: (id: string) => void;
  onEdit: (id: string, name: string) => void;
}

export default function VideoRow({ video, onDelete, onEdit }: VideoRowProps) {
  const isUploading = video.status === "uploading";
  const isPublished = video.status === "published";
  const isFailed = video.status === "failed";

  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(video.name);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing) inputRef.current?.focus();
  }, [isEditing]);

  const handleCopy = () => {
    navigator.clipboard.writeText(video.s3_link).catch(() => {});
  };

  const startEdit = () => {
    setEditName(video.name);
    setIsEditing(true);
  };

  const cancelEdit = () => {
    setEditName(video.name);
    setIsEditing(false);
  };

  const commitEdit = () => {
    const trimmed = editName.trim();
    if (trimmed && trimmed !== video.name) {
      onEdit(video.id, trimmed);
    }
    setIsEditing(false);
  };

  const handleEditKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") commitEdit();
    if (e.key === "Escape") cancelEdit();
  };

  return (
    <tr className="group hover:bg-[#F8FAFC] transition-colors duration-150">
      {/* Video Name */}
      <td className="px-6 py-4">
        <div className="flex items-center gap-4">
          <div className="relative w-16 h-10 bg-[#E2E8F0] rounded-lg overflow-hidden flex-shrink-0 group/thumb cursor-pointer">
            <Image
              src={video.thumbnail}
              alt={`Thumbnail for ${video.name}`}
              fill
              className={`object-cover transition-all duration-200 ${isUploading ? "grayscale opacity-50" : ""}`}
              unoptimized
            />
            {isPublished && (
              <div className="absolute inset-0 bg-black/25 flex items-center justify-center opacity-0 group-hover/thumb:opacity-100 transition-opacity duration-200">
                <PlayCircleIcon className="w-5 h-5 text-white" />
              </div>
            )}
          </div>
          <div className="min-w-0">
            {isEditing ? (
              <input
                ref={inputRef}
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                onKeyDown={handleEditKeyDown}
                onBlur={commitEdit}
                className="text-sm font-semibold text-[#1E293B] border border-[#2563EB] rounded px-2 py-0.5 outline-none w-full"
              />
            ) : (
              <p className="text-sm font-semibold text-[#1E293B] leading-tight truncate">{video.name}</p>
            )}
            <p className="text-[10px] text-[#94A3B8] font-medium mt-0.5">
              {video.size} &bull; {video.duration}
            </p>
          </div>
        </div>
      </td>

      {/* S3 Link */}
      <td className="px-6 py-4">
        <div className="flex items-center gap-2 group/link">
          <code className="text-[10px] bg-[#F8FAFC] text-[#64748B] px-2 py-1 rounded border border-[#E2E8F0] font-mono truncate max-w-[180px]">
            {video.s3_link}
          </code>
          <button
            onClick={handleCopy}
            className="text-[#2563EB] opacity-0 group-hover/link:opacity-100 transition-opacity duration-200 p-1 hover:bg-[#EFF6FF] rounded cursor-pointer"
            aria-label="Copy S3 link"
          >
            <ClipboardDocumentIcon className="w-4 h-4" />
          </button>
        </div>
      </td>

      {/* Status */}
      <td className="px-6 py-4">
        {isUploading ? (
          <div className="flex items-center gap-2 bg-[#EFF6FF] px-2.5 py-1.5 rounded-lg w-fit">
            <div className="w-1.5 h-1.5 rounded-full bg-[#2563EB] animate-pulse" />
            <span className="text-[9px] font-black text-[#2563EB] uppercase tracking-wider">
              Uploading {video.uploadProgress}%
            </span>
          </div>
        ) : isFailed ? (
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#DC2626]" />
            <span className="text-[10px] font-bold text-[#DC2626] uppercase tracking-tight">Failed</span>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#16A34A]" />
            <span className="text-[10px] font-bold text-[#16A34A] uppercase tracking-tight">Published</span>
          </div>
        )}
      </td>

      {/* Date */}
      <td className="px-6 py-4">
        <p className="text-[10px] font-medium text-[#475569]">{video.date}</p>
        <p className="text-[9px] text-[#94A3B8] font-medium">{video.time}</p>
      </td>

      {/* Actions */}
      <td className="px-6 py-4 text-right">
        <div className="flex items-center justify-end gap-1">
          {isEditing ? (
            <>
              <button
                onClick={commitEdit}
                className="p-2 text-[#16A34A] hover:bg-[#F0FDF4] rounded-lg transition-all duration-150 cursor-pointer"
                aria-label="Save edit"
              >
                <CheckIcon className="w-5 h-5" />
              </button>
              <button
                onClick={cancelEdit}
                className="p-2 text-[#94A3B8] hover:bg-[#F1F5F9] rounded-lg transition-all duration-150 cursor-pointer"
                aria-label="Cancel edit"
              >
                <XMarkIcon className="w-5 h-5" />
              </button>
            </>
          ) : (
            <>
              <button
                disabled={isUploading}
                className={`p-2 rounded-lg transition-all duration-150 cursor-pointer ${
                  isUploading
                    ? "text-[#CBD5E1] cursor-not-allowed"
                    : "text-[#94A3B8] hover:text-[#2563EB] hover:bg-[#EFF6FF]"
                }`}
                aria-label="View video"
              >
                <EyeIcon className="w-5 h-5" />
              </button>
              <button
                onClick={startEdit}
                disabled={isUploading}
                className={`p-2 rounded-lg transition-all duration-150 cursor-pointer ${
                  isUploading
                    ? "text-[#CBD5E1] cursor-not-allowed"
                    : "text-[#94A3B8] hover:text-[#1E293B] hover:bg-[#F1F5F9]"
                }`}
                aria-label="Edit video"
              >
                <PencilIcon className="w-5 h-5" />
              </button>
              <button
                onClick={() => onDelete(video.id)}
                className="p-2 text-[#94A3B8] hover:text-[#DC2626] hover:bg-[#FEF2F2] rounded-lg transition-all duration-150 cursor-pointer"
                aria-label={isUploading ? "Cancel upload" : "Delete video"}
              >
                {isUploading ? <XMarkIcon className="w-5 h-5" /> : <TrashIcon className="w-5 h-5" />}
              </button>
            </>
          )}
        </div>
      </td>
    </tr>
  );
}
