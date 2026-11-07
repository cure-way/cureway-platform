"use client";

import React from "react";
import { MotionTap } from "@/components/shared/MotionTap";
import { PageContainer, PageHeader } from "@/components/shared";
import {
  HistoryOrderCard,
  HistoryOrder,
} from "@/components/patient/history/HistoryOrderCard";

export default function HistoryPage() {
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
    <PageContainer variant="account">
      <PageHeader
        title="History"
        subtitle="Medicines you have ordered before"
        showBack
        backHref="/profile"
      />

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
    </PageContainer>
  );
}
