"use client";

import { forwardRef, type ReactNode, type MouseEventHandler } from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ButtonProps {
  children?: ReactNode;
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
  fullWidth?: boolean;
  disabled?: boolean;
  className?: string;
  type?: "button" | "submit" | "reset";
  onClick?: MouseEventHandler<HTMLButtonElement>;
  "aria-label"?: string;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      variant = "primary",
      size = "lg",
      loading = false,
      fullWidth = true,
      disabled,
      className,
      type = "button",
      onClick,
      ...props
    },
    ref,
  ) => {
    const baseStyles =
      "flex items-center justify-center rounded-3xl font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";

    const variantStyles = {
      primary:
        "bg-black text-white hover:bg-gray-800 active:bg-gray-900 focus:ring-gray-500",
      secondary:
        "bg-gray-200 text-gray-900 hover:bg-gray-300 active:bg-gray-400 focus:ring-gray-400",
      outline:
        "border-2 border-black text-black hover:bg-gray-50 active:bg-gray-100 focus:ring-gray-500",
      ghost:
        "text-gray-700 hover:bg-gray-100 active:bg-gray-200 focus:ring-gray-300",
    };

    const sizeStyles = {
      sm: "h-10 px-4 text-sm",
      md: "h-12 px-6 text-base",
      lg: "h-15.25 px-8 text-base",
    };

    const widthStyles = fullWidth ? "w-full" : "";

    return (
      <button
        ref={ref}
        className={cn(
          baseStyles,
          variantStyles[variant],
          sizeStyles[size],
          widthStyles,
          "active:scale-[0.98] transition-transform",
          className,
        )}
        disabled={disabled || loading}
        type={type}
        onClick={onClick}
        {...props}
      >
        {loading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin mr-2" />
            <span>Loading...</span>
          </>
        ) : (
          children
        )}
      </button>
    );
  },
);

Button.displayName = "Button";
