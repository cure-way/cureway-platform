"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { HiX } from "react-icons/hi";
import { motion } from "framer-motion";
import { SearchProvider } from "@/contexts/SearchContext";

import { AnnouncementsBar } from "./AnnouncementsBar";
import { HeaderSearch } from "./header-search";
import { HeaderActions, MobileMenu } from "./header-actions";
import { HeaderQuickChips } from "./header-quick-chips";
import { BRAND_NAME } from "@/lib/constants";

interface PatientHeaderProps {
  /**
   * Whether the user is authenticated
   * Controls which actions are shown (sign in/up vs avatar/notifications)
   */
  isAuthenticated?: boolean;
  /**
   * Number of unread notifications (authenticated only)
   */
  notificationCount?: number;
  /**
   * Number of items in cart (authenticated only)
   */
  cartCount?: number;
}

export function PatientHeader({
  isAuthenticated = false,
  notificationCount = 0,
  cartCount = 0,
}: PatientHeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileSearchActive, setMobileSearchActive] = useState(false);

  return (
    <SearchProvider>
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="bg-white w-full sticky top-0 z-40"
      >
        {/* Top bar: Help line + Announcements + Currency/Language */}
        <AnnouncementsBar />

        {/* Main header: Logo + Search + Actions */}
        <div className="bg-white border-b border-black/10 flex items-center justify-between gap-2 md:gap-4 lg:gap-6 px-3 md:px-6 py-2 rounded-bl-3xl rounded-br-3xl">
          {/* Mobile Search Mode */}
          {mobileSearchActive ? (
            <div className="flex items-center gap-2 w-full md:hidden">
              <button
                onClick={() => setMobileSearchActive(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                aria-label="Close search"
              >
                <HiX className="w-5 h-5 text-black/60" />
              </button>
              <div className="flex-1">
                <HeaderSearch />
              </div>
            </div>
          ) : (
            <>
              {/* Logo */}
              <Link
                href="/"
                className="flex items-center gap-1.5 md:gap-2 shrink-0"
              >
                <div className="w-8 h-8 md:w-10 md:h-10 relative flex items-center justify-center">
                  <Image
                    src="/logo.png"
                    alt={`${BRAND_NAME} Logo`}
                    width={40}
                    height={40}
                    className="object-contain"
                    priority
                  />
                </div>
                <p className="text-t-14 md:text-t-17 font-bold text-black leading-none">
                  {BRAND_NAME}
                </p>
              </Link>

              {/* Desktop Search */}
              <div className="hidden md:flex flex-1 max-w-xl">
                <HeaderSearch />
              </div>

              {/* Right Side Actions */}
              <HeaderActions
                isAuthenticated={isAuthenticated}
                notificationCount={notificationCount}
                cartCount={cartCount}
                mobileMenuOpen={mobileMenuOpen}
                setMobileMenuOpen={setMobileMenuOpen}
                onMobileSearchOpen={() => setMobileSearchActive(true)}
              />
            </>
          )}
        </div>

        {/* Mobile menu */}
        <MobileMenu isOpen={mobileMenuOpen} isAuthenticated={isAuthenticated} />

        {/* Quick chips row */}
        <HeaderQuickChips isAuthenticated={isAuthenticated} />
      </motion.header>
    </SearchProvider>
  );
}
