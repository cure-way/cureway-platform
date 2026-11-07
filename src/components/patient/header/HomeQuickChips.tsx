"use client";

import Link from "next/link";
import { FaPrescription } from "react-icons/fa";
import {
  IoReceiptOutline,
  IoAlarmOutline,
  IoNotificationsOutline,
} from "react-icons/io5";
import { StaggerContainer, StaggerItem } from "@/components/home/animations";
import { SHELL_RAIL } from "@/components/shared";

interface QuickChip {
  label: string;
  status: string;
  href: string;
  icon: React.ReactNode;
}

const QUICK_CHIPS: QuickChip[] = [
  {
    label: "Order",
    status: "Out for delivery",
    href: "/orders",
    icon: (
      <IoReceiptOutline className="w-4 h-4 md:w-5 md:h-5 text-primary-darker" />
    ),
  },
  {
    label: "Prescription",
    status: "Under review",
    href: "/prescriptions",
    icon: (
      <FaPrescription className="w-4 h-4 md:w-5 md:h-5 text-primary-darker" />
    ),
  },
  {
    label: "Calendar",
    status: "Medicine refill",
    href: "/profile/saved-medicine",
    icon: (
      <IoAlarmOutline className="w-4 h-4 md:w-5 md:h-5 text-primary-darker" />
    ),
  },
  {
    label: "Notification",
    status: "New Offer",
    href: "/notifications",
    icon: (
      <IoNotificationsOutline className="w-4 h-4 md:w-5 md:h-5 text-primary-darker" />
    ),
  },
];

/**
 * HomeQuickChips
 * Row of card-style quick-action chips (Order, Prescription, Calendar,
 * Notification). Scrollable on mobile, equal-width on desktop.
 */
export function HomeQuickChips() {
  const visibleChips = QUICK_CHIPS;

  if (visibleChips.length === 0) return null;

  return (
    /* Full-bleed bar, content on the shell rail so the chips share the page's
       left and right edges. */
    <div className="bg-white w-full">
      <StaggerContainer
        className={`${SHELL_RAIL} flex items-center gap-2 flex-wrap md:flex-nowrap py-3`}
        stagger={0.06}
        delayChildren={0.2}
      >
        {visibleChips.map((chip) => (
          <StaggerItem
            key={chip.href}
            className="flex-1 min-w-0 basis-[calc(50%-4px)] md:basis-0"
          >
            <Link
              href={chip.href}
              className="flex items-center gap-3 px-4 py-2 md:py-2.5 bg-white border border-neutral rounded-xl hover:border-primary-light-active hover:bg-primary-light/30 transition-colors"
              aria-label={`${chip.label}: ${chip.status}`}
            >
              <span className="shrink-0">{chip.icon}</span>
              <p className="text-t-14 md:text-t-17 truncate leading-tight">
                <span className="font-medium text-primary-darker">
                  {chip.label}
                </span>
                <span className="font-medium text-primary-darker">{" · "}</span>
                <span className="text-neutral">{chip.status}</span>
              </p>
            </Link>
          </StaggerItem>
        ))}
      </StaggerContainer>
    </div>
  );
}
