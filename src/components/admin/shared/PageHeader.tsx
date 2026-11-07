"use client";

import { Plus } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";
import { buttonTap, transition } from "./motion";

/* ── Main header layout ── */

interface PageHeaderProps {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  /** Slot for action buttons (use HeaderPrimaryButton / HeaderIconButton) */
  actions?: React.ReactNode;
  className?: string;
}

/**
 * Consistent page header for all admin routes.
 * Renders icon | title + subtitle | action buttons.
 */
export default function PageHeader({
  icon,
  title,
  subtitle,
  actions,
  className,
}: PageHeaderProps) {
  return (
    <div
      className={cn("flex flex-row items-center gap-2 pb-2 sm:pb-4", className)}
    >
      <div className="flex items-center gap-2.5 sm:gap-4 flex-1 min-w-0">
        <span className="shrink-0 [&>svg]:w-7 [&>svg]:h-7 sm:[&>svg]:w-10 sm:[&>svg]:h-10">
          {icon}
        </span>
        <div className="min-w-0 flex-1">
          <h1 className="text-t-17 sm:text-t-25 leading-[1.2] font-bold text-primary-darker truncate">
            {title}
          </h1>
          <p className="text-t-14 sm:text-t-17 leading-[1.2] font-medium text-neutral mt-0.5 sm:mt-1">
            {subtitle}
          </p>
        </div>
      </div>

      {actions && (
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {actions}
        </div>
      )}
    </div>
  );
}

/* ── Reusable header action buttons ── */

export function HeaderPrimaryButton({
  children,
  icon,
  onClick,
}: {
  children: React.ReactNode;
  icon?: React.ReactNode;
  onClick?: () => void;
}) {
  const shouldReduce = useReducedMotion();
  const Comp = shouldReduce ? "button" : motion.button;
  const motionProps = shouldReduce
    ? {}
    : {
        initial: "rest" as const,
        whileHover: "hover" as const,
        whileTap: "tap" as const,
        variants: buttonTap,
        transition: transition.micro,
      };

  return (
    <Comp
      onClick={onClick}
      className="flex items-center gap-1.5 sm:gap-2 bg-primary-dark text-primary-light hover:bg-primary-dark-hover px-2.5 py-2 sm:px-4 sm:py-3 rounded-lg transition-colors"
      {...motionProps}
    >
      {icon ?? <Plus className="w-5 h-5 sm:w-6 sm:h-6" />}
      <span className="hidden md:inline text-[14px] font-semibold">
        {children}
      </span>
    </Comp>
  );
}

export function HeaderIconButton({
  icon,
  label,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
}) {
  const shouldReduce = useReducedMotion();
  const Comp = shouldReduce ? "button" : motion.button;
  const motionProps = shouldReduce
    ? {}
    : {
        initial: "rest" as const,
        whileHover: "hover" as const,
        whileTap: "tap" as const,
        variants: buttonTap,
        transition: transition.micro,
      };

  return (
    <Comp
      onClick={onClick}
      className="w-10 h-10 sm:w-14 sm:h-14 flex items-center justify-center rounded-lg border border-border bg-white hover:bg-neutral-light transition-colors [&>svg]:w-5 [&>svg]:h-5 sm:[&>svg]:w-6 sm:[&>svg]:h-6"
      aria-label={label}
      {...motionProps}
    >
      {icon}
    </Comp>
  );
}
