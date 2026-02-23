import { z } from "zod";
import { isValidPhoneNumber } from "libphonenumber-js";

// ===========================
// Form Validation Schemas
// ===========================

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),
  password: z
    .string()
    .min(1, "Password is required")
    .min(8, "Password must be at least 8 characters"),
});

export const registerSchema = z
  .object({
    email: z
      .string()
      .min(1, "Email is required")
      .email("Please enter a valid email address"),
    password: z
      .string()
      .min(1, "Password is required")
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[0-9]/, "Password must contain at least one number")
      .regex(
        /[!@#$%^&*(),.?":{}|<>]/,
        "Password must contain at least one special character",
      ),
    confirmPassword: z.string().min(1, "Please confirm your password"),
    phone: z
      .string()
      .min(1, "Phone number is required")
      .refine(
        (value) => {
          try {
            return isValidPhoneNumber(value);
          } catch {
            return false;
          }
        },
        { message: "Please enter a valid phone number" },
      ),
    agreedToTerms: z.boolean().refine((val) => val === true, {
      message: "You must agree to the terms and conditions",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const forgotPasswordSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),
});

export const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(1, "Password is required")
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[0-9]/, "Password must contain at least one number")
      .regex(
        /[!@#$%^&*(),.?":{}|<>]/,
        "Password must contain at least one special character",
      ),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const otpSchema = z.object({
  code: z
    .string()
    .min(4, "Code must be at least 4 digits")
    .max(6, "Code must be at most 6 digits")
    .regex(/^\d+$/, "Code must contain only numbers"),
});

// ===========================
// TypeScript Types
// ===========================

export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;
export type OTPFormData = z.infer<typeof otpSchema>;

// ===========================
// Auth State Types
// ===========================

export type AuthStep = "form" | "emailVerify" | "phoneVerify" | "success";

export interface PasswordValidation {
  minLength: boolean;
  hasUppercase: boolean;
  hasNumber: boolean;
  hasSpecialChar: boolean;
}

export interface User {
  id: string;
  email: string;
  phone?: string;
  name?: string;
  emailVerified: boolean;
  phoneVerified: boolean;
}

// ===========================
// Role-Based Auth Types (CureWay)
// ===========================

/**
 * User roles in the CureWay platform
 */
export type UserRole = "patient" | "pharmacy" | "admin";

/**
 * Extended user with role information
 */
export interface CureWayUser extends User {
  firstName: string;
  lastName: string;
  role: UserRole;
  isVerified: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  // Role-specific fields
  pharmacyId?: string;
  pharmacyName?: string;
}

// ===========================
// Pharmacy Sign-Up Multi-Step Types
// ===========================

/**
 * Pharmacy sign-up step identifiers
 */
export type PharmacySignUpStep = "pharmacy-info" | "license" | "account";

/**
 * Pharmacy Information (Step 1)
 */
export const pharmacyInfoSchema = z.object({
  pharmacyName: z
    .string()
    .min(1, "Pharmacy name is required")
    .min(2, "Pharmacy name must be at least 2 characters"),
  pharmacyNumber: z
    .string()
    .min(1, "Pharmacy number is required")
    .regex(/^\+?[\d\s-]{7,}$/, "Please enter a valid phone number"),
  pharmacyAddress: z
    .string()
    .min(1, "Pharmacy address is required")
    .min(5, "Please enter a complete address"),
  pharmacyCity: z.string().min(1, "City is required"),
});

/**
 * Pharmacy License (Step 2)
 */
export const pharmacyLicenseSchema = z.object({
  licenseNumber: z
    .string()
    .min(1, "License number is required")
    .min(4, "License number must be at least 4 characters"),
  licenseExpiry: z.string().min(1, "License expiry date is required"),
  licenseDocUrl: z
    .string()
    .url("Please enter a valid URL (e.g. https://...)")
    .or(z.literal(""))
    .optional(),
});

/**
 * Pharmacy Account (Step 3)
 */
export const pharmacyAccountSchema = z
  .object({
    ownerName: z
      .string()
      .min(1, "Owner name is required")
      .min(2, "Name must be at least 2 characters"),
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
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

// Combined pharmacy sign-up schema
export const pharmacySignUpSchema = z.object({
  pharmacyInfo: pharmacyInfoSchema,
  license: pharmacyLicenseSchema,
  account: pharmacyAccountSchema,
});

// Type exports for pharmacy sign-up
export type PharmacyInfoFormData = z.infer<typeof pharmacyInfoSchema>;
export type PharmacyLicenseFormData = z.infer<typeof pharmacyLicenseSchema>;
export type PharmacyAccountFormData = z.infer<typeof pharmacyAccountSchema>;
export type PharmacySignUpFormData = z.infer<typeof pharmacySignUpSchema>;

/**
 * Pharmacy sign-up state for multi-step form
 */
export interface PharmacySignUpState {
  currentStep: PharmacySignUpStep;
  pharmacyInfo: Partial<PharmacyInfoFormData>;
  license: Partial<PharmacyLicenseFormData>;
  account: Partial<PharmacyAccountFormData>;
  isSubmitting: boolean;
  error?: string;
}
