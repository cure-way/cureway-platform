"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { ArrowLeft, Check } from "lucide-react";
import { resetPasswordSchema, type ResetPasswordFormData } from "@/types/auth";
import { AuthShell, AuthHero, PasswordRequirements } from "@/components/auth";
import { PasswordField } from "@/components/ui/fields";
import { usePasswordValidation } from "@/hooks";
import { cn } from "@/lib/utils";

function NewPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";
  const code = searchParams.get("code") || "";

  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isValid },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    mode: "onChange",
  });

  const password = watch("password", "");
  const validation = usePasswordValidation(password);

  const requirements = [
    { label: "At least 8 characters", met: validation.minLength },
    { label: "One uppercase letter", met: validation.hasUppercase },
    { label: "One number", met: validation.hasNumber },
    { label: "One special character", met: validation.hasSpecialChar },
  ];

  const onSubmit = async (data: ResetPasswordFormData) => {
    setIsLoading(true);

    try {
      // TODO: Implement actual password reset API
      await new Promise((resolve) => setTimeout(resolve, 1500));

      setIsSuccess(true);

      // Redirect to sign-in after 2 seconds
      setTimeout(() => {
        router.push("/auth/sign-in");
      }, 2000);
    } catch (error) {
      // TODO: handle error
    } finally {
      setIsLoading(false);
    }
  };

  const isButtonDisabled = !isValid || isLoading;

  if (isSuccess) {
    return (
      <AuthShell
        hero={
          <AuthHero
            imageSrc="/auth/image_1.jpg"
            title="Care Made Simple"
            subtitle="Clear options, verified pharmacies, and seamless ordering for better health."
            activeSlide={0}
          />
        }
      >
        <div className="flex flex-col min-h-full w-full">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center justify-center py-12"
          >
            <Link href="/">
              <Image
                src="/logo.png"
                alt="CureWay Logo"
                width={100}
                height={100}
                className="object-contain"
              />
            </Link>
          </motion.div>

          <div className="flex-1 flex flex-col items-center justify-center px-6 py-12">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="flex flex-col items-center gap-6 max-w-md text-center"
            >
              <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center">
                <Check className="w-10 h-10 text-green-600" />
              </div>
              <h1 className="text-2xl font-semibold text-black/80">
                Password Reset Successfully
              </h1>
              <p className="text-gray-600">
                Your password has been reset. You will be redirected to the
                sign-in page shortly.
              </p>
            </motion.div>
          </div>
        </div>
      </AuthShell>
    );
  }

  return (
    <AuthShell
      hero={
        <AuthHero
          imageSrc="/auth/image_1.jpg"
          title="Care Made Simple"
          subtitle="Clear options, verified pharmacies, and seamless ordering for better health."
          activeSlide={0}
        />
      }
    >
      <div className="flex flex-col min-h-full w-full">
        {/* Logo at top */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center justify-center py-12"
        >
          <Link href="/">
            <Image
              src="/logo.png"
              alt="CureWay Logo"
              width={100}
              height={100}
              className="object-contain"
            />
          </Link>
        </motion.div>

        {/* Main content */}
        <div className="flex-1 flex flex-col px-6 py-12">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="w-full max-w-[560px] mx-auto flex flex-col gap-8"
          >
            {/* Back button */}
            <button
              type="button"
              onClick={() => router.back()}
              className="flex items-center text-gray-600 hover:text-gray-900 transition-colors w-fit"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>

            {/* Title and description */}
            <div className="flex flex-col gap-2">
              <h1 className="text-2xl font-semibold text-black/80 leading-tight">
                Create New Password
              </h1>
              <p className="text-gray-600 text-base">
                Your new password must be different from your previous password.
              </p>
            </div>

            {/* Form */}
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="flex flex-col gap-5"
            >
              {/* New Password */}
              <PasswordField
                id="password"
                label="New Password"
                placeholder="Enter new password"
                disabled={isLoading}
                error={errors.password?.message}
                {...register("password")}
              />

              {/* Confirm Password */}
              <PasswordField
                id="confirmPassword"
                label="Confirm Password"
                placeholder="Confirm new password"
                disabled={isLoading}
                error={errors.confirmPassword?.message}
                {...register("confirmPassword")}
              />

              {/* Password Requirements */}
              <PasswordRequirements requirements={requirements} />

              {/* Submit Button */}
              <motion.button
                type="submit"
                disabled={isButtonDisabled}
                whileTap={{ scale: isButtonDisabled ? 1 : 0.98 }}
                className={cn(
                  "w-full h-[61px] rounded-3xl text-base font-semibold transition-all duration-200",
                  "flex items-center justify-center",
                  isButtonDisabled
                    ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                    : "bg-black text-white hover:bg-gray-800 active:bg-gray-900",
                )}
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Resetting...</span>
                  </div>
                ) : (
                  "Reset Password"
                )}
              </motion.button>
            </form>

            {/* Back to Sign In Link */}
            <div className="text-center">
              <Link
                href="/auth/sign-in"
                className="text-sm text-[#334eac] hover:underline font-medium"
              >
                Back to Sign In
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </AuthShell>
  );
}

export default function NewPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-dvh flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-[#334eac]/30 border-t-[#334eac] rounded-full animate-spin" />
        </div>
      }
    >
      <NewPasswordForm />
    </Suspense>
  );
}
