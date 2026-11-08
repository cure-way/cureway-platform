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
    // Radius, heights and text sizes per docs/design-spec.md section 5.
    const baseStyles =
      "flex items-center justify-center rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";

    // "primary" was bg-black, which is not in the palette at all — the brand
    // primary is CureWay blue.
    const variantStyles = {
      primary:
        "bg-primary text-white hover:bg-primary-hover active:bg-primary-active focus:ring-primary/40",
      secondary:
        "bg-primary-light text-primary hover:bg-primary-light-hover active:bg-primary-light-active focus:ring-primary/30",
      outline:
        "border border-primary text-primary bg-white hover:bg-primary-light active:bg-primary-light-active focus:ring-primary/30",
      ghost:
        "text-neutral-dark hover:bg-neutral-light active:bg-neutral-light-hover focus:ring-neutral/30",
    };

    const sizeStyles = {
      sm: "h-9 px-3 text-t-12-semibold",
      md: "h-11 px-4 text-t-14-semibold",
      lg: "h-[52px] px-6 text-t-17-semibold",
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
