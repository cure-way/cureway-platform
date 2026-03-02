"use client";

import { motion } from "framer-motion";
import React from "react";

type MotionTapProps = React.PropsWithChildren<{
  className?: string;
  as?: "div" | "button" | "a";
  onClick?: () => void;
  href?: string;
  type?: "button" | "submit";
}>;

export function MotionTap({
  children,
  className,
  as = "div",
  onClick,
  href,
  type = "button",
}: MotionTapProps) {
  const Comp =
    as === "button" ? motion.button : as === "a" ? motion.a : motion.div;

  return (
    <Comp
      className={className}
      onClick={onClick}
      href={href}
      type={as === "button" ? type : undefined}
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 500, damping: 30 }}
    >
      {children}
    </Comp>
  );
}