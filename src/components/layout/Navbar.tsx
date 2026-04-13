import { BellIcon, Cog6ToothIcon, MagnifyingGlassIcon, PlusIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="bg-white/80 backdrop-blur-xl sticky top-0 z-50 border-b border-[#E2E8F0] flex justify-between items-center w-full px-6 py-3">
      <div className="flex items-center gap-8">
        <span className="text-xl font-bold tracking-tight text-[#1E293B]">
          S3 Video Manager
        </span>
        <div className="hidden md:flex items-center bg-[#F1F5F9] px-3 py-2 rounded-xl gap-2">
          <MagnifyingGlassIcon className="w-4 h-4 text-[#94A3B8]" />
          <input
            className="bg-transparent outline-none text-sm w-64 placeholder:text-[#94A3B8] text-[#1E293B]"
            placeholder="Search assets..."
            type="text"
            aria-label="Search assets"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <Link
          href="/upload"
          className="flex items-center gap-2 px-4 py-2 bg-[#2563EB] text-white rounded-xl font-semibold text-sm hover:bg-[#1D4ED8] transition-colors duration-200 cursor-pointer"
          aria-label="New Upload"
        >
          <PlusIcon className="w-4 h-4" />
          New Upload
        </Link>

        <div className="flex items-center gap-1 border-l border-[#E2E8F0] pl-4">
          <button
            className="p-2 text-[#64748B] hover:bg-[#F1F5F9] rounded-lg transition-colors duration-200 cursor-pointer"
            aria-label="Notifications"
          >
            <BellIcon className="w-5 h-5" />
          </button>
          <button
            className="p-2 text-[#64748B] hover:bg-[#F1F5F9] rounded-lg transition-colors duration-200 cursor-pointer"
            aria-label="Settings"
          >
            <Cog6ToothIcon className="w-5 h-5" />
          </button>
          <div className="relative w-8 h-8 rounded-full ml-2 overflow-hidden">
            <Image
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAUhwpwEK4OTz2IuhH-EHq93DgURg0WMp-QwnOPjPt74KWG3mLStVm-h1-EIj_g5ns7oeSDZtjRqFjt2OX5hdN6Pol5Bn_vXkxWzyk2AWrX9tV_pekodGb598NJPhpsnQQVs-Q5qeer9q7bv3C323AWyPz0X_jJSg4d28OTggymGBsV7NmS2F8FIzviXoaLgg9o2XR5tenJNbneZUDjHCY65HrwfanrnggUDSjVmlBsJd04DxVOJIojpKhYmSJpO2lRytnW17iyPuo"
              alt="User profile"
              fill
              className="object-cover"
              unoptimized
            />
          </div>
        </div>
      </div>
    </nav>
  );
}
