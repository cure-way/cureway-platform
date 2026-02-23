"use client";

import { SelectHTMLAttributes, forwardRef, useId } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  fieldSelectClasses,
  fieldWrapperClasses,
  fieldLabelClasses,
  fieldErrorClasses,
  fieldHintClasses,
  fieldErrorBorder,
  fieldDefaultBorder,
} from "./fieldStyles";

export interface SelectFieldOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectFieldProps extends Omit<
  SelectHTMLAttributes<HTMLSelectElement>,
  "children"
> {
  /** Label text */
  label?: string;
  /** Whether the field is required */
  required?: boolean;
  /** Hint/helper text */
  hint?: string;
  /** Error message */
  error?: string;
  /** Placeholder option text */
  placeholder?: string;
  /** Options array */
  options: SelectFieldOption[];
  /** Additional wrapper class names */
  wrapperClassName?: string;
}

/**
 * SelectField - Standardized select dropdown field
 * Matches the baseline styling from pharmacy sign-up
 */
export const SelectField = forwardRef<HTMLSelectElement, SelectFieldProps>(
  (
    {
      label,
      required,
      hint,
      error,
      placeholder,
      options,
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
          <select
            ref={ref}
            id={fieldId}
            disabled={disabled}
            aria-invalid={!!error}
            aria-describedby={error ? errorId : hint ? hintId : undefined}
            className={cn(
              fieldSelectClasses,
              error ? fieldErrorBorder : fieldDefaultBorder,
              className,
            )}
            {...props}
          >
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}
            {options.map((option) => (
              <option
                key={option.value}
                value={option.value}
                disabled={option.disabled}
              >
                {option.label}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 pointer-events-none" />
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

SelectField.displayName = "SelectField";

export default SelectField;
