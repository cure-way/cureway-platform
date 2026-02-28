"use client";

import Image from "next/image";
import { useState } from "react";
import type { Order } from "@/types/order";
import { OrderStatusBadge } from "./OrderStatusBadge";
import { ViewDetailsDrawer } from "./ViewDetailsDrawer";
import { TrackOrderModal } from "./TrackOrderModal";
import { ReorderDialog } from "./ReorderDialog";
import { useOrderStore } from "@/store/order.store";
import { toast } from "sonner";

function formatOrderedLine(orderedAtISO: string) {
  const d = new Date(orderedAtISO);
  const month = d.toLocaleString("en-US", { month: "long" });
  const day = d.getDate();
  const year = d.getFullYear();
  return `Ordered Today · on ${month} ${day}, ${year}`;
}

export function OrderCard({ order }: { order: Order }) {
  const { cancelOrder, cancellingId } = useOrderStore();

  const [showDetails, setShowDetails] = useState(false);
  const [showTrack, setShowTrack] = useState(false);
  const [showReorder, setShowReorder] = useState(false);

  const isActive =
    order.status === "processing" || order.status === "on_the_way";
  const isDelivered = order.status === "delivered";
  const isCancelled = order.status === "cancelled";
  const isCancelling = cancellingId === order.id;

  // 🔵 Primary Blue Button
  const primaryBtn =
    "h-12 w-full rounded-xl border border-[#334EAC] bg-[#334EAC] px-[22px] py-[10px]" +
    " transition-all duration-300 ease-in-out" +
    " hover:bg-[#2C4294]" +
    " active:scale-[0.99]" +
    " focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#334EAC]/35";

  // ⚪ White Outline Button
  const outlineBtn =
    "h-12 w-full rounded-xl border border-[#334EAC] bg-white px-[22px] py-[10px]" +
    " transition-all duration-300 ease-in-out" +
    " hover:bg-[#F5F7FF]" +
    " active:scale-[0.99]" +
    " focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#334EAC]/25";

  const handleCancel = async () => {
    try {
      await cancelOrder(order.id);
      toast.success(`Order #${order.id} has been cancelled.`);
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to cancel order."
      );
    }
  };

  return (
    <>
      <div className="w-full rounded-2xl border border-black/30 bg-white px-8 py-4 font-[var(--font-montserrat)]">
        <div className="flex w-full flex-col gap-6 md:flex-row md:gap-20">
          {/* LEFT SIDE (unchanged) */}
          <div className="flex-1 min-w-0">
            <div className="flex flex-col gap-5 border-b border-black/20 pb-4">
              <div className="flex items-center gap-4">
                <div className="text-2xl font-semibold text-black/80">
                  Order ID: #{order.id}
                </div>
                <OrderStatusBadge status={order.status} />
              </div>

              <div className="text-base font-medium text-black/60">
                {formatOrderedLine(order.orderedAtISO)}
              </div>

              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <Image src="/icons/hospital.png" alt="pharmacy" width={20} height={20} />
                  <span className="text-base font-medium text-black/80">
                    {order.pharmacyName}
                  </span>
                </div>

                <div className="flex items-start gap-2">
                  <Image src="/icons/location.png" alt="location" width={20} height={20} />
                  <span className="text-sm text-black/60">
                    {order.address}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4">
              <div className="text-xl font-semibold text-black/80">
                {order.itemsCount} items
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xl font-bold text-black/60">Total :</span>
                <span className="text-xl font-bold text-black/60">
                  {order.total.toFixed(2)}
                  {order.currency ?? "$"}
                </span>
              </div>
            </div>
          </div>

          {/* RIGHT SIDE */}
          <div className="w-full md:w-[212px] md:shrink-0">
            <div className="flex flex-col gap-4">

              {isActive && (
                <>
                  <button onClick={() => setShowTrack(true)} className={primaryBtn}>
                    <span className="text-xl font-bold text-white">
                      Track Order
                    </span>
                  </button>

                  <button onClick={() => setShowDetails(true)} className={outlineBtn}>
                    <span className="text-xl font-bold text-[#334EAC]">
                      View Details
                    </span>
                  </button>

                  <button
                    onClick={handleCancel}
                    disabled={isCancelling}
                    className="h-12 w-full rounded-xl border border-red-400 bg-white px-[22px] py-[10px] transition-all duration-300 hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span className="text-xl font-bold text-red-500">
                      {isCancelling ? "Cancelling…" : "Cancel Order"}
                    </span>
                  </button>
                </>
              )}

              {(isDelivered || isCancelled) && (
                <>
                  <button onClick={() => setShowDetails(true)} className={outlineBtn}>
                    <span className="text-xl font-bold text-[#334EAC]">
                      View Details
                    </span>
                  </button>

                  <button onClick={() => setShowReorder(true)} className={primaryBtn}>
                    <span className="text-xl font-bold text-white">
                      Reorder
                    </span>
                  </button>
                </>
              )}

            </div>
          </div>
        </div>
      </div>

      {showDetails && <ViewDetailsDrawer order={order} onClose={() => setShowDetails(false)} />}
      {showTrack && <TrackOrderModal order={order} onClose={() => setShowTrack(false)} />}
      {showReorder && <ReorderDialog order={order} onClose={() => setShowReorder(false)} />}
    </>
  );
}