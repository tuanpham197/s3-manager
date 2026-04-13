"use client";

import {
  Squares2X2Icon,
  FilmIcon,
  AdjustmentsHorizontalIcon,
  QuestionMarkCircleIcon,
  CloudIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/", label: "Dashboard", icon: Squares2X2Icon },
  { href: "/videos", label: "All Videos", icon: FilmIcon },
  { href: "/integrations", label: "Integration Settings", icon: AdjustmentsHorizontalIcon },
  { href: "/help", label: "Help / Docs", icon: QuestionMarkCircleIcon },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="h-[calc(100vh-57px)] w-64 fixed left-0 top-[57px] bg-white border-r border-[#E2E8F0] flex flex-col p-4 gap-2">
      <div className="mb-6 px-2 flex items-center gap-3">
        <div className="w-8 h-8 bg-[#2563EB] rounded-lg flex items-center justify-center text-white flex-shrink-0">
          <CloudIcon className="w-4 h-4" />
        </div>
        <div>
          <p className="text-sm font-bold text-[#1E293B] leading-tight">S3 Video</p>
          <p className="text-[10px] uppercase tracking-wider text-[#64748B] font-medium">
            Management Console
          </p>
        </div>
      </div>

      <nav className="flex-1 space-y-1" aria-label="Sidebar navigation">
        {navItems.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors duration-200 cursor-pointer ${
                isActive
                  ? "bg-[#EFF6FF] text-[#2563EB] font-semibold"
                  : "text-[#64748B] hover:bg-[#F8FAFC] hover:text-[#1E293B]"
              }`}
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              <span className="text-xs font-medium uppercase tracking-tight">{label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto p-4 bg-[#EFF6FF] rounded-xl border border-[#BFDBFE]">
        <p className="text-xs font-bold text-[#2563EB] mb-1">Upgrade Plan</p>
        <p className="text-[10px] text-[#475569] mb-3 leading-relaxed">
          Unlock advanced S3 analytics and 4K transcoding.
        </p>
        <button className="w-full py-2 bg-[#2563EB] text-white text-[10px] font-bold rounded-lg hover:bg-[#1D4ED8] transition-colors duration-200 cursor-pointer">
          GO PRO
        </button>
      </div>
    </aside>
  );
}
