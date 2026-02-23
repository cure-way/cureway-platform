"use client";

import { InputHTMLAttributes, forwardRef, useId } from "react";
import { cn } from "@/lib/utils";
import {
  fieldErrorClasses,
  fieldHintClasses,
  fieldCheckboxClasses,
} from "./fieldStyles";

export interface CheckboxFieldProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "type"
> {
  /** Label text (required for checkbox) */
  label: string | React.ReactNode;
  /** Hint/helper text */
  hint?: string;
  /** Error message */
  error?: string;
  /** Additional wrapper class names */
  wrapperClassName?: string;
}

/**
 * CheckboxField - Standardized checkbox field
 * Matches the baseline styling from pharmacy sign-up
 */
export const CheckboxField = forwardRef<HTMLInputElement, CheckboxFieldProps>(
  (
    {
      label,
      hint,
      error,
      id: providedId,
      className,
      wrapperClassName,
      disabled,
      ...props
    },
    ref,
  ) => {
    const generatedId = useId();
    const fieldId = providedId || generatedId;
    const errorId = `${fieldId}-error`;
    const hintId = `${fieldId}-hint`;

    return (
      <div className={cn("flex flex-col gap-1.5", wrapperClassName)}>
        <label className="flex items-start gap-3 cursor-pointer">
          <input
            ref={ref}
            id={fieldId}
            type="checkbox"
            disabled={disabled}
            aria-invalid={!!error}
            aria-describedby={error ? errorId : hint ? hintId : undefined}
            className={cn(
              fieldCheckboxClasses,
              "mt-0.5",
              disabled && "cursor-not-allowed opacity-60",
              className,
            )}
            {...props}
          />
          <span
            className={cn(
              "text-sm text-gray-700 select-none",
              disabled && "opacity-60",
            )}
          >
            {label}
          </span>
        </label>

        {error && (
          <p
            id={errorId}
            className={cn(fieldErrorClasses, "ml-8")}
            role="alert"
          >
            {error}
          </p>
        )}

        {hint && !error && (
          <p id={hintId} className={cn(fieldHintClasses, "ml-8")}>
            {hint}
          </p>
        )}
      </div>
    );
  },
);

CheckboxField.displayName = "CheckboxField";

export default CheckboxField;
