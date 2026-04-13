"use client";

import { CloudArrowUpIcon } from "@heroicons/react/24/solid";
import { useCallback, useRef, useState } from "react";

const ACCEPTED_TYPES = ["MP4", "MOV", "WEBM"];
const ACCEPTED_MIME = ["video/mp4", "video/quicktime", "video/webm"];

interface DropZoneProps {
  onFilesSelected: (files: File[]) => void;
}

export default function DropZone({ onFilesSelected }: DropZoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFiles = useCallback(
    (files: FileList | null) => {
      if (!files) return;
      const valid = Array.from(files).filter((f) => ACCEPTED_MIME.includes(f.type));
      if (valid.length > 0) onFilesSelected(valid);
    },
    [onFilesSelected]
  );

  const onDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const onDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      handleFiles(e.dataTransfer.files);
    },
    [handleFiles]
  );

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") inputRef.current?.click();
  };

  return (
    <div
      role="button"
      tabIndex={0}
      aria-label="Drop zone: drag and drop video files or press Enter to browse"
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
      onClick={() => inputRef.current?.click()}
      onKeyDown={onKeyDown}
      className={`relative border-2 border-dashed rounded-2xl p-12 flex flex-col items-center justify-center gap-4 cursor-pointer transition-colors duration-200 outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB] focus-visible:ring-offset-2 ${
        isDragging
          ? "border-[#2563EB] bg-[#EFF6FF]"
          : "border-[#CBD5E1] bg-[#F8FAFC] hover:border-[#93C5FD] hover:bg-[#F1F5F9]"
      }`}
    >
      <div
        className={`w-20 h-20 rounded-full bg-[#EFF6FF] flex items-center justify-center text-[#2563EB] transition-transform duration-300 ${
          isDragging ? "scale-110" : ""
        }`}
      >
        <CloudArrowUpIcon className="w-10 h-10" />
      </div>

      <div className="text-center">
        <p className="text-lg font-semibold text-[#1E293B]">
          Drag &amp; drop video files here
        </p>
        <p className="text-sm text-[#64748B] mt-1">or click to browse from your device</p>
      </div>

      <div className="flex gap-3 mt-2">
        {ACCEPTED_TYPES.map((type) => (
          <span
            key={type}
            className="px-3 py-1 bg-[#E2E8F0] text-[#475569] text-[10px] font-bold uppercase rounded-lg tracking-wider"
          >
            {type}
          </span>
        ))}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept={ACCEPTED_MIME.join(",")}
        multiple
        className="sr-only"
        aria-hidden="true"
        tabIndex={-1}
        onChange={(e) => handleFiles(e.target.files)}
      />
    </div>
  );
}
