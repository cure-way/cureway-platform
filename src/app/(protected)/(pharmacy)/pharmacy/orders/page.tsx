"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { FiFileText, FiRefreshCw, FiAlertCircle } from "react-icons/fi";
import PageHeader from "@/components/pharmacy/shared/PageHeader";
import { pharmacyOrdersApiService, mapPharmacyOrderStatus } from "@/services/api.service";
import type { PharmacyOrderListItemDto } from "@/types/api.types";

// ── Status tabs ──────────────────────────────────────────────────────────────

const STATUS_TABS = [
  { label: "All",              value: "ALL" },
  { label: "Pending",          value: "PENDING" },
  { label: "Accepted",         value: "ACCEPTED" },
  { label: "Preparing",        value: "PREPARING" },
  { label: "Ready",            value: "READY_FOR_PICKUP" },
  { label: "Delivered",        value: "DELIVERED" },
  { label: "Rejected",         value: "REJECTED" },
  { label: "Cancelled",        value: "CANCELLED" },
] as const;

type StatusTab = typeof STATUS_TABS[number]["value"];

// ── Map backend status to the StatusBadge component's accepted keys ──────────
// StatusBadge uses the pharmacy ORDER_STATUS_MAP which expects: New / Pending /
// Delivered / Cancelled.  We extend it with our own badge rendering below.

function PharmacyOrderStatusBadge({ status }: { status: string }) {
  const label = mapPharmacyOrderStatus(status);

  const colorMap: Record<string, string> = {
    PENDING:          "bg-yellow-100 text-yellow-700",
    ACCEPTED:         "bg-blue-100 text-blue-700",
    PREPARING:        "bg-indigo-100 text-indigo-700",
    READY_FOR_PICKUP: "bg-teal-100 text-teal-700",
    OUT_FOR_DELIVERY: "bg-cyan-100 text-cyan-700",
    DELIVERED:        "bg-green-100 text-green-700",
    REJECTED:         "bg-red-100 text-red-700",
    CANCELLED:        "bg-gray-100 text-gray-600",
  };

  const cls = colorMap[status] ?? "bg-gray-100 text-gray-600";

  return (
    <span className={`inline-flex rounded-full px-4 py-1.5 text-xs font-medium ${cls}`}>
      {label}
    </span>
  );
}

// ── Helpers ──────────────────────────────────────────────────────────────────

function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  } catch {
    return iso;
  }
}

// ── Page ─────────────────────────────────────────────────────────────────────

export default function PharmacyOrdersPage() {
  const router = useRouter();

  const [orders,     setOrders]     = useState<PharmacyOrderListItemDto[]>([]);
  const [loading,    setLoading]    = useState(true);
  const [error,      setError]      = useState<string | null>(null);
  const [activeTab,  setActiveTab]  = useState<StatusTab>("ALL");

  const fetchOrders = useCallback(async (tab: StatusTab) => {
    setLoading(true);
    setError(null);
    try {
      const result = await pharmacyOrdersApiService.getOrders({
        page:      1,
        limit:     100,
        status:    tab === "ALL" ? undefined : tab,
        sortOrder: "desc",
      });
      setOrders(result.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load orders");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders(activeTab);
  }, [activeTab, fetchOrders]);

  const handleTabChange = (tab: StatusTab) => {
    setActiveTab(tab);
  };

  // ── Render ──────────────────────────────────────────────────────────────

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <PageHeader
          title="Orders"
          subTitle="Manage incoming patient orders"
          icon={FiFileText}
        />
        <button
          onClick={() => fetchOrders(activeTab)}
          disabled={loading}
          className="flex items-center gap-1.5 text-sm text-(--color-primary) hover:opacity-75 transition disabled:opacity-40"
        >
          <FiRefreshCw className={`text-base ${loading ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </div>

      {/* Status tabs */}
      <div className="flex gap-1 flex-wrap">
        {STATUS_TABS.map((tab) => (
          <button
            key={tab.value}
            onClick={() => handleTabChange(tab.value)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors border ${
              activeTab === tab.value
                ? "bg-(--color-primary) text-white border-(--color-primary)"
                : "bg-white text-gray-600 border-gray-200 hover:border-(--color-primary) hover:text-(--color-primary)"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex items-center justify-center py-16 text-gray-400 text-sm gap-2">
          <FiRefreshCw className="animate-spin text-lg" />
          Loading orders…
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center py-16 gap-3 text-center">
          <FiAlertCircle className="text-3xl text-red-400" />
          <p className="text-gray-700 font-medium">{error}</p>
          <button
            onClick={() => fetchOrders(activeTab)}
            className="text-sm text-(--color-primary) underline hover:opacity-75"
          >
            Try again
          </button>
        </div>
      ) : orders.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 gap-2 text-center">
          <FiFileText className="text-4xl text-gray-300" />
          <p className="text-gray-500 text-sm">No orders found</p>
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-5 py-4 text-left font-medium text-(--color-primary)">Order ID</th>
                  <th className="px-5 py-4 text-left font-medium text-(--color-primary) hidden sm:table-cell">Customer</th>
                  <th className="px-5 py-4 text-left font-medium text-(--color-primary) hidden md:table-cell">Items</th>
                  <th className="px-5 py-4 text-left font-medium text-(--color-primary)">Total</th>
                  <th className="px-5 py-4 text-left font-medium text-(--color-primary) hidden sm:table-cell">Date</th>
                  <th className="px-5 py-4 text-left font-medium text-(--color-primary)">Status</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order, idx) => (
                  <tr
                    key={order.id}
                    onClick={() => router.push(`/pharmacy/orders/${order.id}`)}
                    className={`border-t border-gray-100 cursor-pointer hover:bg-blue-50 transition-colors ${
                      idx % 2 === 0 ? "bg-white" : "bg-gray-50"
                    }`}
                  >
                    <td className="px-5 py-4 font-medium text-gray-900">
                      #{order.id}
                    </td>
                    <td className="px-5 py-4 text-gray-700 hidden sm:table-cell">
                      {order.customer?.name ?? "—"}
                    </td>
                    <td className="px-5 py-4 text-gray-600 hidden md:table-cell">
                      {order.itemsCount} item{order.itemsCount !== 1 ? "s" : ""}
                    </td>
                    <td className="px-5 py-4 font-medium text-gray-900">
                      {order.subtotal.toFixed(2)}$
                    </td>
                    <td className="px-5 py-4 text-gray-500 hidden sm:table-cell">
                      {formatDate(order.createdAt)}
                    </td>
                    <td className="px-5 py-4">
                      <PharmacyOrderStatusBadge status={order.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Footer */}
          <div className="px-5 py-3 border-t border-gray-100 bg-gray-50 text-sm text-gray-500">
            Showing {orders.length} order{orders.length !== 1 ? "s" : ""}
          </div>
        </div>
      )}
    </div>
  );
}
