"use client";

import Link from "next/link";
import {
  OrderBoxIcon,
  OrderCheckboxIcon,
  DashPharmacyFilledIcon,
  OrderStatusDot,
} from "@/components/admin/shared/icons";
import { useAdminOrders } from "@/hooks/admin.hooks";

function formatDate(iso: string) {
  const d = new Date(iso);
  return {
    date: d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
    time: d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
  };
}

function statusBg(status: string) {
  switch (status) {
    case "PAID": return "bg-[#EBF9EE]";
    case "DELIVERED": return "bg-[#EBF9EE]";
    case "PENDING": return "bg-[#FFFAEF]";
    default: return "bg-[#FAF9F9]";
  }
}

function statusText(status: string) {
  switch (status) {
    case "PAID": return "text-[#12461F]";
    case "DELIVERED": return "text-[#12461F]";
    case "PENDING": return "text-[#594920]";
    default: return "text-[#393737]";
  }
}

export default function RecentOrders() {
  const { data, loading } = useAdminOrders();
  const orders = data.slice(0, 5);

  return (
    <div className="bg-white rounded-2xl border border-[#EFEDED] flex flex-col p-4 gap-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 rounded-full bg-[#EFF3FB] flex items-center justify-center shrink-0">
          <OrderBoxIcon />
        </div>
        <div className="flex-1 flex flex-col gap-2 min-w-0">
          <h3 className="text-[20px] leading-[1.2] font-semibold text-[#212F4D]">
            Recent orders
          </h3>
          <p className="text-[14px] leading-[1.2] font-normal text-[#989593]">
            Revenue generated from completed orders
          </p>
        </div>
        <Link
          href="/admin/orders"
          className="border border-[#EFEDED] rounded-lg p-3 text-[12px] leading-[1.2] font-normal text-[#393737] hover:bg-[#FAF9F9] transition-colors shrink-0"
        >
          View all
        </Link>
      </div>

      {/* Table */}
      <div className="flex flex-col rounded-t-[16px] rounded-b-[12px] border-b border-[#CAC6C4] overflow-x-auto">
        {/* Table Header */}
        <div className="flex items-center h-14 bg-[#EFF3FB] border-t-2 border-[#5F85DB] rounded-t-[12px] px-4 gap-2 min-w-[700px]">
          <div className="flex items-center gap-2 flex-1 max-w-[80px]">
            <OrderCheckboxIcon />
            <span className="text-[14px] leading-[1.2] font-semibold text-[#393737]">
              ID
            </span>
          </div>
          <span className="flex-1 min-w-[240px] text-[14px] leading-[1.2] font-semibold text-[#393737]">
            Customer Name
          </span>
          <span className="flex-1 min-w-[200px] text-[14px] leading-[1.2] font-semibold text-[#393737]">
            Pharmacy
          </span>
          <span className="flex-1 text-[14px] leading-[1.2] font-semibold text-[#393737]">
            Date
          </span>
          <span className="flex-1 text-[14px] leading-[1.2] font-semibold text-[#393737]">
            Payment
          </span>
          <span className="flex-1 text-[14px] leading-[1.2] font-semibold text-[#393737]">
            Delivery
          </span>
        </div>

        {/* Rows */}
        {loading ? (
          <div className="flex items-center justify-center h-16 min-w-[700px] text-[14px] text-[#989593]">
            Loading…
          </div>
        ) : orders.length === 0 ? (
          <div className="flex items-center justify-center h-16 min-w-[700px] text-[14px] text-[#989593]">
            No orders found
          </div>
        ) : (
          orders.map((order, index) => {
            const { date, time } = formatDate(order.createdAt);
            return (
              <div
                key={order.id}
                className={`flex items-center h-16 px-4 py-3 gap-2 min-w-[700px] ${
                  index % 2 !== 0
                    ? "bg-[#FAF9F9] border-t border-l border-r border-[#EFEDED]"
                    : "bg-white border-t border-l border-r border-white"
                } ${index === orders.length - 1 ? "rounded-b-[12px]" : ""}`}
              >
                {/* ID */}
                <div className="flex items-center gap-2 flex-1 max-w-[80px]">
                  <OrderCheckboxIcon />
                  <span className="text-[12px] leading-[1.2] font-semibold text-[#393737]">
                    #{order.id}
                  </span>
                </div>

                {/* Customer */}
                <div className="flex items-center gap-2 flex-1 min-w-[240px] h-full">
                  <div className="w-10 h-10 rounded-[20px] shrink-0 bg-[#FFFDC3] flex items-center justify-center">
                    <span className="text-[14px] font-bold text-[#594920]">
                      {order.patient.name.charAt(0)}
                    </span>
                  </div>
                  <div className="flex-1 flex flex-col gap-2 justify-center min-w-0">
                    <p className="text-[14px] leading-[1.2] font-semibold text-[#393737] truncate">
                      {order.patient.name}
                    </p>
                  </div>
                </div>

                {/* Pharmacy */}
                <div className="flex items-center gap-2 flex-1 min-w-[200px] h-full">
                  <div className="w-8 h-8 rounded-2xl bg-[#CDD9F4] flex items-center justify-center shrink-0">
                    <DashPharmacyFilledIcon />
                  </div>
                  <div className="flex-1 flex flex-col gap-1 justify-center min-w-0">
                    <p className="text-[14px] leading-[1.2] font-semibold text-[#263B81] truncate">
                      {order.pharmacyLabel}
                    </p>
                  </div>
                </div>

                {/* Date */}
                <div className="flex-1 flex flex-col gap-1 justify-center">
                  <p className="text-[14px] leading-[1.2] font-semibold text-[#263B81]">
                    {date}
                  </p>
                  <p className="text-[12px] leading-[1.2] font-normal text-[#393737]">
                    {time}
                  </p>
                </div>

                {/* Payment */}
                <div className="flex-1">
                  <div className={`inline-flex items-center gap-1 px-3 py-2 h-10 rounded-lg ${statusBg(order.payment?.status ?? "")}`}>
                    <OrderStatusDot />
                    <span className={`text-[12px] leading-normal font-semibold text-center ${statusText(order.payment?.status ?? "")}`}>
                      {order.payment?.status ?? "—"}
                    </span>
                  </div>
                </div>

                {/* Delivery */}
                <div className="flex-1">
                  <div className={`inline-flex items-center gap-1 px-3 py-2 h-10 rounded-lg ${statusBg(order.delivery?.status ?? "")}`}>
                    <OrderStatusDot />
                    <span className={`text-[12px] leading-normal font-semibold text-center ${statusText(order.delivery?.status ?? "")}`}>
                      {order.delivery?.status ?? "—"}
                    </span>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
