"use client";

import {
  forwardRef,
  useState,
  useEffect,
  useRef,
  useImperativeHandle,
} from "react";
import PhoneInputWithCountry from "react-phone-number-input";
import {
  CountryCode,
  parsePhoneNumber,
  isValidPhoneNumber,
} from "libphonenumber-js";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import "react-phone-number-input/style.css";

export interface PhoneInputProps {
  label?: string;
  error?: string;
  helperText?: string;
  value?: string;
  onChange?: (value: string | undefined) => void;
  onBlur?: () => void;
  disabled?: boolean;
  placeholder?: string;
  defaultCountry?: CountryCode;
  locale?: string;
  className?: string;
  name?: string;
}

// Custom input component for react-phone-number-input
const CustomInput = forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>((props, ref) => <input {...props} ref={ref} />);
CustomInput.displayName = "CustomPhoneInput";

export const PhoneInput = forwardRef<HTMLInputElement, PhoneInputProps>(
  (
    {
      label = "Phone Number",
      error,
      helperText,
      value,
      onChange,
      onBlur,
      disabled = false,
      placeholder = "+1 (555) 123-4567",
      defaultCountry,
      locale = "en",
      className,
      name,
    },
    ref,
  ) => {
    // Determine default country based on locale
    const getDefaultCountry = (): CountryCode => {
      if (defaultCountry) return defaultCountry;

      // Arabic locale defaults
      if (locale === "ar" || locale.startsWith("ar")) {
        return "PS"; // Palestine
      }

      // English and other locales default to US
      return "US";
    };

    const [country] = useState<CountryCode>(getDefaultCountry());
    const [phoneValue, setPhoneValue] = useState<string | undefined>(value);

    // Create a local ref to handle the input element
    const inputRef = useRef<HTMLInputElement>(null);

    // Expose the ref to parent components only if ref is provided
    useImperativeHandle(ref, () => inputRef.current!, []);

    // Sync external value changes
    useEffect(() => {
      setPhoneValue(value);
    }, [value]);

    const handleChange = (newValue: string | undefined) => {
      setPhoneValue(newValue);
      if (onChange) {
        onChange(newValue);
      }
    };

    return (
      <div className="flex flex-col gap-1 w-full">
        <div
          className={cn(
            "flex flex-col w-full min-h-[52px] justify-center gap-1 px-4 py-2 bg-white rounded-md border transition-colors",
            error
              ? "border-red-500 focus-within:border-red-600"
              : "border-black focus-within:border-gray-600",
            className,
          )}
        >
          {label && (
            <label className="text-t-12-semibold text-neutral-dark">
              {label}
            </label>
          )}
          <div className="phone-input-wrapper">
            <PhoneInputWithCountry
              international
              countryCallingCodeEditable={false}
              defaultCountry={country}
              value={phoneValue || ""}
              onChange={handleChange}
              onBlur={onBlur}
              disabled={disabled}
              placeholder={placeholder}
              className="w-full"
              numberInputProps={{
                className:
                  "text-t-14 text-gray-900 placeholder:text-gray-400 outline-none bg-transparent border-none focus:ring-0 p-0",
                name: name,
              }}
              countrySelectProps={{
                className: "border-none focus:ring-0 outline-none",
                "aria-label": "Select country",
              }}
              inputComponent={CustomInput}
            />
          </div>
        </div>

        {error && (
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="text-t-12 text-error px-1"
          >
            {error}
          </motion.p>
        )}
        {helperText && !error && (
          <p className="text-t-12 text-neutral px-1">{helperText}</p>
        )}
      </div>
    );
  },
);

PhoneInput.displayName = "PhoneInput";

// Helper function to validate phone number
export const validatePhoneNumber = (phone: string | undefined): boolean => {
  if (!phone) return false;
  try {
    return isValidPhoneNumber(phone);
  } catch {
    return false;
  }
};

// Helper function to parse phone number details
export const getPhoneNumberDetails = (phone: string) => {
  try {
    const phoneNumber = parsePhoneNumber(phone);
    if (!phoneNumber) return null;

    return {
      countryCode: phoneNumber.countryCallingCode,
      nationalNumber: phoneNumber.nationalNumber,
      country: phoneNumber.country,
      e164: phoneNumber.number, // E.164 format
      formatted: phoneNumber.formatInternational(),
      isValid: phoneNumber.isValid(),
    };
  } catch {
    return null;
  }
};
