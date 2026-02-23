"use client";

import { useForm, Controller } from "react-hook-form";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { pharmacyInfoSchema, type PharmacyInfoFormData } from "@/types/auth";
import { TextField, SelectField, PhoneField } from "@/components/ui/fields";
import { cn } from "@/lib/utils";

export interface PharmacyInfoFormProps {
  defaultValues?: Partial<PharmacyInfoFormData>;
  onSubmit: (data: PharmacyInfoFormData, dialCode?: string) => void;
  isLoading?: boolean;
}

// Palestinian cities list
const CITIES = [
  { value: "Gaza", label: "Gaza" },
  { value: "Khan Younis", label: "Khan Younis" },
  { value: "Rafah", label: "Rafah" },
  { value: "Deir al-Balah", label: "Deir al-Balah" },
  { value: "Jabalia", label: "Jabalia" },
  { value: "Beit Lahia", label: "Beit Lahia" },
  { value: "Beit Hanoun", label: "Beit Hanoun" },
  { value: "Ramallah", label: "Ramallah" },
  { value: "Nablus", label: "Nablus" },
  { value: "Hebron", label: "Hebron" },
  { value: "Bethlehem", label: "Bethlehem" },
  { value: "Jenin", label: "Jenin" },
  { value: "Tulkarm", label: "Tulkarm" },
  { value: "Qalqilya", label: "Qalqilya" },
  { value: "Jericho", label: "Jericho" },
];

/**
 * PharmacyInfoForm - Step 1 of pharmacy sign-up
 * Fields: Pharmacy Name, Number, Address, City
 */
export function PharmacyInfoForm({
  defaultValues,
  onSubmit,
  isLoading = false,
}: PharmacyInfoFormProps) {
  const [dialCode, setDialCode] = useState("+970");
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<PharmacyInfoFormData>({
    resolver: zodResolver(pharmacyInfoSchema),
    defaultValues: {
      pharmacyName: "",
      pharmacyNumber: "",
      pharmacyAddress: "",
      pharmacyCity: "",
      ...defaultValues,
    },
  });

  return (
    <form
      onSubmit={handleSubmit((data) => onSubmit(data, dialCode))}
      className="flex flex-col gap-5"
    >
      {/* Pharmacy Name */}
      <TextField
        id="pharmacyName"
        label="Pharmacy Name"
        placeholder="Enter your pharmacy name"
        disabled={isLoading}
        error={errors.pharmacyName?.message}
        {...register("pharmacyName")}
      />

      {/* Pharmacy Number */}
      <Controller
        name="pharmacyNumber"
        control={control}
        render={({ field }) => (
          <PhoneField
            label="Pharmacy Number"
            id="pharmacyNumber"
            value={field.value}
            onChange={field.onChange}
            onCountryChange={(code) => {
              // Look up the dial code for the newly selected country
              const DIAL_CODES: Record<string, string> = {
                PS: "+970",
                IL: "+972",
                JO: "+962",
                EG: "+20",
                SA: "+966",
                AE: "+971",
                LB: "+961",
                SY: "+963",
              };
              setDialCode(DIAL_CODES[code] ?? "+970");
            }}
            disabled={isLoading}
            placeholder="Enter phone number"
            error={errors.pharmacyNumber?.message}
          />
        )}
      />

      {/* Pharmacy Address */}
      <TextField
        id="pharmacyAddress"
        label="Pharmacy Address"
        placeholder="Enter your pharmacy address"
        disabled={isLoading}
        error={errors.pharmacyAddress?.message}
        {...register("pharmacyAddress")}
      />

      {/* Pharmacy City */}
      <SelectField
        id="pharmacyCity"
        label="Pharmacy City"
        placeholder="Select city"
        options={CITIES}
        disabled={isLoading}
        error={errors.pharmacyCity?.message}
        {...register("pharmacyCity")}
      />

      {/* Submit Button */}
      <motion.button
        type="submit"
        disabled={isLoading}
        className={cn(
          "h-14 rounded-xl bg-[#334eac] text-white text-lg font-medium",
          "transition-all duration-200",
          "hover:bg-[#2e469b] active:bg-[#283d87]",
          "disabled:opacity-50 disabled:cursor-not-allowed",
          "focus:outline-none focus:ring-2 focus:ring-[#334eac]/50 focus:ring-offset-2",
        )}
        whileTap={{ scale: isLoading ? 1 : 0.98 }}
      >
        {isLoading ? "Loading..." : "Next"}
      </motion.button>
    </form>
  );
}
