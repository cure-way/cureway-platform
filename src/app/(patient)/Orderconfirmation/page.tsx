"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import Image from "next/image";
import { useOrderStore } from "@/store/order.store";
import { ROUTES } from "@/constants/cart.constants";
import type { OrderPharmacyGroup } from "@/types/order";

// ─── Confirmation content (wrapped in Suspense for useSearchParams) ─────────

function OrderConfirmationContent() {
  const params     = useSearchParams();
  const router     = useRouter();
  const { orders } = useOrderStore();

  const orderId    = params.get("orderId")  ?? "—";
  const total      = parseFloat(params.get("total") ?? "0");
  const totalItems = parseInt(params.get("items") ?? "0", 10);

  // Find the just-placed order injected by checkout page via addOrder()
  const placedOrder = orders.find((o) => o.id === orderId);

  // Build groups to display — prefer the per-pharmacy breakdown stored at
  // checkout time; fall back to a single group using the flat Order fields.
  const groups: OrderPharmacyGroup[] = placedOrder?.pharmacyGroups?.length
    ? placedOrder.pharmacyGroups
    : placedOrder
    ? [
        {
          pharmacyId:      placedOrder.pharmacyId,
          pharmacyName:    placedOrder.pharmacyName,
          pharmacyAddress: placedOrder.address ?? "",
          subtotal:        placedOrder.total - (placedOrder.deliveryFee ?? 0) + (placedOrder.discount ?? 0),
          items:           placedOrder.items ?? [],
        },
      ]
    : [];

  return (
    <div className="min-h-screen bg-neutral-light font-[var(--font-montserrat)]">
      {/* ── Page header ── */}
      <div className="w-full bg-accent px-4 sm:px-8 lg:px-10 xl:px-20 pt-4 pb-8">
        <div className="max-w-[1392px] mx-auto">
          <h1 className="text-t-30-bold text-primary m-0">Order Confirmation</h1>
        </div>
      </div>

      {/* ── Card ── */}
      <div className="max-w-[600px] mx-auto mt-8 px-4 pb-12">
        <div className="bg-card rounded-3xl border border-border shadow-card overflow-hidden">

          {/* Green checkmark divider */}
          <div className="flex items-center px-8 pt-8 pb-2">
            <div className="flex-1 h-px bg-border" />
            <div className="mx-4 w-16 h-16 rounded-full bg-success flex items-center justify-center shadow-md flex-shrink-0">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none"
                   stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 6 9 17l-5-5"/>
              </svg>
            </div>
            <div className="flex-1 h-px bg-border" />
          </div>

          {/* Title */}
          <div className="text-center px-8 pb-6">
            <h2 className="text-t-25-bold text-primary m-0 mb-1">Order Confirmation</h2>
            <p className="text-t-17 text-muted-foreground m-0">
              Your order has been placed successfully
            </p>
          </div>

          {/* Pharmacy groups */}
          <div className="px-6 flex flex-col gap-3 mb-3">
            {groups.map((group, gi) => {
              // Up to 3 images shown side-by-side; remaining items shown as "+N"
              const images = group.items
                .map((i) => i.image)
                .filter((src): src is string => Boolean(src));
              const shownImages  = images.slice(0, 3);
              const totalQty     = group.items.reduce((s, i) => s + i.quantity, 0);
              const extraQty     = totalQty - shownImages.length;

              return (
                <div
                  key={gi}
                  className="flex items-center gap-4 bg-neutral-light rounded-2xl border border-border p-4"
                >
                  {/* Medicine image strip */}
                  <div className="relative flex-shrink-0 w-[100px] h-[72px] bg-accent rounded-xl flex items-center justify-center overflow-hidden">
                    {shownImages.length > 0 ? (
                      <div className="flex items-center gap-1 px-2">
                        {shownImages.map((src, idx) => (
                          <div
                            key={idx}
                            className="w-9 h-9 flex-shrink-0 flex items-center justify-center"
                          >
                            <Image
                              src={src}
                              alt=""
                              width={36}
                              height={36}
                              className="object-contain w-full h-full"
                            />
                          </div>
                        ))}
                      </div>
                    ) : (
                      <span className="text-3xl">💊</span>
                    )}
                    {extraQty > 0 && (
                      <div className="absolute bottom-1 right-1 bg-white text-primary text-[10px] font-bold rounded-md px-1.5 py-0.5 border border-border shadow-sm leading-none">
                        +{extraQty}
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-t-17-bold text-foreground m-0 truncate">
                      {group.pharmacyName}
                    </p>
                    <p className="text-t-14 text-muted-foreground m-0 truncate">
                      {group.pharmacyAddress}
                    </p>
                    <p className="text-t-14 text-muted-foreground m-0 mt-1">
                      {totalQty} items
                      <span className="mx-1 text-border">|</span>
                      {group.subtotal.toFixed(2)}$
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Total row */}
          <div className="mx-6 mb-6 bg-neutral-light rounded-xl border border-border px-5 py-4 flex items-center justify-between">
            <span className="text-t-17-semibold text-foreground">
              Total{" "}
              <span className="font-normal text-muted-foreground">
                ({totalItems} items)
              </span>
            </span>
            <span className="text-t-25-bold text-primary">
              {total.toFixed(2)}$
            </span>
          </div>

          {/* Save button */}
          <div className="px-6 pb-8">
            <button
              onClick={() => router.push(ROUTES.ORDERS)}
              className="w-full h-[56px] rounded-xl bg-primary text-white text-t-17-semibold
                         border-none cursor-pointer hover:bg-primary-hover transition-colors"
            >
              Save
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}

// ─── Page export wrapped in Suspense (required for useSearchParams) ──────────

export default function OrderConfirmationPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-primary/20 border-t-primary rounded-full animate-spin" />
        </div>
      }
    >
      <OrderConfirmationContent />
    </Suspense>
  );
}
