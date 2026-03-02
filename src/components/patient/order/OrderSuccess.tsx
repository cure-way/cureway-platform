"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";

// ===================================================================
// ORDER SUCCESS — Animated checkmark for the confirmation page
// ===================================================================

export function OrderSuccess() {
  return (
    <div className="text-center mb-8">
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 20, delay: 0.1 }}
        className="inline-flex items-center justify-center w-24 h-24 bg-success rounded-full mx-auto mb-6"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.3, type: "spring" }}
        >
          <Check size={48} className="text-white" strokeWidth={3} />
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <h2 className="text-t-30 font-bold text-primary mb-2">
          Order Placed Successfully!
        </h2>
        <p className="text-t-17 text-muted-foreground">
          Thank you for your order. We&apos;ll notify you when it&apos;s on the
          way.
        </p>
      </motion.div>
    </div>
  );
}
