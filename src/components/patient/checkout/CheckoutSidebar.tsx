"use client";
import React, { memo, useState } from "react";
import Image from "next/image";
import { ChevronUp, ChevronDown } from "lucide-react";
import { CouponInput } from "./CouponInput";
import type { CartGroup } from "@/types/cart";

// =============================================================================
// CheckoutSidebar
//
// Shows cart groups, coupon input, price breakdown, and the Confirm Order
// button at the bottom.
//
// confirmEnabled is false until the user clicks "Place Order" in the left panel
// (which validates the form and freezes the UI). Once enabled, clicking
// "Confirm Order" navigates to the confirmation page.
// =============================================================================

interface Props {
  cartGroups: CartGroup[];
  subtotal: number;
  deliveryFee: number;
  discount: number;
  total: number;
  totalItems: number;
  onApplyCoupon: (code: string) => Promise<void>;
  onRemoveCoupon: () => void;
  appliedCoupon?: string;
  discountPercent?: number;
  prescriptionReviewed?: boolean;
  /** Navigates to /Orderconfirmation — only active after Place Order clicked */
  onConfirm?: () => void;
  /** Enabled when the form has been validated (Place Order clicked) */
  confirmEnabled?: boolean;
}

export const CheckoutSidebar = memo(function CheckoutSidebar({
  cartGroups,
  subtotal,
  deliveryFee,
  discount,
  total,
  totalItems,
  onApplyCoupon,
  onRemoveCoupon,
  appliedCoupon,
  discountPercent,
  prescriptionReviewed,
  onConfirm,
  confirmEnabled,
}: Props) {
  const [discountsOpen, setDiscountsOpen] = useState(true);
  const hasPrescription = cartGroups.some((g) =>
    g.items.some((i) => i.requiresPrescription),
  );

  return (
    <div className="w-full bg-card rounded-3xl border-t-4 border-t-secondary px-4 py-6 flex flex-col gap-4 shadow-card sticky top-6 font-[var(--font-montserrat)]">

      {/* Header */}
      <div className="pb-3 border-b border-border">
        <h3 className="text-t-25-bold text-foreground m-0">
          Cart Details ({cartGroups.length})
        </h3>
      </div>

      {/* Pharmacy groups */}
      {cartGroups.map((group) => {
        const imgs = group.items.map((i) => i.image).filter(Boolean).slice(0, 2);
        const totalQty = group.items.reduce((s, i) => s + i.quantity, 0);
        return (
          <div
            key={group.pharmacy.id}
            className="w-full rounded-3xl px-2 py-3 bg-card border border-neutral-light-active flex flex-col gap-2.5"
          >
            <div className="flex items-center gap-3">
              <div className="relative w-[90px] h-16 flex-shrink-0">
                <div className="w-full h-full bg-accent rounded-xl flex items-center justify-center overflow-visible">
                  <div className="flex items-center">
                    {imgs.map((src, i) => (
                      <div
                        key={i}
                        className={`w-[34px] h-[34px] bg-card rounded-md flex items-center justify-center overflow-hidden relative ${i > 0 ? "-ml-2" : ""}`}
                        style={{ zIndex: i + 1 }}
                      >
                        {src ? (
                          <Image
                            src={src} alt="" width={26} height={26}
                            className="object-contain"
                            onError={(e) => {
                              (e.target as HTMLImageElement).style.display = "none";
                            }}
                          />
                        ) : (
                          <span className="text-sm">💊</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
                <div className="absolute bottom-1.5 right-1.5 bg-primary-light text-primary text-[11px] font-bold rounded-lg px-1.5 py-0.5 z-20 border border-card shadow-sm whitespace-nowrap">
                  +{totalQty}
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-t-14-bold text-foreground mb-0.5 truncate">
                  {group.pharmacy.name}
                </p>
                <p className="text-t-14 text-neutral-dark mb-0.5 leading-tight truncate">
                  {group.pharmacy.address}
                </p>
                <p className="text-t-12 text-muted-foreground">
                  {totalQty} items | {group.subtotal.toFixed(2)}$
                </p>
              </div>
            </div>

            {hasPrescription && (
              <div className="w-full h-12 rounded-xl px-4 bg-success-light flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                       stroke="hsl(var(--success-darker))" strokeWidth="2"
                       strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 2v6h6"/>
                    <path d="M3 8C5.5 4.5 9.5 2 14 2c5.5 0 10 4.5 10 10s-4.5 10-10 10c-4.5 0-8.5-2.5-10-6"/>
                  </svg>
                  <span className="text-t-14-semibold text-foreground">Status</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-t-12 text-success-darker">
                    {prescriptionReviewed ? "Prescription reviewed" : "Prescription pending"}
                  </span>
                  {prescriptionReviewed && (
                    <svg width="18" height="14" viewBox="0 0 20 14" fill="none"
                         stroke="hsl(var(--success-darker))" strokeWidth="2.5"
                         strokeLinecap="round" strokeLinejoin="round">
                      <path d="M1 7l5 5L16 1"/>
                      <path d="M6 7l5 5L21 1"/>
                    </svg>
                  )}
                </div>
              </div>
            )}
          </div>
        );
      })}

      {/* Discounts / Coupon */}
      <div>
        <div className={`flex items-center justify-between ${discountsOpen ? "mb-2.5" : ""}`}>
          <h4 className="text-t-21-bold text-foreground m-0">Discounts</h4>
          <button
            onClick={() => setDiscountsOpen(!discountsOpen)}
            className="w-9 h-9 rounded-full bg-card border border-border flex items-center justify-center cursor-pointer hover:border-primary transition-colors"
          >
            {discountsOpen
              ? <ChevronUp size={16} className="text-primary" />
              : <ChevronDown size={16} className="text-primary" />}
          </button>
        </div>
        <div className={`overflow-hidden transition-all duration-300 ${discountsOpen ? "max-h-[180px]" : "max-h-0"}`}>
          <CouponInput
            onApply={async (code) => { await onApplyCoupon(code); }}
            onRemove={onRemoveCoupon}
            appliedCode={appliedCoupon}
            discountPercent={discountPercent}
          />
        </div>
      </div>

      {/* Price Breakdown */}
      <div>
        <div className="flex items-center justify-between mb-2.5">
          <h4 className="text-t-21-bold text-foreground m-0">Price Breakdown</h4>
          <div className="flex gap-1">
            {[0, 1, 2].map((d) => (
              <div key={d} className="w-1 h-1 rounded-full bg-neutral-dark" />
            ))}
          </div>
        </div>
        <div className="rounded-2xl p-2 bg-card border border-neutral-light-active flex flex-col gap-2.5">
          {[
            { label: "Subtotal",     val: subtotal    },
            { label: "Delivery Fee", val: deliveryFee },
            { label: "Discount",     val: discount    },
          ].map(({ label, val }) => (
            <div key={label} className="flex items-center justify-between px-1">
              <span className="text-t-14-semibold text-primary">{label}</span>
              <span className="text-t-14 text-primary">
                {val === 0 ? "00.00$" : `${val.toFixed(2)}$`}
              </span>
            </div>
          ))}
          <div className="w-full h-[37px] rounded-sm px-1 bg-accent flex items-center justify-between">
            <span className="text-t-14-semibold text-foreground">
              Total{" "}
              <span className="text-neutral-dark font-normal">({totalItems} items)</span>
            </span>
            <span className="flex items-baseline gap-px">
              <span className="text-t-25-bold text-primary">{total.toFixed(2)}</span>
              <span className="text-t-17-semibold text-primary">$</span>
            </span>
          </div>
        </div>
      </div>

      {/* ── Confirm Order button ── */}
      <button
        onClick={confirmEnabled ? onConfirm : undefined}
        disabled={!confirmEnabled}
        className={`w-full h-14 rounded-xl border-none text-t-17-semibold text-card transition-all ${
          confirmEnabled
            ? "bg-primary cursor-pointer hover:bg-primary-hover shadow-sm"
            : "bg-border text-neutral cursor-default opacity-60"
        }`}
      >
        Confirm Order
      </button>

      {!confirmEnabled && (
        <p className="text-t-12 text-muted-foreground text-center -mt-2">
          Fill all fields and click <strong>Place Order</strong> to continue
        </p>
      )}
    </div>
  );
});
