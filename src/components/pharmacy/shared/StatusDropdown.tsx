"use client";

import { useState } from "react";
import { FiChevronDown } from "react-icons/fi";
import { useClickOutside } from "@/hooks/useClickOutside";

interface DropdownOption<T extends string> {
  label: string;
  value: T;
}

interface StatusDropdownProps<T extends string> {
  options: DropdownOption<T>[];
  value?: T;
  defaultValue?: T;
  onChange?: (value: T) => void;
  className?: string;
  direction?: "up" | "down";
}

export default function StatusDropdown<T extends string>({
  options,
  value,
  defaultValue,
  onChange,
  className = "",
  direction = "down",
}: StatusDropdownProps<T>) {
  const [open, setOpen] = useState(false);
  const [internalValue, setInternalValue] = useState<T>(
    defaultValue ?? options[0]?.value,
  );

  const selectedValue = value ?? internalValue;

  const ref = useClickOutside<HTMLDivElement>(() => {
    setOpen(false);
  });

  function handleSelect(optionValue: T) {
    if (value === undefined) {
      setInternalValue(optionValue);
    }

    onChange?.(optionValue);
    setOpen(false);
  }

  const selectedOption = options.find((opt) => opt.value === selectedValue);

  return (
    <div ref={ref} className="relative">
      {/* Trigger */}
      <button
        onClick={() => setOpen((prev) => !prev)}
        className={`flex items-center gap-1 rounded-lg border px-4 py-2 text-xs text-gray-600 ${className}`}
      >
        {selectedOption?.label}
        <FiChevronDown className="text-gray-500" />
      </button>

      {/* Dropdown */}
      {open && (
        <div
          className={`absolute right-0 z-50 rounded-lg border bg-white shadow-md ${
            direction === "down" ? "mt-2 top-full" : "mb-2 bottom-full"
          }`}
        >
          {options.map((option) => {
            const isActive = option.value === selectedValue;

            return (
              <button
                key={option.value}
                onClick={() => handleSelect(option.value)}
                className={`w-full px-3 py-2 text-left text-xs transition ${
                  isActive
                    ? "font-medium text-gray-700"
                    : "text-gray-400 hover:bg-gray-50 hover:text-gray-600"
                }`}
              >
                {option.label}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
