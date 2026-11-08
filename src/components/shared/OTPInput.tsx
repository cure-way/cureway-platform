"use client";

import {
  useRef,
  useEffect,
  KeyboardEvent,
  forwardRef,
  useImperativeHandle,
} from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

export interface OTPInputProps {
  length: 4 | 6;
  value: string[];
  onChange: (value: string[]) => void;
  onComplete?: (code: string) => void;
  error?: string;
  disabled?: boolean;
  autoFocus?: boolean;
  className?: string;
}

export interface OTPInputRef {
  focus: () => void;
  clear: () => void;
}

export const OTPInput = forwardRef<OTPInputRef, OTPInputProps>(
  (
    {
      length,
      value,
      onChange,
      onComplete,
      error,
      disabled = false,
      autoFocus = true,
      className,
    },
    ref,
  ) => {
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

    useEffect(() => {
      if (autoFocus && inputRefs.current[0]) {
        inputRefs.current[0].focus();
      }
    }, [autoFocus]);

    useEffect(() => {
      if (value.every((digit) => digit !== "") && onComplete) {
        onComplete(value.join(""));
      }
    }, [value, onComplete]);

    useImperativeHandle(ref, () => ({
      focus: () => {
        const firstEmptyIndex = value.findIndex((digit) => digit === "");
        const targetIndex = firstEmptyIndex === -1 ? 0 : firstEmptyIndex;
        inputRefs.current[targetIndex]?.focus();
      },
      clear: () => {
        onChange(Array(length).fill(""));
        inputRefs.current[0]?.focus();
      },
    }));

    const handleChange = (index: number, newValue: string) => {
      // Only allow digits
      if (newValue && !/^\d$/.test(newValue)) return;

      const newCode = [...value];
      newCode[index] = newValue;
      onChange(newCode);

      // Auto-focus next input
      if (newValue && index < length - 1) {
        inputRefs.current[index + 1]?.focus();
      }
    };

    const handleKeyDown = (
      index: number,
      e: KeyboardEvent<HTMLInputElement>,
    ) => {
      // Handle backspace
      if (e.key === "Backspace") {
        e.preventDefault();
        if (value[index]) {
          const newCode = [...value];
          newCode[index] = "";
          onChange(newCode);
        } else if (index > 0) {
          inputRefs.current[index - 1]?.focus();
          const newCode = [...value];
          newCode[index - 1] = "";
          onChange(newCode);
        }
      }

      // Handle left/right arrow keys
      if (e.key === "ArrowLeft" && index > 0) {
        e.preventDefault();
        inputRefs.current[index - 1]?.focus();
      }
      if (e.key === "ArrowRight" && index < length - 1) {
        e.preventDefault();
        inputRefs.current[index + 1]?.focus();
      }

      // Handle paste
      if (e.key === "v" && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        navigator.clipboard.readText().then((text) => {
          const digits = text.replace(/\D/g, "").slice(0, length).split("");
          const newCode = [...Array(length)].map((_, i) => digits[i] || "");
          onChange(newCode);
          // Focus the last filled input or next empty one
          const nextIndex = Math.min(digits.length, length - 1);
          inputRefs.current[nextIndex]?.focus();
        });
      }
    };

    const handleFocus = (index: number) => {
      inputRefs.current[index]?.select();
    };

    return (
      <div className={cn("flex flex-col gap-2", className)}>
        <div
          className="flex gap-2.5 justify-center"
          role="group"
          aria-label="One-time password input"
        >
          {Array.from({ length }).map((_, index) => (
            <motion.input
              key={index}
              ref={(el) => {
                inputRefs.current[index] = el;
              }}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={value[index] || ""}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              onFocus={() => handleFocus(index)}
              disabled={disabled}
              aria-label={`Digit ${index + 1} of ${length}`}
              aria-invalid={!!error}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: index * 0.05 }}
              className={cn(
                "w-12 h-14 text-center text-t-17 font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 disabled:opacity-50 disabled:cursor-not-allowed",
                error
                  ? "bg-red-50 border-2 border-red-500 text-red-900 focus:border-red-600 focus:ring-red-500"
                  : "bg-gray-100 border border-gray-200 text-gray-900 focus:bg-white focus:border-gray-400 focus:ring-gray-300",
              )}
            />
          ))}
        </div>
        <AnimatePresence>
          {error && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="text-t-12 text-red-500 text-center"
              role="alert"
            >
              {error}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    );
  },
);

OTPInput.displayName = "OTPInput";
