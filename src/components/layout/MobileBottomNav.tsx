"use client";

import {
  Squares2X2Icon,
  FilmIcon,
  PlusIcon,
  Cog6ToothIcon,
  QuestionMarkCircleIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/", label: "Home", icon: Squares2X2Icon },
  { href: "/videos", label: "Videos", icon: FilmIcon },
  { href: "/integrations", label: "Settings", icon: Cog6ToothIcon },
  { href: "/help", label: "Help", icon: QuestionMarkCircleIcon },
];

export default function MobileBottomNav() {
  const pathname = usePathname();

  return (
    <nav
      className="md:hidden fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-lg border-t border-[#E2E8F0] flex justify-around items-center py-3 z-50"
      aria-label="Mobile navigation"
    >
      {navItems.map(({ href, label, icon: Icon }, i) => {
        // Center FAB slot
        if (i === 1) {
          return (
            <div key="fab-group" className="flex items-center gap-8">
              <Link
                href={href}
                className={`flex flex-col items-center gap-1 cursor-pointer transition-colors duration-150 ${
                  pathname === href ? "text-[#2563EB]" : "text-[#94A3B8] hover:text-[#64748B]"
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="text-[10px] font-medium">{label}</span>
              </Link>

              {/* Center upload FAB */}
              <Link
                href="/upload"
                className="w-12 h-12 -mt-8 bg-[#2563EB] rounded-full flex items-center justify-center text-white shadow-lg border-4 border-white hover:bg-[#1D4ED8] transition-colors duration-150 cursor-pointer"
                aria-label="New upload"
              >
                <PlusIcon className="w-5 h-5" />
              </Link>
            </div>
          );
        }
        return (
          <Link
            key={href}
            href={href}
            className={`flex flex-col items-center gap-1 cursor-pointer transition-colors duration-150 ${
              pathname === href ? "text-[#2563EB]" : "text-[#94A3B8] hover:text-[#64748B]"
            }`}
          >
            <Icon className="w-5 h-5" />
            <span className="text-[10px] font-medium">{label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
