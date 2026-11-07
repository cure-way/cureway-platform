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
import { PageContainer, PageHeader } from "@/components/shared";

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
    <PageContainer
      variant="dashboard"
      as={MotionStagger}
      className="flex flex-col bg-neutral-light-hover gap-4"
    >
      <MotionStaggerItem>
        <PageHeader
          title="All Notifications"
          subtitle="Stay updated with your notifications and activities"
          actions={
            <div className="flex items-center gap-2 px-3 py-1.5 bg-white border border-border rounded-lg">
              <Calendar className="w-4 h-4 text-neutral" />
              <span className="text-t-12-semibold text-neutral-dark">
                Today · Jan, 01
              </span>
            </div>
          }
        />
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
    </PageContainer>
  );
}
