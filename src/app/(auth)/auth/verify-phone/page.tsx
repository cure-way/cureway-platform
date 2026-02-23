"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { AuthShell, AuthHero } from "@/components/auth";
import { PhoneField } from "@/components/shared";
import { cn } from "@/lib/utils";

export default function VerifyPhonePage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [country, setCountry] = useState<
    "PS" | "IL" | "JO" | "EG" | "SA" | "AE" | "US" | "GB"
  >("PS");

  const handleSendCode = async () => {
    if (!phoneNumber.trim()) return;

    setIsLoading(true);
    try {
      // TODO: Implement send verification code API
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Navigate to OTP verification page
      router.push("/auth/verify-otp");
    } catch (error) {
      // TODO: handle error
    } finally {
      setIsLoading(false);
    }
  };

  const isButtonDisabled = !phoneNumber.trim() || isLoading;

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
        <div className="flex-1 flex flex-col items-center px-6 py-12">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="w-full max-w-[560px] flex flex-col gap-8"
          >
            {/* Title and description */}
            <div className="flex flex-col gap-2">
              <h1 className="text-2xl font-semibold text-black/80 leading-tight">
                What phone number would you like to use?
              </h1>
              <p className="text-base text-[#5b5958]">
                we will send you a Verification to this number
              </p>
            </div>

            {/* Phone input */}
            <PhoneField
              value={phoneNumber}
              onChange={setPhoneNumber}
              country={country}
              onCountryChange={(c) => setCountry(c as typeof country)}
              disabled={isLoading}
              placeholder="Enter phone number"
            />

            {/* Send Code Button */}
            <motion.button
              type="button"
              onClick={handleSendCode}
              disabled={isButtonDisabled}
              className={cn(
                "w-full max-w-[358px] mx-auto h-14 rounded-xl text-lg font-medium text-white",
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
          </motion.div>
        </div>
      </div>
    </AuthShell>
  );
}
