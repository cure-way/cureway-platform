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
            "flex flex-col w-full h-[61px] justify-center gap-1 px-4 py-2 bg-white rounded-md border transition-colors",
            error
              ? "border-red-500 focus-within:border-red-600"
              : "border-black focus-within:border-gray-600",
            className,
          )}
        >
          {label && (
            <label className="text-sm font-medium text-black">{label}</label>
          )}
          <input
            ref={ref}
            className="text-sm text-gray-900 placeholder:text-gray-400 outline-none bg-transparent"
            {...props}
          />
        </div>
        {error && (
          <p className="text-xs text-red-500 px-1 animate-in fade-in slide-in-from-top-1">
            {error}
          </p>
        )}
        {helperText && !error && (
          <p className="text-xs text-gray-500 px-1">{helperText}</p>
        )}
      </div>
    );
  },
);

Input.displayName = "Input";
