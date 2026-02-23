"use client";

import { InputHTMLAttributes, forwardRef, useId } from "react";
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

export interface TextFieldProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "type"
> {
  /** Input type (text, email, search, tel, url, etc.) */
  type?: "text" | "email" | "search" | "tel" | "url" | "number";
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
 * TextField - Standardized text input field
 * Matches the baseline styling from pharmacy sign-up
 */
export const TextField = forwardRef<HTMLInputElement, TextFieldProps>(
  (
    {
      type = "text",
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

        <input
          ref={ref}
          id={fieldId}
          type={type}
          disabled={disabled}
          aria-invalid={!!error}
          aria-describedby={error ? errorId : hint ? hintId : undefined}
          className={cn(
            fieldInputBase,
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

TextField.displayName = "TextField";

export default TextField;
