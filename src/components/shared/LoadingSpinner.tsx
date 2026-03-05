"use client";

import React from "react";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";

// ===================================================================
// LOADING SPINNER
// ===================================================================

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  text?: string;
  fullScreen?: boolean;
}

export function LoadingSpinner({
  size = "md",
  text,
  fullScreen = false,
}: LoadingSpinnerProps) {
  const sizeClasses = { sm: "w-4 h-4", md: "w-8 h-8", lg: "w-12 h-12" };

  const inner = (
    <div className="flex flex-col items-center justify-center gap-4">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      >
        <Loader2 className={`${sizeClasses[size]} text-primary`} />
      </motion.div>
      {text && (
        <p className="text-t-14 text-muted-foreground animate-pulse">{text}</p>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-50">
        {inner}
      </div>
    );
  }

  return inner;
}
