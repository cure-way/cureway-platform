"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  FaChevronDown,
  FaSignOutAlt,
  FaUserCircle,
  FaCog,
} from "react-icons/fa";
import { useAuth } from "@/features/auth";
import { useClickOutside } from "@/hooks/useClickOutside";

export default function PharmacyMenu() {
  const { user, profile, isLoading, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const menuRef = useClickOutside<HTMLDivElement>(() => {
    setOpen(false);
  });

  async function handleLogout() {
    setOpen(false);
    await logout();
    router.push("/auth/sign-in");
  }

  // Derive display values from auth state
  const displayName = profile?.pharmacyName ?? user?.name ?? "Pharmacy";
  const initials = displayName
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  const email = user?.email ?? "";
  const verificationStatus = profile?.verificationStatus;

  // Loading skeleton
  if (isLoading) {
    return (
      <div className="flex items-center gap-2 px-2 py-1">
        <div className="bg-gray-200 rounded-full w-8 h-8 animate-pulse" />
        <div className="hidden sm:block bg-gray-200 rounded w-24 h-4 animate-pulse" />
      </div>
    );
  }

  return (
    <div ref={menuRef} className="relative">
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="flex items-center gap-2 hover:bg-gray-100 px-2 py-1 border rounded-full transition-colors"
        aria-label="Pharmacy menu"
        aria-haspopup="true"
        aria-expanded={open}
      >
        <div className="flex justify-center items-center bg-(--color-secondary-light) rounded-full w-8 h-8 font-semibold text-(--color-primary) text-sm">
          {initials}
        </div>
        <span className="hidden sm:block max-w-40 font-medium text-gray-700 text-sm truncate">
          {displayName}
        </span>
        <FaChevronDown
          className={`text-xs text-gray-500 transition-transform ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {open && (
        <div className="right-0 z-50 absolute bg-white shadow-xl mt-2 border border-gray-100 rounded-xl w-64">
          {/* User info header */}
          <div className="px-4 py-3 border-gray-100 border-b">
            <p className="font-semibold text-gray-900 text-sm truncate">
              {displayName}
            </p>
            {email && (
              <p className="mt-0.5 text-gray-500 text-xs truncate">{email}</p>
            )}
            {verificationStatus && (
              <span
                className={`inline-block mt-1.5 px-2 py-0.5 text-[11px] font-medium rounded-full ${
                  verificationStatus === "VERIFIED"
                    ? "bg-green-50 text-green-700"
                    : verificationStatus === "REJECTED"
                      ? "bg-red-50 text-red-700"
                      : "bg-yellow-50 text-yellow-700"
                }`}
              >
                {verificationStatus === "VERIFIED"
                  ? "Verified"
                  : verificationStatus === "REJECTED"
                    ? "Rejected"
                    : "Under Review"}
              </span>
            )}
          </div>

          {/* Navigation links */}
          <nav className="py-1">
            <Link
              href="/pharmacy/profile"
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 hover:bg-gray-50 px-4 py-2.5 text-gray-700 text-sm transition-colors"
            >
              <FaUserCircle className="w-4 h-4 text-gray-400" />
              Profile
            </Link>
            <Link
              href="/pharmacy/home"
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 hover:bg-gray-50 px-4 py-2.5 text-gray-700 text-sm transition-colors"
            >
              <FaCog className="w-4 h-4 text-gray-400" />
              Settings
            </Link>
          </nav>

          {/* Sign out */}
          <div className="py-1 border-gray-100 border-t">
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 hover:bg-red-50 px-4 py-2.5 w-full text-red-600 text-sm transition-colors"
            >
              <FaSignOutAlt className="w-4 h-4" />
              Log out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
