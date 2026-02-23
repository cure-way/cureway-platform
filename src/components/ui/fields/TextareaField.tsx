"use client";

import { TextareaHTMLAttributes, forwardRef, useId } from "react";
import { cn } from "@/lib/utils";
import {
  fieldWrapperClasses,
  fieldLabelClasses,
  fieldErrorClasses,
  fieldHintClasses,
  fieldErrorBorder,
  fieldDefaultBorder,
} from "./fieldStyles";

// Textarea base classes (similar to input but with different height handling)
const textareaBase = [
  "w-full px-4 py-3 rounded-xl border bg-white",
  "transition-all duration-200",
  "text-base text-gray-900",
  "placeholder:text-[#a29e9d]",
  "focus:outline-none focus:ring-2 focus:ring-[#334eac]/20 focus:border-[#334eac]",
  "disabled:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60",
  "resize-none",
].join(" ");

export interface TextareaFieldProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
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
 * TextareaField - Standardized textarea field
 * Matches the baseline styling from pharmacy sign-up
 */
export const TextareaField = forwardRef<
  HTMLTextAreaElement,
  TextareaFieldProps
>(
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
      rows = 4,
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

        <textarea
          ref={ref}
          id={fieldId}
          rows={rows}
          disabled={disabled}
          aria-invalid={!!error}
          aria-describedby={error ? errorId : hint ? hintId : undefined}
          className={cn(
            textareaBase,
            error ? fieldErrorBorder : fieldDefaultBorder,
            className,
          )}
          {...props}
        />

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

TextareaField.displayName = "TextareaField";

export default TextareaField;
