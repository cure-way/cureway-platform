"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { loginSchema, type LoginFormData } from "@/types/auth";
import {
  AuthShell,
  AuthHero,
  AuthDivider,
  SocialButton,
} from "@/components/auth";
import {
  TextField,
  PasswordField,
  CheckboxField,
} from "@/components/ui/fields";
import { Button } from "@/components/shared";
import { useAuth } from "@/features/auth";
import { normalizeError } from "@/lib/api";

/**
 * Pharmacy Sign In Page
 * Sign in form for pharmacy accounts
 */
export function PharmacySignInForm() {
  const router = useRouter();
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [globalError, setGlobalError] = useState("");

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: "onChange",
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    setGlobalError("");

    try {
      const res = await login({
        email: data.email,
        password: data.password,
      });

      // Redirect based on user role — use hard navigation for reliability
      const dest =
        res.user.role === "PHARMACY"
          ? "/pharmacy/home"
          : res.user.role === "ADMIN"
            ? "/admin/dashboard"
            : "/";

      router.push(dest);
    } catch (err) {
      const apiErr = normalizeError(err);

      // Map API field errors to react-hook-form
      if (apiErr.fieldErrors) {
        let hasFieldError = false;
        for (const [field, messages] of Object.entries(apiErr.fieldErrors)) {
          if (field === "email" || field === "password") {
            setError(field as keyof LoginFormData, {
              message: messages.join(". "),
            });
            hasFieldError = true;
          }
        }
        if (!hasFieldError) {
          setGlobalError(apiErr.message || "Login failed. Please try again.");
        }
      } else {
        setGlobalError(apiErr.message || "Login failed. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = () => {
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
      <div className="flex flex-col items-center justify-center flex-1 gap-6 px-6 py-12">
        <div className="w-full max-w-140">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex items-center justify-center mb-4"
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

          {/* Google Sign In */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mb-6"
          >
            <SocialButton
              provider="google"
              onClick={handleGoogleSignIn}
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
            <AuthDivider text="or continue with form" />
          </motion.div>

          {/* Login Form */}
          <motion.form
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.35 }}
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-6"
          >
            {/* Global Error */}
            {globalError && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3 rounded-xl bg-red-50 border border-red-200"
              >
                <p className="text-sm text-red-600 text-center">
                  {globalError}
                </p>
              </motion.div>
            )}

            {/* Email */}
            <TextField
              id="email"
              label="Email"
              type="email"
              placeholder="Enter your email"
              disabled={isLoading}
              error={errors.email?.message}
              {...register("email")}
            />

            {/* Password */}
            <PasswordField
              id="password"
              label="Password"
              placeholder="Enter your password"
              autoComplete="current-password"
              disabled={isLoading}
              error={errors.password?.message}
              {...register("password")}
            />

            <div className="flex items-center justify-between">
              <CheckboxField id="rememberMe" label="Remember me" />
              <Link
                href="/auth/forgot-password"
                className="text-sm text-[#334eac] hover:underline transition-colors"
              >
                Forgot password?
              </Link>
            </div>

            <Button
              type="submit"
              loading={isLoading}
              disabled={isLoading}
              className="bg-[#334eac] hover:bg-[#2e469b] text-white"
            >
              Sign in
            </Button>
          </motion.form>

          {/* Sign Up link */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-center mt-6 text-base"
          >
            <span className="text-[#797776]">Don&apos;t have an account? </span>
            <Link
              href="/auth/pharmacy/sign-up"
              className="text-[#334eac] font-medium hover:underline"
            >
              Sign Up
            </Link>
          </motion.p>
        </div>
      </div>
    </AuthShell>
  );
}
