"use client";

import { Plus } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { buttonTap, transition } from "./motion";

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
