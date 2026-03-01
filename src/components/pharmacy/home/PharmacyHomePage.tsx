"use client";

import OrdersSummaryCards from "@/components/pharmacy/home/OrdersSummaryCards";
import QuickActionCard from "@/components/pharmacy/home/QuickActionCard";
import OrdersCard from "@/components/pharmacy/home/OrdersCard";
import InventorySnapshot from "@/components/pharmacy/home/InventorySnapshot";
import PageHeader from "@/components/pharmacy/shared/PageHeader";
import { useOrdersSnapshot } from "@/hooks/pharmacy/useOrdersSnapshot";
import { OrderFilter } from "@/types/pharmacyOrders";
import { useState } from "react";
import { useTodayDashboardAnalytics } from "@/hooks/pharmacy/useTodayOrdersSummary";

export default function PharmacyHomePage() {
  const [status, setStatus] = useState<OrderFilter>();

  const { data: orders, loading, error } = useOrdersSnapshot(status);
  const { data: summary, loading: summaryLoading } =
    useTodayDashboardAnalytics();

  return (
    <div className="gap-6 grid lg:grid-cols-[1fr_320px]">
      <div>
        <PageHeader title="Pharmacy Home" />
        <OrdersSummaryCards summary={summary} summaryLoading={summaryLoading} />
        <OrdersCard
          data={orders}
          loading={loading}
          error={error}
          status={status}
          setStatus={setStatus}
        />
        <InventorySnapshot />
      </div>
      <QuickActionCard topMedicine={summary?.topMedicineName} />
    </div>
  );
}
