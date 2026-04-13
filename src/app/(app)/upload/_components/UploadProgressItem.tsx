"use client";

import {
  CheckCircleIcon,
  XCircleIcon,
  FilmIcon,
  ClipboardDocumentIcon,
  EllipsisVerticalIcon,
  LinkIcon,
} from "@heroicons/react/24/outline";
import { CheckCircleIcon as CheckCircleSolid } from "@heroicons/react/24/solid";

export interface UploadItem {
  id: string;
  name: string;
  status: "uploading" | "success" | "error";
  progress?: number;
  timeRemaining?: string;
  s3Link?: string;
}

interface UploadProgressItemProps {
  item: UploadItem;
  onCancel?: (id: string) => void;
}

export default function UploadProgressItem({ item, onCancel }: UploadProgressItemProps) {
  const handleCopy = () => {
    if (item.s3Link) navigator.clipboard.writeText(item.s3Link).catch(() => {});
  };

  if (item.status === "success") {
    return (
      <div className="bg-white p-5 rounded-2xl border border-[#E2E8F0] flex items-center gap-5 hover:border-[#BBF7D0] transition-colors duration-150">
        <div className="w-12 h-12 rounded-xl bg-[#F0FDF4] flex items-center justify-center text-[#16A34A] flex-shrink-0">
          <CheckCircleSolid className="w-6 h-6" />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap justify-between items-start gap-2">
            <div className="min-w-0">
              <h3 className="text-sm font-bold text-[#1E293B] truncate">{item.name}</h3>
              {item.s3Link && (
                <div className="flex items-center gap-1.5 mt-1">
                  <LinkIcon className="w-3.5 h-3.5 text-[#16A34A] flex-shrink-0" />
                  <code className="text-[11px] text-[#16A34A] bg-[#F0FDF4] px-2 py-0.5 rounded truncate max-w-[260px]">
                    {item.s3Link}
                  </code>
                </div>
              )}
            </div>
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#EFF6FF] text-[#2563EB] text-[10px] font-bold uppercase rounded-lg hover:bg-[#DBEAFE] transition-colors duration-150 cursor-pointer flex-shrink-0"
              aria-label="Copy S3 link"
            >
              <ClipboardDocumentIcon className="w-3.5 h-3.5" />
              Copy Link
            </button>
          </div>
        </div>

        <div className="h-10 w-px bg-[#E2E8F0] mx-1 flex-shrink-0" />
        <button
          className="p-2 text-[#94A3B8] hover:text-[#1E293B] hover:bg-[#F1F5F9] rounded-lg transition-colors duration-150 cursor-pointer flex-shrink-0"
          aria-label="More options"
        >
          <EllipsisVerticalIcon className="w-5 h-5" />
        </button>
      </div>
    );
  }

  if (item.status === "error") {
    return (
      <div className="bg-white p-5 rounded-2xl border border-[#FEE2E2] flex items-center gap-5">
        <div className="w-12 h-12 rounded-xl bg-[#FEF2F2] flex items-center justify-center text-[#DC2626] flex-shrink-0">
          <XCircleIcon className="w-6 h-6" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-bold text-[#1E293B] truncate">{item.name}</h3>
          <p className="text-[10px] font-bold text-[#DC2626] uppercase tracking-widest mt-0.5">
            Upload Failed
          </p>
        </div>
        <button
          onClick={() => onCancel?.(item.id)}
          className="p-2 text-[#94A3B8] hover:text-[#DC2626] hover:bg-[#FEF2F2] rounded-lg transition-colors duration-150 cursor-pointer flex-shrink-0"
          aria-label="Dismiss error"
        >
          <XCircleIcon className="w-5 h-5" />
        </button>
      </div>
    );
  }

  // Uploading state
  return (
    <div className="bg-white p-5 rounded-2xl border border-[#E2E8F0] flex items-center gap-5 hover:border-[#BFDBFE] transition-colors duration-150">
      <div className="w-12 h-12 rounded-xl bg-[#EFF6FF] flex items-center justify-center text-[#2563EB] flex-shrink-0">
        <FilmIcon className="w-6 h-6" />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-end mb-2 gap-2">
          <div className="min-w-0">
            <h3 className="text-sm font-bold text-[#1E293B] truncate">{item.name}</h3>
            <p className="text-[10px] font-bold text-[#2563EB] uppercase tracking-widest mt-0.5">
              Uploading {item.progress ?? 0}%
            </p>
          </div>
          {item.timeRemaining && (
            <span className="text-[10px] font-medium text-[#64748B] bg-[#F1F5F9] px-2 py-0.5 rounded flex-shrink-0">
              {item.timeRemaining}
            </span>
          )}
        </div>

        <div className="h-2 w-full bg-[#F1F5F9] rounded-full overflow-hidden">
          <div
            className="h-full bg-[#2563EB] rounded-full transition-[width] duration-300 ease-out relative overflow-hidden"
            style={{ width: `${item.progress ?? 0}%` }}
            role="progressbar"
            aria-valuenow={item.progress ?? 0}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={`${item.name} upload progress`}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-[shimmer_2s_ease-in-out_infinite]" />
          </div>
        </div>
      </div>

      <button
        onClick={() => onCancel?.(item.id)}
        className="p-2 text-[#94A3B8] hover:text-[#DC2626] hover:bg-[#FEF2F2] rounded-lg transition-colors duration-150 cursor-pointer flex-shrink-0"
        aria-label={`Cancel upload for ${item.name}`}
      >
        <XCircleIcon className="w-5 h-5" />
      </button>
    </div>
  );
}
