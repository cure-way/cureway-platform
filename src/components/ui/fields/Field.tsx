"use client";

import { ReactNode, forwardRef, useId } from "react";
import { cn } from "@/lib/utils";
import {
  fieldWrapperClasses,
  fieldLabelClasses,
  fieldErrorClasses,
  fieldHintClasses,
} from "./fieldStyles";

export interface FieldProps {
  /** Field ID - auto-generated if not provided */
  id?: string;
  /** Label text */
  label?: string;
  /** Whether the field is required (shows asterisk) */
  required?: boolean;
  /** Hint/helper text shown below the field */
  hint?: string;
  /** Error message */
  error?: string;
  /** Children (the actual input/select/textarea) */
  children: ReactNode;
  /** Additional wrapper class names */
  className?: string;
}

/**
 * Field - Base wrapper for all form fields
 * Provides consistent label, hint, and error message styling
 */
export const Field = forwardRef<HTMLDivElement, FieldProps>(
  (
    { id: providedId, label, required, hint, error, children, className },
    ref,
  ) => {
    const generatedId = useId();
    const fieldId = providedId || generatedId;
    const errorId = `${fieldId}-error`;
    const hintId = `${fieldId}-hint`;

    return (
      <div ref={ref} className={cn(fieldWrapperClasses, className)}>
        {label && (
          <label htmlFor={fieldId} className={fieldLabelClasses}>
            {label}
            {required && <span className="text-red-500 ml-0.5">*</span>}
          </label>
        )}

        {children}

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

Field.displayName = "Field";

export default Field;
