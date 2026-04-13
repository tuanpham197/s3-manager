"use client";

import { InformationCircleIcon } from "@heroicons/react/24/outline";

interface SaveBarProps {
  onSave: () => void;
  onDiscard: () => void;
}

export default function SaveBar({ onSave, onDiscard }: SaveBarProps) {
  return (
    <div className="mt-12 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-6 bg-[#1E293B] text-white rounded-2xl shadow-2xl">
      <div className="flex items-center gap-3">
        <InformationCircleIcon className="w-5 h-5 text-[#93C5FD] flex-shrink-0" />
        <p className="text-sm font-medium text-[#E2E8F0]">
          You have unsaved changes in AWS S3 Configuration.
        </p>
      </div>
      <div className="flex items-center gap-3 flex-shrink-0">
        <button
          onClick={onDiscard}
          className="px-5 py-2 text-sm font-bold text-[#94A3B8] hover:text-white hover:bg-white/10 rounded-xl transition-colors duration-150 cursor-pointer"
        >
          Discard
        </button>
        <button
          onClick={onSave}
          className="px-7 py-2 bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-sm font-bold rounded-xl transition-colors duration-150 cursor-pointer shadow-lg shadow-[#2563EB]/30"
        >
          Save Changes
        </button>
      </div>
    </div>
  );
}
