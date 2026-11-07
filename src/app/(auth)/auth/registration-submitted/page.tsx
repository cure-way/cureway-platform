"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { AuthShell, AuthHero } from "@/components/auth";
import { cn } from "@/lib/utils";

export default function RegistrationSubmittedPage() {
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
          <Image
            src="/logo.png"
            alt="CureWay Logo"
            width={100}
            height={100}
            className="object-contain"
          />
        </motion.div>

        {/* Main content - centered */}
        <div className="flex-1 flex flex-col items-center justify-center px-6 py-12">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex flex-col items-center gap-6 max-w-md"
          >
            {/* Verification Illustration */}
            <div className="relative w-[283px] h-[284px]">
              <Image
                src="/auth/confirm-registering.png"
                alt="Document verification illustration"
                fill
                className="object-contain"
              />
            </div>

            {/* Text Content */}
            <div className="flex flex-col items-center gap-4 text-center">
              <h1 className="text-page-title text-[#5b5958] leading-tight">
                Thanks for Registering
              </h1>
              <p className="text-t-17 font-medium text-[#5b5958] leading-snug">
                Our team will review your documents
                <br />
                and notify you once your account is approved
              </p>
            </div>

            {/* Continue Button */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.4 }}
              className="w-full max-w-[358px] mt-6"
            >
              <Link
                href="/auth/sign-in"
                className={cn(
                  "flex items-center justify-center w-full h-12 rounded-xl",
                  "bg-[#334eac] text-white text-t-17 font-medium",
                  "transition-all duration-200",
                  "hover:bg-[#2e469b] active:bg-[#283d87]",
                  "focus:outline-none focus:ring-2 focus:ring-[#334eac]/50 focus:ring-offset-2",
                )}
              >
                Continue
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </AuthShell>
  );
}
