"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import Link from "next/link";
import { z } from "zod";
import {
  TextField,
  PasswordField,
  CheckboxField,
} from "@/components/ui/fields";
import { cn } from "@/lib/utils";

// Extended schema with agreement checkbox
const pharmacyAccountFormSchema = z
  .object({
    email: z
      .string()
      .min(1, "Email is required")
      .email("Please enter a valid email"),
    password: z
      .string()
      .min(1, "Password is required")
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Must contain uppercase letter")
      .regex(/[0-9]/, "Must contain a number")
      .regex(/[!@#$%^&*(),.?":{}|<>]/, "Must contain special character"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
    agreedToTerms: z.boolean().refine((val) => val === true, {
      message: "You must agree to the terms and conditions",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type PharmacyAccountFormValues = z.infer<typeof pharmacyAccountFormSchema>;

export interface PharmacyAccountFormProps {
  defaultValues?: Partial<PharmacyAccountFormValues>;
  onSubmit: (data: PharmacyAccountFormValues) => void;
  onBack: () => void;
  isLoading?: boolean;
}

/**
 * PharmacyAccountForm - Step 3 of pharmacy sign-up
 * Fields: Email, Password, Confirm Password, Terms Checkbox
 */
export function PharmacyAccountForm({
  defaultValues,
  onSubmit,
  onBack,
  isLoading = false,
}: PharmacyAccountFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PharmacyAccountFormValues>({
    resolver: zodResolver(pharmacyAccountFormSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
      agreedToTerms: false,
      ...defaultValues,
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
      {/* Email */}
      <TextField
        id="email"
        type="email"
        label="Email Address"
        placeholder="Enter your email address"
        autoComplete="email"
        disabled={isLoading}
        error={errors.email?.message}
        {...register("email")}
      />

      {/* Password */}
      <PasswordField
        id="password"
        label="Password"
        placeholder="Create a strong password"
        autoComplete="new-password"
        disabled={isLoading}
        error={errors.password?.message}
        {...register("password")}
      />

      {/* Confirm Password */}
      <PasswordField
        id="confirmPassword"
        label="Confirm Password"
        placeholder="Confirm your password"
        autoComplete="new-password"
        disabled={isLoading}
        error={errors.confirmPassword?.message}
        {...register("confirmPassword")}
      />

      {/* Terms & Conditions Checkbox */}
      <CheckboxField
        id="agreedToTerms"
        disabled={isLoading}
        error={errors.agreedToTerms?.message}
        label={
          <>
            By continuing, I agree to the{" "}
            <Link
              href="/terms"
              className="text-[#334eac] font-medium hover:underline"
            >
              Terms & Conditions
            </Link>{" "}
            and{" "}
            <Link
              href="/privacy"
              className="text-[#334eac] font-medium hover:underline"
            >
              Privacy Policy
            </Link>
          </>
        }
        {...register("agreedToTerms")}
      />

      {/* Action Buttons */}
      <div className="flex gap-4 mt-2">
        <motion.button
          type="button"
          onClick={onBack}
          disabled={isLoading}
          className={cn(
            "flex-1 h-12 rounded-xl border-2 border-[#334eac] text-[#334eac] text-t-14 font-medium",
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
            "flex-1 h-12 rounded-xl bg-[#334eac] text-white text-t-14 font-medium",
            "transition-all duration-200",
            "hover:bg-[#2e469b] active:bg-[#283d87]",
            "disabled:opacity-50 disabled:cursor-not-allowed",
            "focus:outline-none focus:ring-2 focus:ring-[#334eac]/50 focus:ring-offset-2",
          )}
          whileTap={{ scale: isLoading ? 1 : 0.98 }}
        >
          {isLoading ? "Submitting..." : "Submit Registration Request"}
        </motion.button>
      </div>
    </form>
  );
}
