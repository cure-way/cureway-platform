"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export type UserType = "patient" | "pharmacist";

export interface AuthUserTypeSwitchProps {
  /** Currently selected user type */
  value: UserType;
  /** Callback when user type changes */
  onChange: (type: UserType) => void;
  /** Additional className */
  className?: string;
}

/**
 * AuthUserTypeSwitch - Patient/Pharmacist toggle for auth pages
 * Matches Figma design: radio-style selection with icons
 */
export function AuthUserTypeSwitch({
  value,
  onChange,
  className,
}: AuthUserTypeSwitchProps) {
  return (
    <div className={cn("flex items-center justify-center gap-8", className)}>
      <span className="text-t-17 font-medium text-black/80">
        Select User Type
      </span>
      <div className="flex items-center gap-4">
        {/* Patient Option */}
        <button
          type="button"
          onClick={() => onChange("patient")}
          className="flex items-center gap-2 focus:outline-none group"
          aria-pressed={value === "patient"}
        >
          <motion.div
            className={cn(
              "w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors",
              value === "patient"
                ? "border-[#334eac] bg-[#334eac]"
                : "border-[#797776] bg-transparent",
            )}
            whileTap={{ scale: 0.95 }}
          >
            {value === "patient" && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="w-2.5 h-2.5 rounded-full bg-white"
              />
            )}
          </motion.div>
          <span
            className={cn(
              "text-t-14 transition-colors",
              value === "patient"
                ? "text-[#334eac] font-medium"
                : "text-[#797776]",
            )}
          >
            Patient
          </span>
        </button>

        {/* Pharmacist Option */}
        <button
          type="button"
          onClick={() => onChange("pharmacist")}
          className="flex items-center gap-2 focus:outline-none group"
          aria-pressed={value === "pharmacist"}
        >
          <motion.div
            className={cn(
              "w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors",
              value === "pharmacist"
                ? "border-[#334eac] bg-[#334eac]"
                : "border-[#797776] bg-transparent",
            )}
            whileTap={{ scale: 0.95 }}
          >
            {value === "pharmacist" && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="w-2.5 h-2.5 rounded-full bg-white"
              />
            )}
          </motion.div>
          <span
            className={cn(
              "text-t-14 transition-colors",
              value === "pharmacist"
                ? "text-[#334eac] font-medium"
                : "text-[#797776]",
            )}
          >
            Pharmacist
          </span>
        </button>
      </div>
    </div>
  );
}
