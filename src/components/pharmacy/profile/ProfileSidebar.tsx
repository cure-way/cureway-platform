"use client";

import { ProfileTab } from "@/types/PharmacyProfile";
import { FiUser, FiLock, FiBell, FiSettings } from "react-icons/fi";

interface Props {
  activeTab: string;
  setActiveTab: (tab: ProfileTab) => void;
  notificationsEnabled: boolean;
  setNotificationsEnabled: (v: boolean) => void;
  onDelete: () => void;
}

export default function ProfileSidebar({
  activeTab,
  setActiveTab,
  notificationsEnabled,
  setNotificationsEnabled,
  onDelete,
}: Props) {
  const baseItem =
    "flex items-center gap-3 py-4 px-2 rounded-lg text-[15px] transition-colors";

  return (
    <aside className="bg-white p-6 rounded-2xl w-72 h-fit">
      <nav className="flex flex-col">
        {/* Profile */}
        <button
          onClick={() => setActiveTab("profile")}
          className={`${baseItem} ${
            activeTab === "profile"
              ? "bg-[#F1F5F9] text-(--color-primary) font-medium"
              : "text-[#374151] hover:bg-[#F8FAFC]"
          }`}
        >
          <FiUser size={20} className="text-[#475569]" />
          Profile
        </button>

        <div className="border-[#E5E7EB] border-t" />

        {/* Change Password */}
        <button
          onClick={() => setActiveTab("password")}
          className={`${baseItem} ${
            activeTab === "password"
              ? "bg-[#F1F5F9] text-(--color-primary) font-medium"
              : "text-[#374151] hover:bg-[#F8FAFC]"
          }`}
        >
          <FiLock size={20} className="text-[#475569]" />
          Change Password
        </button>

        <div className="border-[#E5E7EB] border-t" />

        {/* Notifications */}
        <div className="flex items-center gap-3 px-2 py-4 text-[#374151] text-[15px]">
          <FiBell size={20} className="text-[#475569]" />

          <span className="flex-1">Notification Preferences</span>

          <button
            onClick={() => setNotificationsEnabled(!notificationsEnabled)}
            className={`relative w-10 h-6 rounded-full transition-colors ${
              notificationsEnabled ? "bg-green-500" : "bg-gray-300"
            }`}
          >
            <span
              className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
                notificationsEnabled ? "translate-x-4" : ""
              }`}
            />
          </button>
        </div>

        <div className="border-[#E5E7EB] border-t" />

        {/* Settings */}
        <button
          onClick={() => setActiveTab("settings")}
          className={`${baseItem} ${
            activeTab === "settings"
              ? "bg-[#F1F5F9] text-(--color-primary) font-medium"
              : "text-[#374151] hover:bg-[#F8FAFC]"
          }`}
        >
          <FiSettings size={20} className="text-[#475569]" />
          Settings
        </button>

        {/* Delete */}
        <button
          onClick={onDelete}
          className="mt-6 text-[15px] text-red-500 hover:text-red-600 text-left"
        >
          Delete Account
        </button>
      </nav>
    </aside>
  );
}
