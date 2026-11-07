"use client";

import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

/* ── Stats bar container ── */

interface StatsBarProps {
  /** e.g. "120 Patient" */
  count: string;
  /** e.g. "100% of your customer base" — omit to let count fill the space */
  description?: string;
  /** KPI pill elements (use <KpiPill /> helper) */
  children: React.ReactNode;
  className?: string;
}

/**
 * Consistent KPI / summary strip for all admin routes.
 * Renders: count | description | pills | collapse chevron.
 */
export default function StatsBar({
  count,
  description,
  children,
  className,
}: StatsBarProps) {
  return (
    <div
      className={cn(
        "bg-white border border-border rounded-xl p-3 sm:p-4 flex flex-col sm:flex-row sm:flex-wrap sm:items-center gap-2",
        className,
      )}
    >
      {/* Count + Description row */}
      <div className="flex items-center gap-2 min-w-0">
        <div
          className={cn(
            "flex items-center sm:border-r sm:border-neutral-light-active sm:pr-4 shrink-0",
          )}
        >
          <span className="text-t-17 sm:text-t-21 leading-normal font-extrabold text-secondary-darker">
            {count}
          </span>
        </div>

        {/* Description */}
        {description && (
          <span className="text-[14px] sm:text-t-17 leading-[1.2] font-semibold text-neutral-dark flex-1 min-w-0 truncate sm:whitespace-normal sm:overflow-visible">
            {description}
          </span>
        )}
      </div>

      {/* KPI pills */}
      <div className="flex flex-wrap items-center gap-2 sm:gap-3 sm:ml-auto min-w-0">
        {children}
      </div>

      {/* Collapse chevron */}
      <button
        className="hidden sm:flex w-12 h-12 items-center justify-center rounded-xl p-3 hover:bg-neutral-light transition-colors shrink-0"
        aria-label="Collapse stats"
      >
        <ChevronDown className="w-6 h-6 text-neutral-dark" />
      </button>
    </div>
  );
}

/* ── Reusable KPI pill ── */

export function KpiPill({
  icon,
  value,
  label,
  variant = "success",
}: {
  icon: React.ReactNode;
  value: string | number;
  label: string;
  variant?: "success" | "secondary" | "info" | "warning" | "error";
}) {
  const styles = {
    success: {
      bg: "bg-success-light",
      border: "border-success-light-active",
      valueText: "text-success-darker",
      labelText: "text-success-dark",
    },
    secondary: {
      bg: "bg-secondary-light",
      border: "border-neutral-light-active",
      valueText: "text-secondary-darker",
      labelText: "text-primary-dark",
    },
    info: {
      bg: "bg-secondary-light",
      border: "border-secondary-light-active",
      valueText: "text-secondary-darker",
      labelText: "text-secondary-dark",
    },
    warning: {
      bg: "bg-warning-light-hover",
      border: "border-warning-light-active",
      valueText: "text-warning-darker",
      labelText: "text-warning-dark",
    },
    error: {
      bg: "bg-error-light",
      border: "border-error-light-active",
      valueText: "text-error-darker",
      labelText: "text-error-dark",
    },
  };

  const s = styles[variant];

  return (
    <div
      className={`flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-2.5 sm:py-4 ${s.bg} rounded-lg sm:rounded-xl`}
    >
      <div
        className={`flex items-center gap-1 border-r ${s.border} pr-1.5 sm:pr-2.5`}
      >
        <span className="[&>svg]:w-4 [&>svg]:h-4 sm:[&>svg]:w-6 sm:[&>svg]:h-6">
          {icon}
        </span>
        <span
          className={`text-t-14 sm:text-t-17 leading-normal font-extrabold ${s.valueText}`}
        >
          {value}
        </span>
      </div>
      <span
        className={`text-t-14 sm:text-t-17 leading-normal font-medium ${s.labelText}`}
      >
        {label}
      </span>
    </div>
  );
}
