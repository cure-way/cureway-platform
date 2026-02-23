"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import {
  pharmacyLicenseSchema,
  type PharmacyLicenseFormData,
} from "@/types/auth";
import { TextField, DateField } from "@/components/ui/fields";
import { cn } from "@/lib/utils";

export interface PharmacyLicenseFormProps {
  defaultValues?: Partial<PharmacyLicenseFormData>;
  onSubmit: (data: PharmacyLicenseFormData) => void;
  onBack: () => void;
  isLoading?: boolean;
}

/**
 * PharmacyLicenseForm - Step 2 of pharmacy sign-up
 * Fields: License Number, Expiry Date, Document Upload
 */
export function PharmacyLicenseForm({
  defaultValues,
  onSubmit,
  onBack,
  isLoading = false,
}: PharmacyLicenseFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PharmacyLicenseFormData>({
    resolver: zodResolver(pharmacyLicenseSchema),
    defaultValues: {
      licenseNumber: "",
      licenseExpiry: "",
      licenseDocUrl: "",
      ...defaultValues,
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
      {/* License Number */}
      <TextField
        id="licenseNumber"
        label="License Number"
        placeholder="Enter your license number"
        disabled={isLoading}
        error={errors.licenseNumber?.message}
        {...register("licenseNumber")}
      />

      {/* License Expiry Date */}
      <DateField
        id="licenseExpiry"
        label="License Expiry Date"
        disabled={isLoading}
        error={errors.licenseExpiry?.message}
        {...register("licenseExpiry")}
      />

      {/* License Document URL */}
      <TextField
        id="licenseDocUrl"
        label="License Document URL (Optional)"
        placeholder="https://example.com/license.pdf"
        disabled={isLoading}
        error={errors.licenseDocUrl?.message}
        {...register("licenseDocUrl")}
      />

      {/* Action Buttons */}
      <div className="flex gap-4 mt-2">
        <motion.button
          type="button"
          onClick={onBack}
          disabled={isLoading}
          className={cn(
            "flex-1 h-12 rounded-xl border-2 border-[#334eac] text-[#334eac] text-base font-semibold",
            "transition-all duration-200",
            "hover:bg-[#f8f9fc]",
            "disabled:opacity-50 disabled:cursor-not-allowed",
            "focus:outline-none focus:ring-2 focus:ring-[#334eac]/50 focus:ring-offset-2",
          )}
          whileTap={{ scale: isLoading ? 1 : 0.98 }}
        >
          Back
        </motion.button>
        <motion.button
          type="submit"
          disabled={isLoading}
          className={cn(
            "flex-1 h-12 rounded-xl bg-[#334eac] text-white text-base font-semibold",
            "transition-all duration-200",
            "hover:bg-[#2e469b] active:bg-[#283d87]",
            "disabled:opacity-50 disabled:cursor-not-allowed",
            "focus:outline-none focus:ring-2 focus:ring-[#334eac]/50 focus:ring-offset-2",
          )}
          whileTap={{ scale: isLoading ? 1 : 0.98 }}
        >
          {isLoading ? "Loading..." : "Next"}
        </motion.button>
      </div>
    </form>
  );
}
