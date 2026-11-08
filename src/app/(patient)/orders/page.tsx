"use client";
import { useMemo, useState, useEffect } from "react";
import { type OrdersTabKey } from "@/components/patient/orders/OrdersTabs";
import { OrdersList } from "@/components/patient/orders/OrdersList";
import { useOrderStore } from "@/store/order.store";
import type { Order } from "@/types/order";
import ErrorMessage from "@/components/shared/ErrorMessage";
import { PageContainer, PageHeader } from "@/components/shared";

function filterByTab(tab: OrdersTabKey, orders: Order[]) {
  if (tab === "all") return orders;
  if (tab === "active")
    return orders.filter(
      (o) => o.status === "processing" || o.status === "on_the_way",
    );
  if (tab === "delivered")
    return orders.filter((o) => o.status === "delivered");
  if (tab === "cancelled")
    return orders.filter((o) => o.status === "cancelled");
  return orders;
}

export default function OrdersPage() {
  const { orders, loading, error, fetchOrders } = useOrderStore();
  const [activeTab, setActiveTab] = useState<OrdersTabKey>("all");

  // Always re-fetch from the server on mount.
  // This ensures the just-placed order shows up immediately after redirect.
  useEffect(() => {
    fetchOrders();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const allOrders = useMemo(
    () => orders.filter((o): o is Order => Boolean(o?.status)),
    [orders],
  );

  const counts = useMemo(
    () => ({
      all: allOrders.length,
      active: allOrders.filter(
        (o) => o.status === "processing" || o.status === "on_the_way",
      ).length,
      delivered: allOrders.filter((o) => o.status === "delivered").length,
      cancelled: allOrders.filter((o) => o.status === "cancelled").length,
    }),
    [allOrders],
  );

  const tabs = [
    { key: "all" as OrdersTabKey, label: "All", count: counts.all },
    { key: "active" as OrdersTabKey, label: "Active", count: counts.active },
    {
      key: "delivered" as OrdersTabKey,
      label: "Delivered",
      count: counts.delivered,
    },
    {
      key: "cancelled" as OrdersTabKey,
      label: "Cancelled",
      count: counts.cancelled,
    },
  ];

  const filtered = useMemo(
    () => filterByTab(activeTab, allOrders),
    [activeTab, allOrders],
  );

  // Show full-screen spinner only on the very first load (empty list)
  if (loading === "loading" && allOrders.length === 0) {
    return (
      <div className="flex items-center justify-center p-16 text-t-21 text-primary font-[var(--font-montserrat)]">
        Loading orders…
      </div>
    );
  }

  if (error) return <ErrorMessage message={error} />;

  return (
    <div className="min-h-screen bg-background font-[var(--font-montserrat)]">
      <PageContainer>
        <PageHeader
          title="My Orders"
          subtitle="Track and manage your orders"
          actions={
            <div className="min-w-0 overflow-x-auto">
              <div className="bg-card rounded-xl border border-border p-2 flex gap-1 whitespace-nowrap">
                {tabs.map((t) => {
                  const sel = t.key === activeTab;
                  return (
                    <button
                      key={t.key}
                      onClick={() => setActiveTab(t.key)}
                      className={`h-12 px-5 rounded-lg border-none text-t-17-semibold cursor-pointer whitespace-nowrap transition-all inline-flex items-center gap-1.5 font-[var(--font-montserrat)] ${
                        sel
                          ? "bg-primary text-card"
                          : "bg-transparent text-primary hover:bg-accent"
                      }`}
                    >
                      {t.key === "all" && (
                        <span
                          className={`w-2 h-2 rounded-full flex-shrink-0 ${sel ? "bg-card" : "bg-primary"}`}
                        />
                      )}
                      {t.label} ({t.count})
                    </button>
                  );
                })}
              </div>
            </div>
          }
        />

        {/* Subtle refresh indicator when re-fetching */}
        {loading === "loading" && allOrders.length > 0 && (
          <p className="text-t-12 text-muted-foreground mb-3">
            Refreshing orders…
          </p>
        )}

        <OrdersList orders={filtered} />
      </PageContainer>
    </div>
  );
}
