import { ArrowTrendingUpIcon } from "@heroicons/react/24/outline";
import Image from "next/image";

interface MetricCardProps {
  title: string;
  value: string;
  unit?: string;
  badge?: string;
  badgePositive?: boolean;
  progress?: number;
  progressLabel?: string;
  syncImage?: string;
  syncStatus?: string;
  footer?: string;
}

export default function MetricCard({
  title,
  value,
  unit,
  badge,
  badgePositive,
  progress,
  progressLabel,
  syncImage,
  syncStatus,
  footer,
}: MetricCardProps) {
  return (
    <div className="bg-white p-6 rounded-2xl border border-[#E2E8F0] relative overflow-hidden group cursor-default hover:border-[#BFDBFE] transition-colors duration-200">
      {/* Decorative circle */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-[#2563EB]/5 rounded-full -mr-16 -mt-16 group-hover:scale-110 transition-transform duration-500" />

      <p className="text-[10px] font-bold uppercase tracking-widest text-[#64748B] mb-2">
        {title}
      </p>

      {syncImage ? (
        <div className="flex items-center gap-3">
          <div className="relative w-10 h-10 rounded-lg overflow-hidden flex-shrink-0">
            <Image
              src={syncImage}
              alt="Google Sheets logo"
              fill
              className="object-cover"
              unoptimized
            />
          </div>
          <div>
            <span className="text-xl font-bold text-[#1E293B] block">{value}</span>
            <span className="text-[10px] font-bold text-[#16A34A] uppercase tracking-tight">
              {syncStatus}
            </span>
          </div>
        </div>
      ) : (
        <div className="flex items-baseline gap-2">
          <span className="text-4xl font-extrabold text-[#1E293B]">{value}</span>
          {unit && <span className="text-2xl font-bold text-[#94A3B8]">{unit}</span>}
          {badge && (
            <span
              className={`text-xs font-bold flex items-center gap-1 ${
                badgePositive ? "text-[#16A34A]" : "text-[#DC2626]"
              }`}
            >
              <ArrowTrendingUpIcon className="w-3.5 h-3.5" />
              {badge}
            </span>
          )}
        </div>
      )}

      {typeof progress === "number" && (
        <>
          <div className="w-full bg-[#F1F5F9] h-1.5 rounded-full mt-4 overflow-hidden">
            <div
              className="bg-[#2563EB] h-full rounded-full transition-all duration-700"
              style={{ width: `${progress}%` }}
            />
          </div>
          {progressLabel && (
            <p className="text-[10px] text-[#94A3B8] mt-2 font-medium uppercase tracking-tighter">
              {progressLabel}
            </p>
          )}
        </>
      )}

      {footer && !progressLabel && (
        <p className="text-[10px] text-[#94A3B8] mt-4 font-medium uppercase tracking-tighter">
          {footer}
        </p>
      )}
    </div>
  );
}
