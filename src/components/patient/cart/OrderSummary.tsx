"use client";

import React from "react";

interface Props {
  subtotal: number;
  totalItems: number;
  onCheckout: () => void;
  onContinueShopping: () => void;
}

export default function OrderSummary({
  subtotal,
  totalItems,
  onCheckout,
  onContinueShopping,
}: Props) {
  return (
    <div className="bg-card rounded-3xl border-t-4 border-t-secondary p-6 shadow-card font-[var(--font-montserrat)] sticky top-6">
      <div className="pb-3 mb-4 border-b border-border">
        <h3 className="text-t-21-bold text-foreground">Order summary</h3>
      </div>

      <div className="mb-4">
        <div className="flex items-center justify-between bg-accent rounded-lg px-3 py-3">
          <span>
            <span className="text-t-17-semibold text-foreground">Subtotal</span>
            <span className="text-t-17 text-muted-foreground">
              {" "}({totalItems} items)
            </span>
          </span>
          <span className="text-t-25-bold text-primary">
            {subtotal.toFixed(2)}
            <span className="text-t-14">$</span>
          </span>
        </div>
      </div>

      <p className="text-t-12 text-muted-foreground mb-6">
        · This price isn't final. Shipping and VAT will be added in the next step.
      </p>

      <button
        onClick={onCheckout}
        className="btn btn-lg btn-primary w-full mb-3"
      >
        Checkout
      </button>

      <button
        onClick={onContinueShopping}
        className="btn btn-lg btn-outline w-full"
      >
        Continue to shopping
      </button>

      <div className="flex items-center justify-center gap-2 mt-4">
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className="text-success"
        >
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        </svg>
        <span className="text-t-12 text-muted-foreground">
          Your order is secure
        </span>
      </div>
    </div>
  );
}
