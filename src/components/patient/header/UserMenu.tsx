"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  IoPersonOutline,
  IoCartOutline,
  IoReceiptOutline,
  IoLogOutOutline,
  IoDocumentTextOutline,
} from "react-icons/io5";
import { useAuth } from "@/features/auth";
import { useClickOutside } from "@/hooks/useClickOutside";

/**
 * UserMenu — avatar button with a dropdown popup for authenticated users.
 *
 * Shows:
 *  - User avatar (or initials fallback)
 *  - Cart icon with badge
 *  - Dropdown: Profile, Orders, Prescriptions, Sign Out
 *
 * When unauthenticated or loading ⇒ renders Sign In / Sign Up links.
 */

interface UserMenuProps {
  cartCount?: number;
}

export function UserMenu({ cartCount = 0 }: UserMenuProps) {
  const { user, isAuthed, isLoading, logout } = useAuth();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const menuRef = useClickOutside<HTMLDivElement>(() => setOpen(false));

  const handleLogout = async () => {
    setOpen(false);
    await logout();
    router.push("/");
  };

  // ----- Loading skeleton -----
  if (isLoading) {
    return (
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-gray-200 animate-pulse" />
      </div>
    );
  }

  // ----- Guest: Sign In / Sign Up -----
  if (!isAuthed) {
    return (
      <div className="flex items-center gap-2">
        <Link
          href="/auth/sign-in"
          className="px-4 py-2 text-t-14 font-medium text-primary-darker hover:text-primary transition-colors"
        >
          Sign In
        </Link>
        <Link
          href="/auth/sign-up"
          className="px-4 py-2 bg-primary text-white text-t-14 font-medium rounded-lg hover:bg-primary-hover transition-colors"
        >
          Sign Up
        </Link>
      </div>
    );
  }

  // ----- Pharmacy user on patient pages: link to pharmacy dashboard -----
  if (isAuthed && user?.role === "PHARMACY") {
    return (
      <div className="flex items-center">
        <Link
          href="/pharmacy/home"
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-primary-darker bg-primary-light hover:bg-primary-light-active rounded-lg transition-colors"
        >
          Pharmacy Dashboard
        </Link>
      </div>
    );
  }

  // ----- Authenticated (patient) -----
  const initials = (user?.name ?? "U")
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="flex items-center gap-3">
      {/* Cart */}
      <Link
        href="/cart"
        className="relative flex items-center justify-center w-10 h-10 bg-primary-light-active rounded-full hover:bg-primary-light transition-colors"
        aria-label={`Cart${cartCount > 0 ? `, ${cartCount} item${cartCount > 1 ? "s" : ""}` : ""}`}
      >
        <IoCartOutline className="w-5 h-5 text-secondary-darker" />
        {cartCount > 0 && (
          <span className="absolute -top-1.5 -right-1.5 bg-secondary-darker text-secondary-light text-t-10 font-medium w-5 h-5 flex items-center justify-center rounded-full">
            {cartCount > 9 ? "9+" : cartCount}
          </span>
        )}
      </Link>

      {/* Avatar + Dropdown */}
      <div ref={menuRef} className="relative">
        <button
          onClick={() => setOpen((p) => !p)}
          className="w-10 h-10 rounded-full overflow-hidden bg-primary-light flex items-center justify-center cursor-pointer hover:opacity-80 transition-opacity focus:outline-none focus:ring-2 focus:ring-primary/40"
          aria-label="User menu"
          aria-haspopup="true"
          aria-expanded={open}
        >
          {user?.profileImageUrl ? (
            <Image
              src={user.profileImageUrl}
              alt="User avatar"
              width={40}
              height={40}
              className="object-cover rounded-full"
            />
          ) : (
            <span className="text-sm font-semibold text-primary-darker select-none">
              {initials}
            </span>
          )}
        </button>

        {/* Dropdown */}
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, y: 8, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50"
            >
              {/* User info */}
              <div className="px-4 py-3 border-b border-gray-100">
                <p className="text-sm font-semibold text-gray-900 truncate">
                  {user?.name}
                </p>
                <p className="text-xs text-gray-500 truncate">{user?.email}</p>
              </div>

              {/* Links */}
              <nav className="py-1">
                <DropdownLink
                  href="/profile"
                  icon={<IoPersonOutline className="w-4 h-4" />}
                  label="My Profile"
                  onClick={() => setOpen(false)}
                />
                <DropdownLink
                  href="/orders"
                  icon={<IoReceiptOutline className="w-4 h-4" />}
                  label="Orders"
                  onClick={() => setOpen(false)}
                />
                <DropdownLink
                  href="/prescriptions"
                  icon={<IoDocumentTextOutline className="w-4 h-4" />}
                  label="Prescriptions"
                  onClick={() => setOpen(false)}
                />
              </nav>

              {/* Sign out */}
              <div className="border-t border-gray-100 pt-1">
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                >
                  <IoLogOutOutline className="w-4 h-4" />
                  Sign Out
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

/* ---- small helper ---- */

function DropdownLink({
  href,
  icon,
  label,
  onClick,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
    >
      {icon}
      {label}
    </Link>
  );
}
