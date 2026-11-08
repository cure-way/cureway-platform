"use client";

import { InputHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, className, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1 w-full">
        <div
          className={cn(
            "flex flex-col w-full min-h-[52px] justify-center gap-1 px-4 py-2 bg-white rounded-md border transition-colors",
            error
              ? "border-red-500 focus-within:border-red-600"
              : "border-black focus-within:border-gray-600",
            className,
          )}
        >
          {label && (
            <label className="text-t-12-semibold text-neutral-dark">
              {label}
            </label>
          )}
          <input
            ref={ref}
            className="text-t-14 text-neutral-darker placeholder:text-neutral outline-none bg-transparent"
            {...props}
          />
        </div>
        {error && (
          <p className="text-t-12 text-error px-1 animate-in fade-in slide-in-from-top-1">
            {error}
          </p>
        )}
        {helperText && !error && (
          <p className="text-t-12 text-neutral px-1">{helperText}</p>
        )}
      </div>
    );
  },
);

Input.displayName = "Input";
