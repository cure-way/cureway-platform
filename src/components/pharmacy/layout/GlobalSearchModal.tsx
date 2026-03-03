"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useInventorySearch } from "@/hooks/pharmacy/useInventorySearch";
import { useOrdersSearch } from "@/hooks/pharmacy/useOrdersSearch";
import { SearchMedicine } from "@/types/pharmacyTypes";
import { SearchOrder } from "@/types/pharmacyOrders";

interface GlobalSearchPanelProps {
  search: string;
  onItemClick?: () => void;
}

export default function GlobalSearchPanel({
  search,
  onItemClick,
}: GlobalSearchPanelProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"medicines" | "orders">(
    "medicines",
  );

  const { data: medicines, loading: medicinesLoading } = useInventorySearch(
    activeTab === "medicines" ? search : "",
  );

  const { data: orders, loading: ordersLoading } = useOrdersSearch(
    activeTab === "orders" ? search : "",
  );

  const isLoading =
    activeTab === "medicines" ? medicinesLoading : ordersLoading;

  return (
    <div className="bg-white shadow-lg border border-gray-200 rounded-2xl ring-1 ring-black/5 overflow-hidden">
      {/* Tabs */}
      <div className="flex border-b">
        <button
          onClick={() => setActiveTab("medicines")}
          className={`flex-1 py-2 text-sm font-medium ${
            activeTab === "medicines"
              ? "text-(--color-primary) border-b-2 border-(--color-primary)"
              : "text-gray-500"
          }`}
        >
          Medicines ({medicines.length})
        </button>

        <button
          onClick={() => setActiveTab("orders")}
          className={`flex-1 py-2 text-sm font-medium ${
            activeTab === "orders"
              ? "text-(--color-primary) border-b-2 border-(--color-primary)"
              : "text-gray-500"
          }`}
        >
          Orders ({orders.length})
        </button>
      </div>

      <div className="p-3 max-h-72 overflow-y-auto">
        {isLoading && (
          <p className="py-4 text-gray-500 text-sm text-center">Searching...</p>
        )}

        {!isLoading &&
          activeTab === "medicines" &&
          (medicines.length ? (
            medicines.map((m: SearchMedicine) => (
              <div
                key={m.id}
                onClick={() => {
                  router.push(`/pharmacy/inventory/${m.id}`);
                  onItemClick?.();
                }}
                className="hover:bg-gray-100 p-2 rounded-lg text-sm cursor-pointer"
              >
                <p className="font-medium">{m.medicineName}</p>
                <p className="text-gray-500 text-xs">{m.categoryName}</p>
              </div>
            ))
          ) : (
            <p className="py-4 text-gray-500 text-sm text-center">
              No medicines found
            </p>
          ))}

        {!isLoading &&
          activeTab === "orders" &&
          (orders.length ? (
            orders.map((order: SearchOrder) => (
              <div
                key={order.orderId}
                onClick={() => {
                  router.push(`/pharmacy/orders/${order.orderId}`);
                  onItemClick?.();
                }}
                className="hover:bg-gray-100 p-2 rounded-lg text-sm cursor-pointer"
              >
                <p className="font-medium">Order #{order.orderId}</p>

                <p className="text-gray-500 text-xs">
                  {order.firstMedicineName}
                  {order.remainingItemsCount > 0 &&
                    ` +${order.remainingItemsCount} more`}
                </p>
              </div>
            ))
          ) : (
            <p className="py-4 text-gray-500 text-sm text-center">
              No orders found
            </p>
          ))}
      </div>
    </div>
  );
}
