"use client";

import { CheckCheck, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Notification, TabFilter, TabItem } from "./notifications-data";
import NotificationsList from "./notifications-list";

/* ------------------------------------------------------------------
   RIGHT PANEL
   ------------------------------------------------------------------ */
interface RightPanelProps {
  categoryLabel: string;
  activeTab: TabFilter;
  tabs: TabItem[];
  notifications: Notification[];
  onTabChange: (tab: TabFilter) => void;
  onMarkAllRead: () => void;
  onDeleteAll: () => void;
  onToggleFavorite: (id: string) => void;
  onToggleArchived: (id: string) => void;
  onDelete: (id: string) => void;
}

export default function RightPanel({
  categoryLabel,
  activeTab,
  tabs,
  notifications,
  onTabChange,
  onMarkAllRead,
  onDeleteAll,
  onToggleFavorite,
  onToggleArchived,
  onDelete,
}: RightPanelProps) {
  return (
    <div className="flex-1 min-w-0 bg-white border border-border rounded-2xl p-4 flex flex-col gap-4">
      {/* List header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-border pb-3">
        <h2 className="text-t-17 font-medium text-neutral-darker">
          {categoryLabel}
        </h2>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onMarkAllRead}
            className="flex items-center gap-3 px-3 py-2 bg-primary text-primary-light text-t-14 font-semibold rounded hover:bg-primary-dark transition-colors"
          >
            <CheckCheck className="w-6 h-6" />
            Mark all as read
          </button>
          <button
            type="button"
            onClick={onDeleteAll}
            className="flex items-center gap-2 px-3 py-2 bg-error-light text-error-dark text-t-14 font-semibold rounded hover:bg-error-light-active transition-colors"
          >
            <Trash2 className="w-6 h-6" />
            Delete all
          </button>
        </div>
      </div>

      {/* Tabs — segmented pill control */}
      <div className="flex bg-neutral-light-hover p-0.5 rounded-2xl">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => onTabChange(tab.key)}
            className={cn(
              "flex flex-1 min-w-0 items-center justify-center gap-1.5 h-10 px-2 sm:px-3 rounded-2xl text-t-12 whitespace-nowrap transition-colors",
              activeTab === tab.key
                ? "bg-white font-medium text-neutral-darker shadow-sm"
                : "font-normal text-neutral-darker hover:bg-white/50",
            )}
          >
            {tab.label}
            <span
              className={cn(
                "size-7 flex items-center justify-center rounded-lg text-t-12 font-semibold",
                activeTab === tab.key
                  ? "bg-neutral-light text-neutral-darker"
                  : "bg-neutral-light-active text-neutral-darker",
              )}
            >
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Notification items — flex-1 so empty state fills remaining space */}
      <NotificationsList
        notifications={notifications}
        onToggleFavorite={onToggleFavorite}
        onToggleArchived={onToggleArchived}
        onDelete={onDelete}
      />
    </div>
  );
}
