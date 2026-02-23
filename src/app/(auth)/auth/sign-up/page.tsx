"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { z } from "zod";
import { isValidPhoneNumber } from "libphonenumber-js";
import {
  AuthShell,
  AuthHero,
  AuthDivider,
  SocialButton,
  AuthUserTypeSwitch,
  type UserType,
} from "@/components/auth";
import {
  TextField,
  PasswordField,
  CheckboxField,
  PhoneField,
} from "@/components/ui/fields";
import { Button } from "@/components/shared";
import { useAuth } from "@/features/auth";
import { normalizeError } from "@/lib/api";
import { registerPatient } from "@/features/auth";

// Simple sign-up schema for the form
const signUpSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    phoneNumber: z
      .string()
      .min(1, "Phone number is required")
      .refine(
        (v) => {
          try {
            return isValidPhoneNumber(v);
          } catch {
            return false;
          }
        },
        { message: "Please enter a valid phone number" },
      ),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
    agreedToPersonalData: z.boolean(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  })
  .refine((data) => data.agreedToPersonalData === true, {
    message: "You must agree to the processing of personal data",
    path: ["agreedToPersonalData"],
  });

type SignUpFormData = z.infer<typeof signUpSchema>;

export default function SignUpPage() {
  const router = useRouter();
  const { setSession } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [globalError, setGlobalError] = useState("");
  const [userType, setUserType] = useState<UserType>("patient");
  const [localPhone, setLocalPhone] = useState("");

  const {
    register,
    handleSubmit,
    control,
    setError,
    formState: { errors },
  } = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
    mode: "onChange",
  });

  // Handle user type switch
  const handleUserTypeChange = (type: UserType) => {
    setUserType(type);
    if (type === "pharmacist") {
      router.push("/auth/pharmacy/sign-up");
    }
  };

  const onSubmit = async (data: SignUpFormData) => {
    setIsLoading(true);
    setGlobalError("");

    try {
      const res = await registerPatient({
        name: data.name,
        email: data.email,
        phoneNumber: data.phoneNumber,
        password: data.password,
      });

      // Update auth context with the new user
      setSession(res.user, res.profile);

      // On success, redirect to verification or dashboard
      router.push("/auth/verify-phone");
    } catch (err) {
      const apiErr = normalizeError(err);

      // Map API field errors to react-hook-form
      if (apiErr.fieldErrors) {
        const formFields: (keyof SignUpFormData)[] = [
          "name",
          "email",
          "phoneNumber",
          "password",
        ];
        let hasFieldError = false;
        for (const [field, messages] of Object.entries(apiErr.fieldErrors)) {
          if (formFields.includes(field as keyof SignUpFormData)) {
            setError(field as keyof SignUpFormData, {
              message: messages.join(". "),
            });
            hasFieldError = true;
          }
        }
        if (!hasFieldError) {
          setGlobalError(apiErr.message);
        }
      } else {
        setGlobalError(apiErr.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignUp = () => {
    // TODO: Implement Google OAuth
  };

  return (
    <AuthShell
      hero={
        <AuthHero
          imageSrc="/auth/image_1.jpg"
          title="Your Health Our Priority"
          subtitle="Trusted access to the medicine you need safely and effortlessly."
        />
      }
    >
      <div className="flex flex-col items-center justify-center flex-1 gap-8 px-6 py-12">
        <div className="w-full max-w-140">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex items-center justify-center mb-6"
          >
            <Link href="/">
              <Image
                src="/logo.png"
                alt="CureWay Logo"
                width={100}
                height={100}
                className="w-25 h-25 object-contain hover:opacity-80 transition-opacity"
                priority
              />
            </Link>
          </motion.div>

          {/* Welcome Text */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="flex flex-col gap-2 items-center text-center mb-6"
          >
            <h1 className="text-4xl font-semibold">
              <span className="text-[#2e469b]">Welcome To </span>
              <span className="text-[#334eac] font-bold">CUREWAY</span>
            </h1>
            <p className="text-lg font-medium text-[#334eac]">
              Your trusted way to better health
            </p>
          </motion.div>

          {/* Google Sign Up */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mb-6"
          >
            <SocialButton
              provider="google"
              onClick={handleGoogleSignUp}
              disabled={isLoading}
            />
          </motion.div>

          {/* Divider */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.25 }}
            className="mb-6"
          >
            <AuthDivider text="or Sign up with your email" />
          </motion.div>

          {/* User Type Switch */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mb-8"
          >
            <AuthUserTypeSwitch
              value={userType}
              onChange={handleUserTypeChange}
            />
          </motion.div>

          {/* Form */}
          <motion.form
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.35 }}
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-4"
          >
            {globalError && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3 bg-red-50 border border-red-200 rounded-lg"
              >
                <p className="text-sm text-red-600">{globalError}</p>
              </motion.div>
            )}

            <TextField
              label="Name"
              type="text"
              placeholder="Enter your full name"
              autoComplete="name"
              error={errors.name?.message}
              {...register("name")}
            />

            <TextField
              label="Email"
              type="email"
              placeholder="Enter your email"
              autoComplete="email"
              error={errors.email?.message}
              {...register("email")}
            />

            <Controller
              name="phoneNumber"
              control={control}
              render={({ field }) => (
                <PhoneField
                  label="Phone Number"
                  id="phoneNumber"
                  value={localPhone}
                  onChange={(val) => setLocalPhone(val)}
                  onFullValueChange={(v) => {
                    setLocalPhone(v.number);
                    // Store the full international number (e.g. +970598895851)
                    const digits = v.number
                      .replace(/[\s-]/g, "")
                      .replace(/^0+/, "");
                    field.onChange(`${v.dialCode}${digits}`);
                  }}
                  placeholder="Enter phone number"
                  error={errors.phoneNumber?.message}
                />
              )}
            />

            <PasswordField
              label="Password"
              placeholder="Enter your Password"
              autoComplete="new-password"
              error={errors.password?.message}
              {...register("password")}
            />

            <PasswordField
              label="Confirm password"
              placeholder="Confirm your Password"
              autoComplete="new-password"
              error={errors.confirmPassword?.message}
              {...register("confirmPassword")}
            />

            <CheckboxField
              label={
                <>
                  I agree to the processing of{" "}
                  <Link
                    href="/privacy"
                    className="text-[#334eac] hover:underline"
                  >
                    Personal data
                  </Link>
                </>
              }
              error={errors.agreedToPersonalData?.message}
              {...register("agreedToPersonalData")}
            />

            <Button
              type="submit"
              loading={isLoading}
              disabled={isLoading}
              className="bg-[#334eac] hover:bg-[#2e469b] text-white h-14 mt-2"
            >
              Sign Up
            </Button>
          </motion.form>

          {/* Sign in link */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.35 }}
            className="text-center mt-4 text-base font-semibold"
          >
            <span className="text-[#797776]">Already have an account? </span>
            <Link
              href="/auth/sign-in"
              className="text-[#334eac] hover:underline"
            >
              Login Here
            </Link>
          </motion.p>
        </div>
      </div>
    </AuthShell>
  );
}
