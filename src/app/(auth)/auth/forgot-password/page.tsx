"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import {
  forgotPasswordSchema,
  type ForgotPasswordFormData,
} from "@/types/auth";
import { AuthShell, AuthHero } from "@/components/auth";
import { TextField } from "@/components/ui/fields";
import { cn } from "@/lib/utils";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    mode: "onChange",
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    setIsLoading(true);

    try {
      // TODO: Implement actual API call
      await new Promise((resolve) => setTimeout(resolve, 1500));
      // Navigate to verify page with email
      router.push(
        `/auth/forgot-password/verify?email=${encodeURIComponent(data.email)}`,
      );
    } catch (error) {
      // TODO: handle error
    } finally {
      setIsLoading(false);
    }
  };

  const isButtonDisabled = !isValid || isLoading;

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
              onClick={() => router.back()}
              className="flex items-center text-gray-600 hover:text-gray-900 transition-colors w-fit"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>

            {/* Title and description */}
            <div className="flex flex-col gap-2">
              <h1 className="text-2xl font-semibold text-black/80 leading-tight">
                Forget Your Password
              </h1>
              <p className="text-base text-[#5b5958]">
                Please write your email to receive a confirmation code to set a
                new password.
              </p>
            </div>

            {/* Form */}
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="flex flex-col gap-6"
            >
              {/* Email Input */}
              <TextField
                id="email"
                type="email"
                placeholder="sondoosql66@gmail.com"
                autoComplete="email"
                disabled={isLoading}
                error={errors.email?.message}
                {...register("email")}
              />

              {/* Send Code Button */}
              <motion.button
                type="submit"
                disabled={isButtonDisabled}
                className={cn(
                  "w-full h-14 rounded-xl text-lg font-medium text-white",
                  "transition-all duration-200",
                  "focus:outline-none focus:ring-2 focus:ring-[#334eac]/50 focus:ring-offset-2",
                  isButtonDisabled
                    ? "bg-[#c0c8e5] cursor-not-allowed"
                    : "bg-[#334eac] hover:bg-[#2e469b] active:bg-[#283d87]",
                )}
                whileTap={{ scale: isButtonDisabled ? 1 : 0.98 }}
              >
                {isLoading ? "Sending..." : "Send Code"}
              </motion.button>
            </form>
          </motion.div>
        </div>
      </div>
    </AuthShell>
  );
}
