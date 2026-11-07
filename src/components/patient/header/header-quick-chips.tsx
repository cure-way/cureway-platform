"use client";

import Link from "next/link";
import {
  IoReceiptOutline,
  IoDocumentTextOutline,
  IoCalendarOutline,
  IoNotificationsOutline,
} from "react-icons/io5";

interface QuickChip {
  label: string;
  href: string;
  icon: React.ReactNode;
  requiresAuth?: boolean;
}

const QUICK_CHIPS: QuickChip[] = [
  {
    label: "Order",
    href: "/orders",
    icon: <IoReceiptOutline className="w-4 h-4" />,
    requiresAuth: true,
  },
  {
    label: "Prescription",
    href: "/prescriptions",
    icon: <IoDocumentTextOutline className="w-4 h-4" />,
    requiresAuth: true,
  },
  {
    label: "Calendar",
    href: "/profile/saved-medicine",
    icon: <IoCalendarOutline className="w-4 h-4" />,
    requiresAuth: true,
  },
  {
    label: "Notification",
    href: "/notifications",
    icon: <IoNotificationsOutline className="w-4 h-4" />,
    requiresAuth: true,
  },
];

interface HeaderQuickChipsProps {
  isAuthenticated: boolean;
}

export function HeaderQuickChips({ isAuthenticated }: HeaderQuickChipsProps) {
  // Filter chips based on authentication
  const visibleChips = QUICK_CHIPS.filter(
    (chip) => !chip.requiresAuth || isAuthenticated,
  );

  if (visibleChips.length === 0) {
    return null;
  }

  return (
    <div className="bg-white border-b border-black/5 px-3 md:px-6 py-2 overflow-x-auto">
      <div className="flex items-center gap-2 min-w-max">
        {visibleChips.map((chip) => (
          <Link
            key={chip.href}
            href={chip.href}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs md:text-sm font-medium text-black/70 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors whitespace-nowrap"
          >
            {chip.icon}
            {chip.label}
          </Link>
        ))}
      </div>
    </div>
  );
}
