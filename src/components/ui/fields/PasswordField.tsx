"use client";

import { InputHTMLAttributes, forwardRef, useState, useId } from "react";
import { Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  fieldInputBase,
  fieldInputWithIcon,
  fieldWrapperClasses,
  fieldLabelClasses,
  fieldErrorClasses,
  fieldHintClasses,
  fieldErrorBorder,
  fieldDefaultBorder,
  fieldIconButton,
} from "./fieldStyles";

export interface PasswordFieldProps extends Omit<
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
 * PasswordField - Password input with visibility toggle
 * Matches the baseline styling from pharmacy sign-up
 */
export const PasswordField = forwardRef<HTMLInputElement, PasswordFieldProps>(
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
    const [showPassword, setShowPassword] = useState(false);
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
            type={showPassword ? "text" : "password"}
            disabled={disabled}
            aria-invalid={!!error}
            aria-describedby={error ? errorId : hint ? hintId : undefined}
            className={cn(
              fieldInputBase,
              fieldInputWithIcon,
              error ? fieldErrorBorder : fieldDefaultBorder,
              className,
            )}
            {...props}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            disabled={disabled}
            className={cn(
              fieldIconButton,
              disabled && "cursor-not-allowed opacity-60",
            )}
            tabIndex={-1}
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? (
              <EyeOff className="w-5 h-5" />
            ) : (
              <Eye className="w-5 h-5" />
            )}
          </button>
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

PasswordField.displayName = "PasswordField";

export default PasswordField;
