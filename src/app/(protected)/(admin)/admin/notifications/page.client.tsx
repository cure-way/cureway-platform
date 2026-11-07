"use client";

import { useState } from "react";
import { Calendar } from "lucide-react";
import {
  mockNotifications,
  type NotificationCategoryId,
  type TabFilter,
  type TabItem,
} from "@/components/admin/notifications/notifications-data";
import LeftPanel, {
  categories,
} from "@/components/admin/notifications/left-panel";
import RightPanel from "@/components/admin/notifications/right-panel";
import NotificationsLayout from "@/components/admin/notifications/notifications-layout";
import { MotionStagger, MotionStaggerItem } from "@/components/admin/shared";

/* ------------------------------------------------------------------
   PAGE
   ------------------------------------------------------------------ */
export default function AdminNotificationsPage() {
  const [activeCategory, setActiveCategory] =
    useState<NotificationCategoryId>("patient");
  const [activeTab, setActiveTab] = useState<TabFilter>("all");
  const [notifications, setNotifications] = useState(mockNotifications);

  /* ── Derived data ── */
  const categoryNotifications = notifications.filter(
    (n) => n.category === activeCategory,
  );

  const filteredNotifications = categoryNotifications.filter((n) => {
    if (activeTab === "achieved") return n.isArchived;
    if (activeTab === "favorite") return n.isFavorite;
    return true;
  });

  const totalCount = notifications.length;
  const allCount = categoryNotifications.length;
  const achievedCount = categoryNotifications.filter(
    (n) => n.isArchived,
  ).length;
  const favoriteCount = categoryNotifications.filter(
    (n) => n.isFavorite,
  ).length;

  const activeCategoryLabel =
    categories.find((c) => c.id === activeCategory)?.label ?? "";

  /* ── Handlers ── */
  const handleCategoryChange = (id: NotificationCategoryId) => {
    setActiveCategory(id);
    setActiveTab("all");
  };

  const toggleFavorite = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isFavorite: !n.isFavorite } : n)),
    );
  };

  const toggleArchived = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isArchived: !n.isArchived } : n)),
    );
  };

  const deleteNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const markAllAsRead = () => {
    setNotifications((prev) =>
      prev.map((n) =>
        n.category === activeCategory ? { ...n, isRead: true } : n,
      ),
    );
  };

  const deleteAll = () => {
    setNotifications((prev) =>
      prev.filter((n) => n.category !== activeCategory),
    );
  };

  /* ── Tab config ── */
  const tabs: TabItem[] = [
    { key: "all", label: "All", count: allCount },
    { key: "achieved", label: "Achieved", count: achievedCount },
    { key: "favorite", label: "Favorite", count: favoriteCount },
  ];

  return (
    <MotionStagger className="flex-1 flex flex-col bg-neutral-light-hover px-3 sm:pl-4 sm:pr-6 py-3 sm:py-4 gap-3 sm:gap-4">
      {/* Page Header */}
      <MotionStaggerItem>
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 sm:gap-3">
          <div className="space-y-0.5 sm:space-y-1">
            <h1 className="text-t-17 sm:text-t-25 font-bold text-primary-darker leading-snug">
              All Notifications
            </h1>
            <p className="text-t-14 sm:text-t-17 font-normal text-neutral">
              Stay updated with your all notifications and activities
            </p>
          </div>
          <div className="flex items-center gap-2 sm:gap-4 px-3 sm:px-4 py-1 bg-white border border-border rounded-xl shrink-0 self-start">
            <Calendar className="w-4 h-4 sm:w-[18px] sm:h-[18px] text-neutral" />
            <span className="text-[12px] sm:text-t-14 font-medium text-neutral-darker">
              Today · Jan, 01
            </span>
          </div>
        </div>
      </MotionStaggerItem>

      {/* Two-column layout */}
      <MotionStaggerItem>
        <NotificationsLayout
          leftPanel={
            <LeftPanel
              activeCategory={activeCategory}
              totalCount={totalCount}
              onCategoryChange={handleCategoryChange}
            />
          }
          rightPanel={
            <RightPanel
              categoryLabel={activeCategoryLabel}
              activeTab={activeTab}
              tabs={tabs}
              notifications={filteredNotifications}
              onTabChange={setActiveTab}
              onMarkAllRead={markAllAsRead}
              onDeleteAll={deleteAll}
              onToggleFavorite={toggleFavorite}
              onToggleArchived={toggleArchived}
              onDelete={deleteNotification}
            />
          }
        />
      </MotionStaggerItem>
    </MotionStagger>
  );
}
