// ===================================================================
// ORDER TRACKING COMPONENT
// ===================================================================
"use client";


import { motion } from "framer-motion";
import { Check, Package, Truck,  } from "lucide-react";


import {  formatDate } from "../../utils/cart.utils";


interface OrderTrackingProps {
  orderId: string;
  status: "pending" | "confirmed" | "processing" | "shipped" | "delivered";
  estimatedDelivery?: Date;
}

export function OrderTracking({
  orderId,
  status,
  estimatedDelivery,
}: OrderTrackingProps) {
  const steps = [
    { key: "confirmed", label: "Order Confirmed", icon: Check },
    { key: "processing", label: "Processing", icon: Package },
    { key: "shipped", label: "Out for Delivery", icon: Truck },
    { key: "delivered", label: "Delivered", icon: Check },
  ];

  const currentStepIndex = steps.findIndex((step) => step.key === status);

  return (
    <div className="bg-white rounded-xl border border-border p-6">
      <h2 className="text-t-21 font-bold text-foreground mb-6">
        Track Order #{orderId}
      </h2>

      {/* Progress Steps */}
      <div className="relative">
        {/* Progress Line */}
        <div className="absolute left-6 top-6 bottom-6 w-0.5 bg-neutral-light" />
        <div
          className="absolute left-6 top-6 w-0.5 bg-primary transition-all duration-500"
          style={{
            height: `${(currentStepIndex / (steps.length - 1)) * 100}%`,
          }}
        />

        {/* Steps */}
        <div className="relative space-y-8">
          {steps.map((step, index) => {
            const isCompleted = index <= currentStepIndex;
            const isCurrent = index === currentStepIndex;
            const Icon = step.icon;

            return (
              <div key={step.key} className="flex items-start gap-4">
                {/* Icon */}
                <div
                  className={`relative w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 transition-all ${
                    isCompleted
                      ? "bg-primary"
                      : "bg-neutral-light border-2 border-border"
                  }`}
                >
                  <Icon
                    size={20}
                    className={isCompleted ? "text-white" : "text-muted-foreground"}
                  />
                  {isCurrent && (
                    <motion.div
                      className="absolute inset-0 rounded-full border-2 border-primary"
                      animate={{
                        scale: [1, 1.2, 1],
                        opacity: [1, 0, 1],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                      }}
                    />
                  )}
                </div>

                {/* Label */}
                <div className="flex-1 pt-2">
                  <p
                    className={`text-t-17 font-semibold ${
                      isCompleted ? "text-foreground" : "text-muted-foreground"
                    }`}
                  >
                    {step.label}
                  </p>
                  {isCurrent && estimatedDelivery && (
                    <p className="text-t-12 text-muted-foreground mt-1">
                      Estimated: {formatDate(estimatedDelivery, "long")}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}