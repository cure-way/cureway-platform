"use client";

import { InputHTMLAttributes, forwardRef, useId } from "react";
import { Calendar } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  fieldInputBase,
  fieldWrapperClasses,
  fieldLabelClasses,
  fieldErrorClasses,
  fieldHintClasses,
  fieldErrorBorder,
  fieldDefaultBorder,
} from "./fieldStyles";

export interface DateFieldProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "type"
> {
  /** Label text */
  label?: string;
  /** Whether the field is required */
  required?: boolean;
  /** Hint/helper text */
  hint?: string;
  /** Error message */
  error?: string;
  /** Additional wrapper class names */
  wrapperClassName?: string;
}

/**
 * DateField - Standardized date input field
 * Matches the baseline styling from pharmacy sign-up
 */
export const DateField = forwardRef<HTMLInputElement, DateFieldProps>(
  (
    {
      label,
      required,
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
      <div className={cn(fieldWrapperClasses, wrapperClassName)}>
        {label && (
          <label htmlFor={fieldId} className={fieldLabelClasses}>
            {label}
            {required && <span className="text-red-500 ml-0.5">*</span>}
          </label>
        )}

        <div className="relative">
          <input
            ref={ref}
            id={fieldId}
            type="date"
            disabled={disabled}
            aria-invalid={!!error}
            aria-describedby={error ? errorId : hint ? hintId : undefined}
            className={cn(
              fieldInputBase,
              "pr-10",
              error ? fieldErrorBorder : fieldDefaultBorder,
              className,
            )}
            {...props}
          />
          <Calendar className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 pointer-events-none" />
        </div>

        {error && (
          <p id={errorId} className={fieldErrorClasses} role="alert">
            {error}
          </p>
        )}

        {hint && !error && (
          <p id={hintId} className={fieldHintClasses}>
            {hint}
          </p>
        )}
      </div>
    );
  },
);

DateField.displayName = "DateField";

export default DateField;
