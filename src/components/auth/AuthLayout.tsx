"use client";

import { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { MedicineIcon } from "@/components/shared/MedicineIcon";
import { ArrowLeft } from "lucide-react";
import { PageContainer } from "@/components/shared";

export interface AuthLayoutProps {
  children: ReactNode;
  showLogo?: boolean;
  showBackButton?: boolean;
  onBack?: () => void;
  backHref?: string;
}

export function AuthLayout({
  children,
  showLogo = true,
  showBackButton = false,
  onBack,
  backHref,
}: AuthLayoutProps) {
  const handleBack = () => {
    if (onBack) {
      onBack();
    } else if (backHref) {
      window.location.href = backHref;
    } else {
      window.history.back();
    }
  };

  return (
    <div className="flex w-full min-h-screen bg-white">
      {/* Left side - Medicine Icon */}
      <motion.div
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="hidden lg:flex w-1/2 h-screen items-center justify-center bg-[#7D7D7D] sticky top-0"
      >
        <MedicineIcon size={550} className="rounded-none" />
      </motion.div>

      {/* Right side - Content */}
      <div className="flex flex-col w-full lg:w-1/2 min-h-screen overflow-y-auto">
        <PageContainer
          variant="auth"
          className="flex flex-col items-center justify-center flex-1 gap-3.5"
        >
          <div className="w-full max-w-[34.5rem]">
            {/* Back Button */}
            {showBackButton && (
              <motion.button
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                onClick={handleBack}
                className="flex items-center gap-2 text-gray-700 hover:text-gray-900 transition-colors mb-8 group"
                aria-label="Go back"
              >
                <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                <span className="text-t-14 font-medium">Back</span>
              </motion.button>
            )}

            {/* Logo */}
            {showLogo && (
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
                    width={120}
                    height={64}
                    className="w-auto h-16 object-contain hover:opacity-80 transition-opacity"
                    priority
                  />
                </Link>
              </motion.div>
            )}

            {/* Main Content */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              {children}
            </motion.div>
          </div>
        </PageContainer>
      </div>
    </div>
  );
}
