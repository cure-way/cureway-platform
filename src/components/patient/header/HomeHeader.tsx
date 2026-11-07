"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { SearchProvider } from "@/contexts/SearchContext";
import { HiX } from "react-icons/hi";

import { AnnouncementsBar } from "./AnnouncementsBar";
import { HomeTopbar, HomeMobileMenu } from "./HomeTopbar";
import { HomeQuickChips } from "./HomeQuickChips";
import { HomeSearchBar } from "./HomeTopbar";

/**
 * HomeHeader
 * Composing wrapper that renders the three header rows:
 *   1. AnnouncementsBar  (blue strip – hidden on mobile)
 *   2. HomeTopbar        (logo + search + actions)
 *   3. HomeQuickChips    (quick-action cards)
 *
 * Sticky, animated entrance, wrapped in SearchProvider.
 */
interface HomeHeaderProps {
  isAuthenticated?: boolean;
  cartCount?: number;
}

export function HomeHeader({
  isAuthenticated = false,
  cartCount = 0,
}: HomeHeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileSearchActive, setMobileSearchActive] = useState(false);

  const prefersReducedMotion = useReducedMotion();

  return (
    <SearchProvider>
      <motion.header
        initial={prefersReducedMotion ? undefined : { y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={
          prefersReducedMotion
            ? { duration: 0 }
            : { duration: 0.5, ease: "easeOut" }
        }
        className="bg-white w-full sticky top-[var(--showcase-bar-h,0px)] z-40"
        role="banner"
      >
        {/* Row 1 – Blue announcements bar (desktop only) */}
        <AnnouncementsBar />

        {/* Row 2 – Logo · Search · Location · Cart · Avatar */}
        <HomeTopbar
          isAuthenticated={isAuthenticated}
          cartCount={cartCount}
          mobileMenuOpen={mobileMenuOpen}
          onToggleMobileMenu={() => setMobileMenuOpen((o) => !o)}
          onMobileSearchOpen={() => setMobileSearchActive(true)}
        />

        {/* Mobile search overlay */}
        {mobileSearchActive && (
          <div className="flex items-center gap-2 px-3 py-2 bg-white border-b border-black/10 md:hidden">
            <button
              onClick={() => setMobileSearchActive(false)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="Close search"
            >
              <HiX className="w-5 h-5 text-black/60" />
            </button>
            <div className="flex-1">
              <HomeSearchBar />
            </div>
          </div>
        )}

        {/* Mobile slide-out menu */}
        <HomeMobileMenu
          isOpen={mobileMenuOpen}
          isAuthenticated={isAuthenticated}
        />

        {/* Row 3 – Quick chips */}
        <HomeQuickChips />
      </motion.header>
    </SearchProvider>
  );
}
