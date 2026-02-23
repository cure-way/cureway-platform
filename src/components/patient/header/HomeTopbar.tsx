"use client";

import { FaChevronRight, FaPhoneAlt, FaSearch } from "react-icons/fa";
import { FiMapPin } from "react-icons/fi";
import { HiMenu } from "react-icons/hi";
import { IoSearchOutline, IoCloseCircle } from "react-icons/io5";
import { MdKeyboardVoice } from "react-icons/md";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { useSearchContext } from "@/contexts/SearchContext";
import { useClickOutside } from "@/hooks/useClickOutside";
import { SearchDropdown } from "@/components/patient/header/search/SearchDropdown";
import { BRAND_NAME, CONTACT_PHONE } from "@/lib/constants";
import { UserMenu } from "./UserMenu";
import { useAuth } from "@/features/auth";

/* ------------------------------------------------------------------
   HomeTopbar
   Main header row: Logo · Search bar · Location · Cart · Avatar
   Height 100 px on desktop (h-25), auto on mobile.
   ------------------------------------------------------------------ */

interface HomeTopbarProps {
  isAuthenticated: boolean;
  cartCount?: number;
  mobileMenuOpen: boolean;
  onToggleMobileMenu: () => void;
  onMobileSearchOpen: () => void;
}

export function HomeTopbar({
  isAuthenticated,
  cartCount = 0,
  mobileMenuOpen,
  onToggleMobileMenu,
  onMobileSearchOpen,
}: HomeTopbarProps) {
  return (
    <div className="bg-white border-b border-black/10 flex items-center justify-center gap-3 md:gap-6 w-full px-3 md:px-6 lg:px-8 py-2 h-auto md:h-16">
      {/* Logo */}
      <Link
        href="/"
        className="flex items-center gap-2 shrink-0"
        aria-label="Go to home page"
      >
        <div className="w-7 h-7 md:w-8 md:h-8 relative flex items-center justify-center">
          <Image
            src="/logo.png"
            alt={`${BRAND_NAME} Logo`}
            width={32}
            height={32}
            className="object-contain"
            priority
          />
        </div>
        <p className="text-base md:text-t-21 font-black text-primary-hover leading-none">
          {BRAND_NAME}
        </p>
      </Link>

      {/* Desktop Search */}
      <div className="hidden md:flex flex-1 min-w-0 max-w-full">
        <HomeSearchBar />
      </div>

      {/* Right side actions */}
      <HomeActions
        isAuthenticated={isAuthenticated}
        cartCount={cartCount}
        mobileMenuOpen={mobileMenuOpen}
        onToggleMobileMenu={onToggleMobileMenu}
        onMobileSearchOpen={onMobileSearchOpen}
      />
    </div>
  );
}

/* ------------------------------------------------------------------
   HomeSearchBar
   Rounded search input with search icon + voice mic button.
   Re-uses the existing SearchContext / SearchDropdown system.
   ------------------------------------------------------------------ */

export function HomeSearchBar() {
  const {
    query,
    setQuery,
    clearQuery,
    open,
    setOpen,
    activeIndex,
    inputRef,
    handleInputKeyDown,
  } = useSearchContext();
  const router = useRouter();
  const containerRef = useClickOutside<HTMLDivElement>(() => setOpen(false));

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && query.trim().length > 0) {
      e.preventDefault();
      setOpen(false);
      inputRef.current?.blur();
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
      return;
    }
    handleInputKeyDown(e);
  };

  return (
    <div ref={containerRef} className="relative z-50 w-full">
      <div className="relative z-50 flex items-center gap-2 bg-secondary-light pl-3 pr-2 py-2 rounded-xl h-10 focus-within:ring-2 focus-within:ring-primary/40 transition-shadow">
        <FaSearch className="text-neutral-darker w-4 h-4 shrink-0" />
        <input
          ref={inputRef}
          type="text"
          role="combobox"
          aria-expanded={open}
          aria-controls="search-dropdown"
          aria-autocomplete="list"
          aria-activedescendant={
            activeIndex >= 0 ? `search-item-${activeIndex}` : undefined
          }
          placeholder="Search medicine, pharmacy.."
          className="bg-transparent outline-none w-full text-t-14 text-neutral-darker placeholder:text-neutral-dark focus-visible:outline-none"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => setOpen(true)}
          aria-label="Search medicine or pharmacy"
        />

        {/* Clear (X) button — visible when typing */}
        {query.length > 0 && (
          <button
            className="shrink-0 p-1 hover:bg-primary-light rounded-lg transition-colors"
            onClick={clearQuery}
            aria-label="Clear search"
            type="button"
          >
            <IoCloseCircle className="w-4 h-4 text-neutral-dark" />
          </button>
        )}

        <button
          className="shrink-0 p-1 hover:bg-primary-light rounded-lg transition-colors"
          aria-label="Voice search"
          type="button"
        >
          <MdKeyboardVoice className="w-5 h-5 text-primary" />
        </button>
      </div>
      <SearchDropdown />
    </div>
  );
}

/* ------------------------------------------------------------------
   HomeActions
   Right side: mobile menu / search toggle · location · cart · avatar
   ------------------------------------------------------------------ */

