"use client";

import Link from "next/link";
import { Users, Store, Truck, Settings, Circle } from "lucide-react";
import { cn } from "@/lib/utils";
import { notifyUnbuilt } from "@/lib/showcase/notify";
import type {
  NotificationCategory,
  NotificationCategoryId,
} from "./notifications-data";

/* ------------------------------------------------------------------
   CATEGORY DEFINITIONS (icons live here because they're JSX)
   ------------------------------------------------------------------ */
const categories: NotificationCategory[] = [
  {
    id: "patient",
    label: "Patient notification",
    icon: <Users className="w-6 h-6" />,
    count: 13,
  },
  {
    id: "vendor",
    label: "Vendors / Pharmacies",
    icon: <Store className="w-6 h-6" />,
    count: 5,
  },
  {
    id: "delivery",
    label: "Deliveries / Companies",
    icon: <Truck className="w-6 h-6" />,
    count: 2,
  },
];

/* ------------------------------------------------------------------
   LEFT PANEL
   Supports two modes:
   1. Notifications page  — activeCategory + onCategoryChange
   2. Settings page       — isSettingsActive = true (categories link back)
   ------------------------------------------------------------------ */
interface LeftPanelProps {
  /** Currently selected category (notifications mode) */
  activeCategory?: NotificationCategoryId;
  totalCount?: number;
  onCategoryChange?: (id: NotificationCategoryId) => void;
  /** When true, "Notification Settings" link gets active style */
  isSettingsActive?: boolean;
}

export { categories };

export default function LeftPanel({
  activeCategory,
  totalCount = 20,
  onCategoryChange,
  isSettingsActive = false,
}: LeftPanelProps) {
  return (
    <div className="bg-white border border-border rounded-2xl p-4 w-full lg:max-w-[320px] shrink-0 flex flex-col h-full gap-4">
      {/* Category header */}
      <div className="flex items-center justify-between border-b border-border pb-3">
        <h2 className="text-t-17 font-medium text-neutral-darker">
          Notification
        </h2>
        <span className="text-t-14 font-semibold text-primary whitespace-nowrap">
          {totalCount} · notification
        </span>
      </div>

      {/* Category list */}
      <nav className="flex flex-col gap-1 flex-1">
        {categories.map((cat) => {
          const isActive = !isSettingsActive && cat.id === activeCategory;

          /* Settings page → categories link back to notifications */
          if (isSettingsActive) {
            return (
              <Link
                key={cat.id}
                href="/admin/notifications"
                className="flex items-center gap-3 px-3 py-3 rounded-xl text-t-17 font-medium transition-colors w-full text-neutral hover:bg-neutral-light"
              >
                <span className="text-neutral">{cat.icon}</span>
                <span className="flex-1 text-left">{cat.label}</span>
                <span className="text-t-17 font-medium text-primary">
                  {cat.count}
                </span>
              </Link>
            );
          }

          /* Notifications page → interactive buttons */
          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => onCategoryChange?.(cat.id)}
              className={cn(
                "flex items-center gap-3 px-3 py-3 rounded-xl text-t-17 font-medium transition-colors w-full min-w-0",
                isActive
                  ? "bg-secondary-light text-primary"
                  : "text-neutral hover:bg-neutral-light",
              )}
            >
              <span className={cn(isActive ? "text-primary" : "text-neutral")}>
                {cat.icon}
              </span>
              <span className="flex-1 min-w-0 text-left truncate">{cat.label}</span>
              {isActive ? (
                <Circle className="w-5 h-5 fill-primary text-primary" />
              ) : (
                <span className="text-t-17 font-medium text-primary">
                  {cat.count}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* ── Notification Settings — pinned to bottom ── */}
      <div className="mt-auto">
        <button
          type="button"
          onClick={() => notifyUnbuilt("Notification Settings")}
          className={cn(
            "flex items-center gap-2 px-3 py-4 rounded-lg text-t-17 font-medium transition-colors w-full",
            isSettingsActive
              ? "bg-secondary-light text-primary"
              : "bg-neutral-light border border-border text-neutral-darker hover:bg-neutral-light-active",
          )}
        >
          <Settings
            className={cn(
              "w-5 h-5",
              isSettingsActive ? "text-primary" : "text-neutral",
            )}
          />
          <span>Notification Settings</span>
        </button>
      </div>
    </div>
  );
}
