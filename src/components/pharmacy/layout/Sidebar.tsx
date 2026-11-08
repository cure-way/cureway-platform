"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  FiHome,
  FiFileText,
  FiLayers,
  FiBarChart2,
  FiUser,
} from "react-icons/fi";
import { useAuth } from "@/features/auth";

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

const NAV_ITEMS = [
  { label: "Home", href: "/pharmacy/home", icon: FiHome },
  { label: "Orders", href: "/pharmacy/orders", icon: FiFileText },
  { label: "Inventory", href: "/pharmacy/inventory", icon: FiLayers },
  { label: "Report", href: "/pharmacy/report", icon: FiBarChart2 },
  { label: "Profile", href: "/pharmacy/profile", icon: FiUser },
];

export default function Sidebar({ open, onClose }: SidebarProps) {
  const pathname = usePathname();
  const { user, profile } = useAuth();
  const displayName = profile?.pharmacyName ?? user?.name ?? "Pharmacy";

  return (
    <>
      {/* Overlay */}
      <div
        onClick={onClose}
        className={`fixed inset-0 z-40 bg-black/40 transition-opacity lg:hidden ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />

      <aside
        className={`fixed top-[var(--showcase-bar-h,0px)] bottom-0 left-0 z-50 flex w-[280px] flex-col border-r bg-white
        transition-transform
        lg:static lg:translate-x-0 lg:min-h-screen lg:shrink-0
        ${open ? "translate-x-0" : "-translate-x-full"}`}
      >
        {/* Logo row — identical to the admin sidebar: 80px tall to match the
            top bar, 40px mark, same wordmark and the same gap. */}
        <div className="flex h-20 shrink-0 items-center border-b border-[#EFEDED] pl-[20px] pr-[16px]">
          <Link href="/pharmacy/home" className="flex items-center gap-[12px]">
            <Image
              src="/logo.png"
              alt="CUREWAY"
              width={40}
              height={40}
              className="rounded-full"
            />
            <span className="text-t-25 font-bold text-[#121B3C]">CUREWAY</span>
          </Link>
        </div>

        {/* The signed-in pharmacy, which admin has no equivalent of, sits
            above the nav rather than squeezing the logo row. */}
        <p className="shrink-0 truncate px-6 pt-4 text-t-12-semibold text-neutral-dark">
          {displayName}
        </p>

        {/* Navigation */}
        <nav className="flex-1 space-y-4 overflow-y-auto px-6 py-4">
          {NAV_ITEMS.map((item) => {
            const isActive =
              pathname === item.href || pathname.startsWith(item.href + "/");

            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={`flex items-center gap-3 rounded-lg px-4 py-2 text-t-14 font-medium transition
                  ${
                    isActive
                      ? "bg-(--color-secondary-light) text-(--color-primary)"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
              >
                <Icon className="text-t-17" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>
    </>
  );
}
