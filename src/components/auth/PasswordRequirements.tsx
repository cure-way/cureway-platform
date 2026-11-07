"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";

export interface PasswordRequirement {
  label: string;
  met: boolean;
}

export interface PasswordRequirementsProps {
  requirements: PasswordRequirement[];
}

export function PasswordRequirements({
  requirements,
}: PasswordRequirementsProps) {
  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      className="flex flex-col gap-2 p-3 bg-gray-50 rounded-lg"
    >
      <p className="text-t-12 font-medium text-gray-700 mb-1">
        Password must contain:
      </p>
      {requirements.map((req, index) => (
        <motion.div
          key={req.label}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.05 }}
          className="flex items-center gap-2"
        >
          <div
            className={`flex items-center justify-center w-4 h-4 rounded-full transition-colors ${
              req.met ? "bg-green-500" : "bg-gray-300"
            }`}
          >
            {req.met && <Check className="w-3 h-3 text-white" />}
          </div>
          <span
            className={`text-t-12 ${req.met ? "text-green-700" : "text-gray-600"}`}
          >
            {req.label}
          </span>
        </motion.div>
      ))}
    </motion.div>
  );
}