interface HomeActionsProps {
  isAuthenticated: boolean;
  cartCount?: number;
  mobileMenuOpen: boolean;
  onToggleMobileMenu: () => void;
  onMobileSearchOpen: () => void;
}

function HomeActions({
  isAuthenticated,
  cartCount = 0,
  mobileMenuOpen,
  onToggleMobileMenu,
  onMobileSearchOpen,
}: HomeActionsProps) {
  return (
    <div className="flex items-center gap-2 md:gap-4 shrink-0">
      {/* Mobile Search (visible < md) */}
      <button
        onClick={onMobileSearchOpen}
        className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
        aria-label="Open search"
      >
        <IoSearchOutline className="w-5 h-5 text-black/60" />
      </button>

      {/* Mobile hamburger (visible < md) */}
      <button
        onClick={onToggleMobileMenu}
        className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
        aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
      >
        <HiMenu className="w-6 h-6 text-black/60" />
      </button>

      {/* Location selector – desktop */}
      <div className="hidden md:flex bg-secondary-light items-center gap-2 h-10 px-2.5 rounded-lg w-auto max-w-48">
        <FiMapPin className="w-5 h-5 text-primary shrink-0" />
        <div className="flex-1 flex flex-col gap-0.5 justify-center h-full">
          <p className="text-t-12 font-semibold text-primary-darker leading-tight">
            Select Location
          </p>
          <div className="flex items-center gap-1">
            <p className="flex-1 text-t-12 text-primary truncate leading-tight">
              26 Salah El Din St...
            </p>
            <FaChevronRight className="w-2 h-2 text-primary shrink-0" />
          </div>
        </div>
      </div>

      {/* Cart + Avatar / Sign-in – desktop (auth-aware via context) */}
      <div className="hidden md:flex items-center">
        <UserMenu cartCount={cartCount} />
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------
   Mobile helpers
   ------------------------------------------------------------------ */

/* ------------------------------------------------------------------
   HomeMobileMenu — full mobile nav (exported for HomeHeader)
   ------------------------------------------------------------------ */

interface HomeMobileMenuProps {
  isOpen: boolean;
  isAuthenticated: boolean;
}

export function HomeMobileMenu({ isOpen }: HomeMobileMenuProps) {
  const prefersReducedMotion = useReducedMotion();
  const { isAuthed, user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push("/");
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={prefersReducedMotion ? undefined : { height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={prefersReducedMotion ? undefined : { height: 0, opacity: 0 }}
          transition={
            prefersReducedMotion
              ? { duration: 0 }
              : { duration: 0.3, ease: "easeInOut" }
          }
          className="md:hidden bg-white border-b border-black/10 overflow-hidden"
        >
          <div className="px-3 py-4 space-y-4">
            {/* Mobile location */}
            <div className="bg-secondary-light flex items-center gap-3 h-12 px-3 rounded-xl">
              <FiMapPin className="w-5 h-5 text-primary shrink-0" />
              <div className="flex-1 flex flex-col gap-1 justify-center">
                <p className="text-xs font-semibold text-primary-darker">
                  Select Location
                </p>
                <div className="flex items-center gap-1">
                  <p className="flex-1 text-xs text-primary truncate">
                    26 Salah El Din St...
                  </p>
                  <FaChevronRight className="w-2 h-2 text-primary shrink-0" />
                </div>
              </div>
            </div>

            {/* Mobile help */}
            <div className="flex items-center gap-2 px-2">
              <FaPhoneAlt className="text-primary w-4 h-4" />
              <p className="text-sm text-primary-darker">
                <span className="font-semibold">Need help? call us:</span>{" "}
                <span className="text-primary-light-active">
                  {CONTACT_PHONE}
                </span>
              </p>
            </div>

            {/* Mobile nav */}
            <nav className="space-y-2">
              {[
                { href: "/", label: "Home" },
                { href: "/categories", label: "Categories" },
                { href: "/pharmacies", label: "Nearby Pharmacies" },
              ].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="block px-2 py-2 text-sm font-medium text-primary-darker hover:bg-primary-light rounded-lg transition-colors"
                >
                  {link.label}
                </Link>
              ))}

              {isAuthed ? (
                <>
                  {user && (
                    <div className="px-2 py-2 border-t border-gray-200 mt-2">
                      <p className="text-sm font-semibold text-gray-900 truncate">
                        {user.name}
                      </p>
                      <p className="text-xs text-gray-500 truncate">
                        {user.email}
                      </p>
                    </div>
                  )}
                  {[
                    { href: "/orders", label: "Orders" },
                    { href: "/prescriptions", label: "Prescriptions" },
                    { href: "/profile", label: "Profile" },
                  ].map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="block px-2 py-2 text-sm font-medium text-primary-darker hover:bg-primary-light rounded-lg transition-colors"
                    >
                      {link.label}
                    </Link>
                  ))}
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-2 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <div className="pt-2 space-y-2 border-t border-gray-200">
                  <Link
                    href="/auth/sign-in"
                    className="block px-2 py-2 text-sm font-medium text-center text-primary-darker border border-neutral rounded-lg hover:bg-primary-light transition-colors"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/auth/sign-up"
                    className="block px-2 py-2 text-sm font-medium text-center text-white bg-primary rounded-lg hover:bg-primary-hover transition-colors"
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </nav>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
