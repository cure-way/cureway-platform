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
        className={`fixed inset-y-0 left-0 z-50 w-64 border-r bg-white px-6 py-6
        transition-transform
        lg:static lg:translate-x-0 lg:min-h-screen
        ${open ? "translate-x-0" : "-translate-x-full"}`}
      >
        {/* Logo */}
        <div className="flex items-center gap-2 mb-10">
          <Image
            src="/logo.png"
            alt="CureWay Logo"
            width={32}
            height={32}
            className="w-8 h-8"
          />
          <div>
            <h1 className="font-semibold text-(--color-primary) text-2xl">
              CureWay
            </h1>
            <p className="text-(--color-primary) text-sm">{displayName}</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="space-y-4">
          {NAV_ITEMS.map((item) => {
            const isActive =
              pathname === item.href || pathname.startsWith(item.href + "/");

            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={`flex items-center gap-3 rounded-lg px-4 py-2 text-sm font-medium transition
                  ${
                    isActive
                      ? "bg-(--color-secondary-light) text-(--color-primary)"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
              >
                <Icon className="text-lg" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>
    </>
  );
}
