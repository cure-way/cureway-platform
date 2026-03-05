"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { MotionTap } from "@/components/shared/MotionTap";
import { HistoryOrderCard, HistoryOrder } from "@/components/patient/history/HistoryOrderCard";
import { IconBack } from "@/components/patient/history/Icons";

export default function HistoryPage() {
  const router = useRouter();

  const orders: HistoryOrder[] = [
    {
      id: "#0325",
      pharmacyName: "Family Pharmacy",
      pharmacyMeta: "Gaza, (+970) 59-244-9634",
      fromLine1: "1852, Alkinz St.",
      fromLine2: "Al Naser area, Gaza",
      deliveredText: "Delivered on Dec 18, 2025 at 3:58 PM",
      productCountLabel: "Product type (4items)",
      quantityLabel: "Quantity",
      quantityValue: "x4",
      price: "21.48$",
    },
    {
      id: "#0325",
      pharmacyName: "Family Pharmacy",
      pharmacyMeta: "Gaza, (+970) 59-244-9634",
      fromLine1: "1852, Alkinz St.",
      fromLine2: "Al Naser area, Gaza",
      deliveredText: "Delivered on Dec 18, 2025 at 3:58 PM",
      productCountLabel: "Product type (4items)",
      quantityLabel: "Quantity",
      quantityValue: "x4",
      price: "21.48$",
    },
  ];

  return (
    <div className="w-full px-4 py-6">
      <div className="mx-auto w-full max-w-[1100px]">
        {/* Header: History + Back (يمين) */}
        <div className="mb-4 flex items-center justify-between">
          <div className="text-[48px] font-bold leading-[120%] text-black">
            History
          </div>

          <MotionTap
            as="button"
            onClick={() => router.back()}
            className="inline-flex items-center gap-2"
          >
            <IconBack />
            <span className="text-[24px] font-bold leading-[120%] text-[#1E2B57]">
              Back
            </span>
          </MotionTap>
        </div>

        {/* List */}
        <div className="flex flex-col gap-4">
          {orders.map((o, idx) => (
            <MotionTap key={idx} className="will-change-transform">
              <HistoryOrderCard
                order={o}
                onCopy={(id) => console.log("copy", id)}
                onReorder={(id) => console.log("reorder", id)}
                onShowDetails={(id) => console.log("show details", id)}
              />
            </MotionTap>
          ))}
        </div>
      </div>
    </div>
  );
}