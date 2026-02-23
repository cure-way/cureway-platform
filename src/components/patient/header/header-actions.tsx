"use client";

import { FaChevronDown, FaPhoneAlt } from "react-icons/fa";
import { FiMapPin } from "react-icons/fi";
import { HiMenu, HiX } from "react-icons/hi";
import { IoSearchOutline, IoNotificationsOutline } from "react-icons/io5";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { CONTACT_PHONE } from "@/lib/constants";
import { UserMenu } from "./UserMenu";
import { useAuth } from "@/features/auth";

interface HeaderActionsProps {
  isAuthenticated: boolean;
  notificationCount?: number;
  cartCount?: number;
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
  onMobileSearchOpen: () => void;
}

export function HeaderActions({
  isAuthenticated,
  notificationCount = 0,
  cartCount = 0,
  mobileMenuOpen,
  setMobileMenuOpen,
  onMobileSearchOpen,
}: HeaderActionsProps) {
  return (
    <div className="flex items-center gap-2 md:gap-4 shrink-0">
      {/* Mobile Search Icon */}
      <button
        onClick={onMobileSearchOpen}
        className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
        aria-label="Open search"
      >
        <IoSearchOutline className="w-5 h-5 text-black/60" />
      </button>

      {/* Mobile menu button */}
      <motion.button
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        whileTap={{ scale: 0.95 }}
        className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
        aria-label="Toggle menu"
      >
        <AnimatePresence mode="wait">
          {mobileMenuOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <HiX className="w-6 h-6 text-black/60" />
            </motion.div>
          ) : (
            <motion.div
              key="menu"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <HiMenu className="w-6 h-6 text-black/60" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Location selector - Desktop only */}
      <div className="hidden md:flex bg-secondary-light items-center gap-2 h-11 px-2 rounded-lg w-40 lg:w-45">
        <FiMapPin className="w-4 h-4 text-black/60 shrink-0" />
        <div className="flex-1 flex flex-col gap-1 justify-center">
          <p className="text-xs font-semibold text-black/50">Select Location</p>
          <div className="flex items-center gap-1">
            <p className="flex-1 text-xs text-black/80 truncate">
              26 Salah El Din St...
            </p>
            <FaChevronDown className="w-2 h-2 text-black/60 rotate-90 shrink-0" />
          </div>
        </div>
      </div>

      {/* Notifications - Authenticated users only */}
      {isAuthenticated && (
        <Link
          href="/notifications"
          className="hidden md:flex relative p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <IoNotificationsOutline className="w-6 h-6 text-black/60" />
          {notificationCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
              {notificationCount > 9 ? "9+" : notificationCount}
            </span>
          )}
        </Link>
      )}

      {/* User avatar + dropdown / Sign in — auth-aware via context */}
      <div className="hidden md:flex items-center">
        <UserMenu cartCount={cartCount} />
      </div>
    </div>
  );
}

interface MobileMenuProps {
  isOpen: boolean;
  isAuthenticated: boolean;
}

export function MobileMenu({ isOpen }: MobileMenuProps) {
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
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="md:hidden bg-white border-b border-black/10 overflow-hidden"
        >
          <div className="px-3 py-4 space-y-4">
            {/* Mobile location */}
            <div className="bg-secondary-light flex items-center gap-2 h-11 px-2 rounded-lg">
              <FiMapPin className="w-4 h-4 text-black/60 shrink-0" />
              <div className="flex-1 flex flex-col gap-1 justify-center">
                <p className="text-xs font-semibold text-black/50">
                  Select Location
                </p>
                <div className="flex items-center gap-1">
                  <p className="flex-1 text-xs text-black/80 truncate">
                    26 Salah El Din St...
                  </p>
                  <FaChevronDown className="w-2 h-2 text-black/60 rotate-90 shrink-0" />
                </div>
              </div>
            </div>

            {/* Mobile help */}
            <div className="flex items-center gap-2 px-2">
              <FaPhoneAlt className="text-black/60 w-4 h-4" />
              <p className="text-sm text-black/60">
                <span className="font-semibold">Need help? call us:</span>{" "}
                <span className="text-black/40">{CONTACT_PHONE}</span>
              </p>
            </div>

            {/* Mobile nav links */}
            <nav className="space-y-2">
              <Link
                href="/"
                className="block px-2 py-2 text-sm font-medium text-black/80 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Home
              </Link>
              <Link
                href="/categories"
                className="block px-2 py-2 text-sm font-medium text-black/80 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Categories
              </Link>
              <Link
                href="/pharmacies"
                className="block px-2 py-2 text-sm font-medium text-black/80 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Nearby Pharmacies
              </Link>
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
                  <Link
                    href="/orders"
                    className="block px-2 py-2 text-sm font-medium text-black/80 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    Orders
                  </Link>
                  <Link
                    href="/prescriptions"
                    className="block px-2 py-2 text-sm font-medium text-black/80 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    Prescriptions
                  </Link>
                  <Link
                    href="/profile"
                    className="block px-2 py-2 text-sm font-medium text-black/80 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    Profile
                  </Link>
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
                    className="block px-2 py-2 text-sm font-medium text-center text-black/80 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/auth/sign-up"
                    className="block px-2 py-2 text-sm font-medium text-center text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
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
