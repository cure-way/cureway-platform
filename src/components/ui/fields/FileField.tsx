"use client";

import { InputHTMLAttributes, forwardRef, useId, ReactNode } from "react";
import { Upload } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  fieldWrapperClasses,
  fieldLabelClasses,
  fieldErrorClasses,
  fieldHintClasses,
  fieldFileUploadClasses,
} from "./fieldStyles";

export interface FileFieldProps extends Omit<
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
  /** Upload area title */
  uploadTitle?: string;
  /** Upload area subtitle */
  uploadSubtitle?: string;
  /** Custom upload icon */
  uploadIcon?: ReactNode;
  /** Additional wrapper class names */
  wrapperClassName?: string;
}

/**
 * FileField - Standardized file upload field
 * Matches the baseline styling from pharmacy sign-up
 */
export const FileField = forwardRef<HTMLInputElement, FileFieldProps>(
  (
    {
      label,
      required,
      hint,
      error,
      uploadTitle = "Click to upload or drag and drop",
      uploadSubtitle = "PDF, PNG, JPG (max. 10MB)",
      uploadIcon,
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

        <label
          htmlFor={fieldId}
          className={cn(
            fieldFileUploadClasses,
            disabled && "cursor-not-allowed opacity-60",
            className,
          )}
        >
          {uploadIcon || <Upload className="w-8 h-8 text-gray-400" />}
          <span className="text-sm text-gray-500">{uploadTitle}</span>
          <span className="text-xs text-gray-400">{uploadSubtitle}</span>
          <input
            ref={ref}
            id={fieldId}
            type="file"
            disabled={disabled}
            aria-invalid={!!error}
            aria-describedby={error ? errorId : hint ? hintId : undefined}
            className="hidden"
            {...props}
          />
        </label>

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

FileField.displayName = "FileField";

export default FileField;
