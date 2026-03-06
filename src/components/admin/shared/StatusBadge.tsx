"use client";

import { cn } from "@/lib/utils";
import { ShieldCheck } from "lucide-react";

export type BadgeVariant =
  | "active"
  | "unactive"
  | "paid"
  | "delivered"
  | "available"
  | "reserved"
  | "pending"
  | "processing"
  | "verified"
  | "in-stock"
  | "out-of-stock"
  | "low-stock"
  | "under-review"
  | "rejected"
  | "online"
  | "offline"
  | "assigned"
  | "pickup-in-progress"
  | "en-route"
  | "cancelled"
  | "accepted"
  | "approved";

interface StatusBadgeProps {
  variant: BadgeVariant;
  suffix?: string;
  className?: string;
}

const variantStyles: Record<BadgeVariant, string> = {
  active: "bg-success-light text-success-darker",
  unactive: "bg-neutral-light-active text-neutral",
  paid: "bg-success-light text-success-darker",
  delivered: "bg-secondary-light text-secondary-dark",
  available: "bg-success-light text-success-darker",
  reserved: "bg-warning-light text-warning-dark",
  pending: "bg-warning-light text-warning-dark",
  processing: "bg-secondary-light text-secondary-dark",
  verified: "bg-success-light text-success-darker",
  "in-stock": "bg-success-light text-success-darker",
  "out-of-stock": "bg-error-light text-error-darker",
  "low-stock": "bg-warning-light-active text-warning-darker",
  "under-review": "bg-warning-light text-warning-dark",
  rejected: "bg-error-light text-error-darker",
  online: "bg-success-light text-success-darker",
  offline: "bg-neutral-light-active text-neutral",
  assigned: "bg-secondary-light text-secondary-dark",
  "pickup-in-progress": "bg-warning-light text-warning-dark",
  "en-route": "bg-secondary-light text-secondary-dark",
  cancelled: "bg-error-light text-error-darker",
  accepted: "bg-success-light text-success-darker",
  approved: "bg-success-light text-success-darker",
};

const labelMap: Record<BadgeVariant, string> = {
  active: "Active",
  unactive: "Unactive",
  paid: "Paid",
  delivered: "Delivered",
  available: "Available",
  reserved: "Reserved",
  pending: "Pending",
  processing: "Processing",
  verified: "Verified",
  "in-stock": "In stock",
  "out-of-stock": "Out of stock",
  "low-stock": "In stock",
  "under-review": "Under Review",
  rejected: "Rejected",
  online: "Online",
  offline: "Offline",
  assigned: "Assigned",
  "pickup-in-progress": "Pickup",
  "en-route": "En Route",
  cancelled: "Cancelled",
  accepted: "Accepted",
  approved: "Approved",
};

/** Variants that show the verified checkmark icon */
const iconVariants = new Set<BadgeVariant>(["verified", "active", "available"]);

export default function StatusBadge({
  variant,
  suffix,
  className,
}: StatusBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center justify-center gap-1 rounded-lg px-3 py-2 text-t-10 font-semibold whitespace-nowrap",
        variantStyles[variant],
        className,
      )}
    >
      {iconVariants.has(variant) && <ShieldCheck className="w-3 h-3" />}
      {labelMap[variant]}
      {suffix && <span className="font-medium text-t-10 ml-1">· {suffix}</span>}
    </span>
  );
}
