"use client";

import { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export interface AuthCardProps {
  children: ReactNode;
  /** Show the CureWay logo */
  showLogo?: boolean;
  /** Main title text */
  title?: string;
  /** Subtitle/tagline */
  subtitle?: string;
  /** Additional className for the card container */
  className?: string;
}

/**
 * AuthCard - Right side content container for auth pages
 * Contains: Logo, welcome text, and form content
 */
export function AuthCard({
  children,
  showLogo = true,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  title = "Welcome To CUREWAY",
  subtitle = "Your trusted way to better health",
  className,
}: AuthCardProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center flex-1 gap-6 px-6 py-12 overflow-y-auto",
        className,
      )}
    >
      <div className="w-full max-w-[560px]">
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
                width={100}
                height={100}
                className="w-[100px] h-[100px] object-contain hover:opacity-80 transition-opacity"
                priority
              />
            </Link>
          </motion.div>
        )}

        {/* Welcome Text */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="flex flex-col gap-2 items-center text-center mb-6"
        >
          <h1 className="text-page-title">
            <span className="text-[#2e469b]">Welcome To </span>
            <span className="text-[#334eac] font-bold">CUREWAY</span>
          </h1>
          <p className="text-t-17 font-medium text-[#334eac]">{subtitle}</p>
        </motion.div>

        {/* Main Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          {children}
        </motion.div>
      </div>
    </div>
  );
}
