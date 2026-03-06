"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  Settings,
  Monitor,
  Smartphone,
  Globe,
  SlidersHorizontal,
  ChevronDown,
  ChevronUp,
  LogOut,
  Circle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/features/auth";

/* ------------------------------------------------------------------
   TYPES
   ------------------------------------------------------------------ */
interface SettingsSubItem {
  label: string;
  href: string;
}

interface SettingsNavItem {
  label: string;
  icon: React.ReactNode;
  href?: string;
  subItems?: SettingsSubItem[];
}

/* ------------------------------------------------------------------
   NAV DATA
   ------------------------------------------------------------------ */
const generalSubItems: SettingsSubItem[] = [
  { label: "Profile", href: "/admin/settings/profile" },
  { label: "Security", href: "/admin/settings/security" },
  { label: "Notification", href: "/admin/notifications" },
  { label: "Connected App", href: "/admin/settings/connected-app" },
];

const navItems: SettingsNavItem[] = [
  {
    label: "General Settings",
    icon: <Settings className="w-6 h-6" />,
    subItems: generalSubItems,
  },
  {
    label: "System Settings",
    icon: <Monitor className="w-6 h-6" />,
    href: "/admin/settings/system",
  },
  {
    label: "App Settings",
    icon: <Smartphone className="w-6 h-6" />,
    href: "/admin/settings/app",
  },
  {
    label: "Website Settings",
    icon: <Globe className="w-6 h-6" />,
    href: "/admin/settings/website",
  },
  {
    label: "Other Settings",
    icon: <SlidersHorizontal className="w-6 h-6" />,
    href: "/admin/settings/other",
  },
];

/* ------------------------------------------------------------------
   COMPONENT
   ------------------------------------------------------------------ */
export default function SettingsSidebar() {
  const pathname = usePathname();
  const { logout } = useAuth();
  const [expandedSections, setExpandedSections] = useState<string[]>([
    "General Settings",
  ]);
  const [mobileOpen, setMobileOpen] = useState(false);

  const isGeneralSubpath = generalSubItems.some((s) =>
    pathname.startsWith(s.href),
  );

  const toggleSection = (label: string) => {
    setExpandedSections((prev) =>
      prev.includes(label) ? prev.filter((l) => l !== label) : [...prev, label],
    );
  };

  return (
    <div className="bg-white border border-border rounded-2xl p-3 sm:p-4 flex flex-col gap-3 sm:gap-4 w-full lg:max-w-[320px] lg:self-stretch">
      {/* Mobile toggle */}
      <button
        type="button"
        onClick={() => setMobileOpen(!mobileOpen)}
        className="flex items-center justify-between lg:hidden w-full"
      >
        <h2 className="text-[15px] font-medium text-neutral-darker">
          Settings Menu
        </h2>
        {mobileOpen ? (
          <ChevronUp className="w-5 h-5 text-neutral" />
        ) : (
          <ChevronDown className="w-5 h-5 text-neutral" />
        )}
      </button>
      {/* Header — desktop only */}
      <div className="hidden lg:block border-b border-border pb-3">
        <h2 className="text-t-18 font-medium text-neutral-darker">Settings</h2>
      </div>

      {/* Navigation — always visible on lg+, toggled on mobile */}
      <nav
        className={cn(
          "flex-col gap-1 flex-1",
          mobileOpen ? "flex" : "hidden lg:flex",
        )}
      >
        {navItems.map((item) => {
          const isExpanded = expandedSections.includes(item.label);
          const hasSubItems = !!item.subItems;

          return (
            <div key={item.label}>
              {/* Section header */}
              <button
                type="button"
                onClick={() =>
                  hasSubItems ? toggleSection(item.label) : undefined
                }
                className={cn(
                  "flex items-center gap-3 w-full p-3 rounded-xl text-t-16 font-medium transition-colors",
                  hasSubItems && isGeneralSubpath
                    ? "text-neutral"
                    : "text-neutral hover:bg-neutral-light",
                )}
              >
                <span className="text-neutral">{item.icon}</span>
                <span className="flex-1 text-left">{item.label}</span>
                {hasSubItems ? (
                  isExpanded ? (
                    <ChevronUp className="w-4 h-4 text-neutral" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-neutral" />
                  )
                ) : (
                  <ChevronDown className="w-3 h-3 text-neutral rotate-[-90deg]" />
                )}
              </button>

              {/* Sub-items (expandable) */}
              {hasSubItems && isExpanded && (
                <div className="flex flex-col px-3">
                  {item.subItems!.map((sub) => {
                    const isActive = pathname === sub.href;
                    return (
                      <Link
                        key={sub.href}
                        href={sub.href}
                        className={cn(
                          "flex items-center gap-3 px-3 py-3 rounded-xl text-t-14 font-medium transition-colors",
                          isActive
                            ? "bg-secondary-light text-primary"
                            : "text-neutral hover:bg-neutral-light",
                        )}
                      >
                        <span className="flex-1">{sub.label}</span>
                        <Circle
                          className={cn(
                            "w-4 h-4",
                            isActive
                              ? "text-primary fill-primary"
                              : "text-neutral-normal",
                          )}
                        />
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* Logout */}
      <button
        type="button"
        onClick={async () => {
          await logout();
        }}
        className={cn(
          "items-center gap-2 px-3 py-2 rounded-xl bg-neutral-light border border-border text-t-12 font-medium text-neutral hover:bg-neutral-light-active transition-colors",
          mobileOpen ? "flex" : "hidden lg:flex",
        )}
      >
        <LogOut className="w-5 h-5" />
        Logout
      </button>
    </div>
  );
}
