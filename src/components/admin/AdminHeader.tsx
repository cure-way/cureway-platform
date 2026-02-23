"use client";

import { useState } from "react";
import { Menu, User, FileText, Settings, LogOut } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useSidebar } from "@/contexts/SidebarContext";
import { useClickOutside } from "@/hooks";
import { useAuth } from "@/features/auth";
import { transition } from "@/components/admin/shared/motion";
import {
  HeaderSearchIcon,
  HeaderVoiceIcon,
  HeaderAddIcon,
  HeaderNotificationIcon,
  HeaderTranslateIcon,
  HeaderMailIcon,
} from "@/components/admin/shared/icons";

export default function AdminHeader() {
  const { open } = useSidebar();
  const { user, logout } = useAuth();
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useClickOutside<HTMLDivElement>(() =>
    setProfileOpen(false),
  );

  const displayName = user?.name ?? "Admin";
  const initials = displayName
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  const email = user?.email ?? "";
  const roleLabel =
    user?.role === "PHARMACY"
      ? "Pharmacy"
      : user?.role === "ADMIN"
        ? "Admin"
        : (user?.role ?? "Admin");

  return (
    <header className="sticky top-0 z-20 flex items-center gap-6 px-6 py-4 bg-white border-b border-[#EFEDED]">
      {/* Hamburger — mobile/tablet only */}
      <button
        onClick={open}
        className="w-12 h-12 flex items-center justify-center rounded-full hover:bg-neutral-light transition-colors text-neutral-dark lg:hidden"
        aria-label="Open sidebar"
      >
        <Menu className="w-6 h-6" />
      </button>

      {/* Search Bar */}
      <div className="hidden sm:flex items-center flex-1 h-12 rounded-3xl bg-[#EFF3FB] pl-4 pr-2 gap-2.5">
        <div className="shrink-0 w-6 h-6">
          <HeaderSearchIcon />
        </div>
        <input
          type="text"
          placeholder="Search medicine, pharmacy.."
          className="flex-1 bg-transparent text-[16px] font-medium leading-[1.2] text-foreground placeholder:text-[#989593] outline-none min-w-0"
          aria-label="Search"
        />
        <button
          className="shrink-0 w-10 h-10 flex items-center justify-center rounded-full hover:bg-[#DFE5F5] transition-colors"
          aria-label="Voice search"
        >
          <HeaderVoiceIcon />
        </button>
      </div>

      {/* Spacer on mobile when search is hidden */}
      <div className="flex-1 sm:hidden" />

      {/* Add New Button */}
      <button
        aria-label="Add new"
        className="flex items-center gap-2 px-4 py-3 rounded-lg bg-[#263B81] text-[#EBEDF7] text-base font-semibold leading-[1.2] hover:bg-[#1E2F68] transition-colors whitespace-nowrap shrink-0"
      >
        <div className="w-6 h-6 shrink-0">
          <HeaderAddIcon />
        </div>
        <span className="hidden md:inline">Add new</span>
      </button>

      {/* Action Icons */}
      <div className="flex items-center gap-3">
        <a
          href="/admin/notifications"
          className="relative w-12 h-12 flex items-center justify-center rounded-full border border-[#C0C8E5] bg-white p-0.75 hover:bg-neutral-light transition-colors"
          aria-label="Notifications — 3 unread"
        >
          <HeaderNotificationIcon />
          <span className="absolute -top-1.25 left-7.5 w-5 h-5 rounded-2xl bg-[#121B3C] text-[#EBEDF7] text-[12px] font-medium leading-[1.2] flex items-center justify-center px-3 py-1">
            3
          </span>
        </a>

        <button
          className="w-12 h-12 flex items-center justify-center rounded-full border border-[#C0C8E5] bg-white p-0.75 hover:bg-neutral-light transition-colors"
          aria-label="Change language"
        >
          <HeaderTranslateIcon />
        </button>

        <button
          className="hidden sm:flex w-12 h-12 items-center justify-center rounded-full border border-[#C0C8E5] bg-white p-0.75 hover:bg-neutral-light transition-colors"
          aria-label="Messages"
        >
          <HeaderMailIcon />
        </button>
      </div>

      {/* Avatar + Dropdown */}
      <div className="relative" ref={profileRef}>
        <button
          onClick={() => setProfileOpen((v) => !v)}
          className="w-12 h-12 rounded-full overflow-hidden hover:ring-2 hover:ring-primary/20 transition-all shrink-0 bg-primary-light flex items-center justify-center text-primary font-semibold text-t-14"
          aria-label="User profile"
          aria-expanded={profileOpen}
        >
          {user?.profileImageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={user.profileImageUrl}
              alt={`${displayName} avatar`}
              className="w-full h-full object-cover rounded-full"
            />
          ) : (
            initials
          )}
        </button>

        {/* Profile Dropdown */}
        <AnimatePresence>
          {profileOpen && (
            <motion.div
              key="profile-dropdown"
              initial={{ opacity: 0, y: -4, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -4, scale: 0.97 }}
              transition={transition.micro}
              className="absolute right-0 top-[calc(100%+8px)] w-56 bg-white rounded-2xl border border-border shadow-lg py-2 z-50 origin-top-right"
            >
              {/* User Info */}
              <div className="flex items-center gap-3 px-4 py-3">
                <div className="w-10 h-10 rounded-full bg-primary-light flex items-center justify-center text-primary font-semibold text-t-12 shrink-0">
                  {initials}
                </div>
                <div className="min-w-0">
                  <p className="text-t-14 font-semibold text-foreground truncate">
                    {displayName}
                  </p>
                  <p className="text-t-12 text-neutral-dark truncate">
                    {email || roleLabel}
                  </p>
                </div>
              </div>

              <div className="h-px bg-border mx-3 my-1" />

              {/* Menu Items */}
              <button className="flex items-center gap-3 w-full px-4 py-2.5 text-t-14 text-neutral-darker hover:bg-neutral-light transition-colors">
                <User className="w-5 h-5 text-neutral-dark" />
                My profile
              </button>
              <button className="flex items-center gap-3 w-full px-4 py-2.5 text-t-14 text-neutral-darker hover:bg-neutral-light transition-colors">
                <FileText className="w-5 h-5 text-neutral-dark" />
                Reports
              </button>
              <button className="flex items-center gap-3 w-full px-4 py-2.5 text-t-14 text-neutral-darker hover:bg-neutral-light transition-colors">
                <Settings className="w-5 h-5 text-neutral-dark" />
                Settings
              </button>

              <div className="h-px bg-border mx-3 my-1" />

              <button
                onClick={async () => {
                  setProfileOpen(false);
                  await logout();
                }}
                className="flex items-center gap-3 w-full px-4 py-2.5 text-t-14 text-error hover:bg-error-light transition-colors"
              >
                <LogOut className="w-5 h-5" />
                Logout
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}
