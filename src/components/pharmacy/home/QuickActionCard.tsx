"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FiAlertCircle } from "react-icons/fi";
import { FaCapsules } from "react-icons/fa";

import { useCriticalStock } from "@/hooks/pharmacy/useCriticalStock";
import ErrorState from "../shared/ErrorState";
import TodayInsights from "./TodayInsights";

export default function QuickActionCard({
  topMedicine,
}: {
  topMedicine?: string | null;
}) {
  const [acceptingOrders, setAcceptingOrders] = useState(true);
  const router = useRouter();
  const { data, loading, error } = useCriticalStock();

  return (
    <div className="bg-white p-4 border rounded-xl">
      <h2 className="mb-4 font-semibold text-gray-900 text-sm">Quick Action</h2>

      {/* Accept / Pause Toggle */}
      <div
        className={`mb-6 rounded-lg p-3 transition ${
          acceptingOrders ? "bg-green-50" : "bg-gray-100"
        }`}
      >
        <div className="flex justify-between items-center">
          <div>
            <p className="font-medium text-gray-900 text-sm">
              Accept/Pause New Orders
            </p>
            <p className="text-gray-500 text-xs">
              {acceptingOrders
                ? "Now you can accept new orders"
                : "Orders are currently paused"}
            </p>
          </div>

          <button
            onClick={() => setAcceptingOrders((prev) => !prev)}
            className={`relative h-5 w-9 rounded-full transition ${
              acceptingOrders ? "bg-green-500" : "bg-gray-400"
            }`}
          >
            <span
              className={`absolute top-1/2 h-3 w-3 -translate-y-1/2 rounded-full bg-white transition ${
                acceptingOrders ? "right-1" : "left-1"
              }`}
            />
          </button>
        </div>
      </div>

      {/* Loading */}
      {loading && <CriticalStockSkeleton />}

      {/* Error */}
      {!loading && error && (
        <div className="mb-6">
          <ErrorState message={error} />
        </div>
      )}

      {/* Data */}
      {!loading && !error && data.length > 0 && (
        <div className="mb-6 p-3 border border-t-4 border-t-yellow-300 rounded-lg">
          <div className="flex items-center gap-2 mb-3 font-medium text-yellow-700 text-sm">
            <FiAlertCircle className="text-base" />
            Alert Stock
          </div>

          <div className="space-y-3">
            {data.map((item) => (
              <div
                key={item.id}
                onClick={() => router.push(`/pharmacy/inventory/${item.id}`)}
                className="flex items-center gap-3 hover:bg-gray-50 rounded-lg transition cursor-pointer"
              >
                <div className="flex justify-center items-center bg-white shadow-sm rounded-lg w-12 h-12">
                  <FaCapsules className="text-yellow-600 text-2xl" />
                </div>

                <div className="flex-1">
                  <p className="font-medium text-gray-900 text-sm">
                    {item.medicineName}
                  </p>
                  <p className="text-gray-500 text-xs">{item.stock} in stock</p>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={() => router.push("/pharmacy/inventory")}
            className="bg-(--color-primary) mt-3 py-2 rounded-lg w-full font-medium text-white text-sm"
          >
            Update Stock
          </button>
        </div>
      )}

      {/* Today Insights always shown */}
      <TodayInsights topMedicine={topMedicine} />
    </div>
  );
}

function CriticalStockSkeleton() {
  return (
    <div className="mb-6 p-3 border border-t-4 border-t-yellow-200 rounded-lg animate-pulse">
      <div className="bg-gray-200 mb-4 rounded w-24 h-4" />

      <div className="space-y-3">
        {Array.from({ length: 2 }).map((_, i) => (
          <div key={i} className="flex items-center gap-3">
            <div className="bg-gray-200 rounded-lg w-12 h-12" />
            <div className="flex-1 space-y-2">
              <div className="bg-gray-200 rounded w-28 h-3" />
              <div className="bg-gray-200 rounded w-20 h-3" />
            </div>
          </div>
        ))}
      </div>

      <div className="bg-gray-300 mt-4 rounded w-full h-8" />
    </div>
  );
}
