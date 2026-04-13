import { SparklesIcon } from "@heroicons/react/24/outline";

export default function SystemInfoBento() {
  return (
    <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Cloud Origin Metrics */}
      <div className="col-span-1 md:col-span-2 bg-[#F1F5F9] border border-[#E2E8F0] p-6 rounded-2xl flex flex-col justify-between">
        <div>
          <h4 className="text-[10px] font-black text-[#64748B] uppercase tracking-[0.2em] mb-4">
            Cloud Origin Metrics
          </h4>
          <div className="grid grid-cols-2 gap-8">
            <div>
              <p className="text-2xl font-extrabold text-[#1E293B]">1.2 GB/s</p>
              <p className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-wider mt-1">
                Uplink Speed
              </p>
            </div>
            <div>
              <p className="text-2xl font-extrabold text-[#1E293B]">us-east-1</p>
              <p className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-wider mt-1">
                Target Region
              </p>
            </div>
          </div>
        </div>

        <div className="mt-6 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#16A34A] animate-pulse" aria-hidden="true" />
          <span className="text-xs font-medium text-[#16A34A]">All systems operational</span>
        </div>
      </div>

      {/* Smart Encoding Card */}
      <div className="bg-[#2563EB] p-6 rounded-2xl text-white flex flex-col justify-between">
        <SparklesIcon className="w-8 h-8 opacity-50" aria-hidden="true" />
        <div className="mt-6">
          <p className="text-lg font-bold leading-tight">Smart Encoding</p>
          <p className="text-xs text-white/70 mt-1">
            Multi-bitrate processing enabled by default.
          </p>
        </div>
      </div>
    </section>
  );
}
