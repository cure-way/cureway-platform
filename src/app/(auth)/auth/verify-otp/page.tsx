"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { AuthShell, AuthHero } from "@/components/auth";
import { OTPInput } from "@/components/shared";
import { cn } from "@/lib/utils";

function VerifyOTPForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const phoneNumber = searchParams.get("phone") || "+9705365265";

  const [isLoading, setIsLoading] = useState(false);
  const [otp, setOtp] = useState<string[]>(Array(6).fill(""));
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);

  // Countdown timer for resend
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [countdown]);

  const handleVerify = async (code: string) => {
    if (code.length !== 6) return;

    setIsLoading(true);
    try {
      // TODO: Implement actual OTP verification API
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // On success, redirect to home or dashboard
      router.push("/");
    } catch (error) {
      // TODO: handle error
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    if (!canResend) return;

    setCanResend(false);
    setCountdown(60);
    setOtp(Array(6).fill(""));

    try {
      // TODO: Implement resend OTP API
      await new Promise((resolve) => setTimeout(resolve, 1000));
    } catch (error) {
      setCanResend(true);
    }
  };

  const isButtonDisabled = otp.join("").length !== 6 || isLoading;

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
                Verify your phone number
              </h1>
              <p className="text-base text-[#5b5958]">
                Please enter that code we sent to {phoneNumber}
              </p>
            </div>

            {/* OTP Input - Using shared component */}
            <OTPInput
              length={6}
              value={otp}
              onChange={setOtp}
              onComplete={handleVerify}
              disabled={isLoading}
              autoFocus
            />

            {/* Verify Button */}
            <div className="flex flex-col items-center gap-4">
              <motion.button
                type="button"
                onClick={() => handleVerify(otp.join(""))}
                disabled={isButtonDisabled}
                className={cn(
                  "w-full max-w-[358px] h-14 rounded-xl text-lg font-medium text-white",
                  "transition-all duration-200",
                  "focus:outline-none focus:ring-2 focus:ring-[#334eac]/50 focus:ring-offset-2",
                  isButtonDisabled
                    ? "bg-[#c0c8e5] cursor-not-allowed"
                    : "bg-[#334eac] hover:bg-[#2e469b] active:bg-[#283d87]",
                )}
                whileTap={{ scale: isButtonDisabled ? 1 : 0.98 }}
              >
                {isLoading ? "Verifying..." : "Verify"}
              </motion.button>

              {/* Resend link */}
              <p className="text-base text-center">
                <span className="text-[#797776]">
                  Didn&apos;t get the code?{" "}
                </span>
                <button
                  type="button"
                  onClick={handleResend}
                  disabled={!canResend}
                  className={cn(
                    "font-semibold transition-colors",
                    canResend
                      ? "text-[#334eac] hover:underline cursor-pointer"
                      : "text-gray-400 cursor-not-allowed",
                  )}
                >
                  {canResend ? "Resend it" : `Resend in ${countdown}s`}
                </button>
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </AuthShell>
  );
}

export default function VerifyOtpPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-dvh flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-[#334eac]/30 border-t-[#334eac] rounded-full animate-spin" />
        </div>
      }
    >
      <VerifyOTPForm />
    </Suspense>
  );
}
