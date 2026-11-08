"use client";

import { motion } from "framer-motion";
import { Pencil, FileText, User, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import type { PharmacySignUpStep } from "@/types/auth";

export interface PharmacyStepperProps {
  currentStep: PharmacySignUpStep;
  className?: string;
}

interface StepConfig {
  id: PharmacySignUpStep;
  label: string;
  icon: React.ReactNode;
}

const steps: StepConfig[] = [
  {
    id: "pharmacy-info",
    label: "Pharmacy Information",
    icon: <Pencil className="w-5 h-5" />,
  },
  {
    id: "license",
    label: "License",
    icon: <FileText className="w-5 h-5" />,
  },
  {
    id: "account",
    label: "Account",
    icon: <User className="w-5 h-5" />,
  },
];

/**
 * PharmacyStepper - Visual step indicator for pharmacy sign-up flow
 * Shows: Pharmacy Information → License → Account
 * Features: Circular icons with connecting lines, active/completed states
 */
export function PharmacyStepper({
  currentStep,
  className,
}: PharmacyStepperProps) {
  const currentStepIndex = steps.findIndex((s) => s.id === currentStep);

  return (
    <div
      className={cn(
        "flex items-start justify-center p-4 border border-[#efeded] rounded-2xl bg-white",
        className,
      )}
    >
      {steps.map((step, index) => {
        const isActive = step.id === currentStep;
        const isCompleted = index < currentStepIndex;
        const isLast = index === steps.length - 1;

        return (
          <div key={step.id} className="flex items-start">
            {/* Step Item */}
            <motion.div
              className="flex flex-col items-center gap-3"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              {/* Icon Container */}
              <div
                className={cn(
                  "w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300",
                  isActive
                    ? "bg-[#334eac] text-white shadow-md shadow-[#334eac]/30"
                    : isCompleted
                      ? "bg-[#334eac] text-white"
                      : "bg-[#f3f4f6] text-[#797776]",
                )}
              >
                {isCompleted ? <Check className="w-5 h-5" /> : step.icon}
              </div>

              {/* Label */}
              <span
                className={cn(
                  "text-t-14 font-medium text-center transition-colors max-w-[100px]",
                  isActive || isCompleted ? "text-[#334eac]" : "text-[#797776]",
                )}
              >
                {step.label}
              </span>
            </motion.div>

            {/* Connector Line */}
            {!isLast && (
              <div className="flex items-center h-12 px-2">
                <div
                  className={cn(
                    "w-16 h-0.5 transition-colors duration-300",
                    index < currentStepIndex ? "bg-[#334eac]" : "bg-[#e5e7eb]",
                  )}
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
