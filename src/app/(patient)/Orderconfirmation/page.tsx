"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Suspense } from "react";
import Image from "next/image";
import { useOrderStore } from "@/store/order.store";
import { useCartStore } from "@/store/cart.store";
import { ROUTES } from "@/constants/cart.constants";
import { toast } from "sonner";



const MOCK_CART_ERROR = "Please clear your cart and add items from the real store";

function OrderConfirmationContent() {
  const router  = useRouter();
  const { pendingCheckout, placeOrder, placing } = useOrderStore();
  const { clearCart } = useCartStore();
  const [submitted,  setSubmitted]  = useState(false);
  const [cartError,  setCartError]  = useState(false);   // true = show clear-cart banner
  const [clearing,   setClearing]   = useState(false);

  if (!pendingCheckout) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-neutral-light">
        <p className="text-t-17 text-muted-foreground text-center px-4">
          No order found. Please go back to checkout.
        </p>
        <button
          onClick={() => router.push(ROUTES.CHECKOUT)}
          className="h-12 px-8 rounded-xl bg-primary text-white text-t-17-semibold border-none cursor-pointer hover:bg-primary-hover transition-colors"
        >
          Back to Checkout
        </button>
      </div>
    );
  }

  const { checkoutData, cart } = pendingCheckout;

  const totalItems = cart.groups.reduce(
    (s, g) => s + g.items.reduce((ss, i) => ss + i.quantity, 0),
    0,
  );

  const addressText = [
    checkoutData.deliveryAddress?.street,
    checkoutData.deliveryAddress?.area,
    checkoutData.deliveryAddress?.city,
  ]
    .filter(Boolean)
    .join(", ");

  // ── Place Order ───────────────────────────────────────────────────────────
  // Pipeline lives entirely in ordersService.createOrder():
  //   1. Auth  2. Mock-data guard  3. POST /addresses  4. POST /order
  const handleSave = async () => {
    if (submitted || placing) return;
    setCartError(false);

    try {
      await placeOrder();
      setSubmitted(true);
      toast.success("Order placed successfully!");
      router.push(ROUTES.ORDERS);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to place order. Please try again.";
      console.error("[Orderconfirmation] placeOrder failed:", err);

      if (msg === MOCK_CART_ERROR) {
        // Show the inline banner with a "Clear Cart" action button
        setCartError(true);
      } else {
        toast.error(msg);
      }
    }
  };

  // ── Clear stale mock cart then send user back to shop ─────────────────────
  const handleClearCart = async () => {
    if (clearing) return;
    setClearing(true);
    try {
      await clearCart();
      toast.success("Cart cleared! Please add items from the store.");
      router.push(ROUTES.MEDICINES);
    } catch {
      toast.error("Could not clear cart. Please try again.");
    } finally {
      setClearing(false);
    }
  };

  const isWorking = placing || submitted;

  return (
    <div className="min-h-screen bg-neutral-light font-[var(--font-montserrat)]">
      {/* Header */}
      <div className="w-full bg-accent px-4 sm:px-8 lg:px-10 xl:px-20 pt-4 pb-8">
        <div className="max-w-[1392px] mx-auto">
          <h1 className="text-t-30-bold text-primary m-0">Order Confirmation</h1>
        </div>
      </div>

      {/* Card */}
      <div className="max-w-[600px] mx-auto mt-8 px-4 pb-12">
        <div className="bg-card rounded-3xl border border-border shadow-card overflow-hidden">

          {/* Checkmark */}
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
              Review your order before confirming
            </p>
          </div>

          {/* ── Stale-cart error banner ── */}
          {cartError && (
            <div className="mx-6 mb-4 rounded-xl border border-destructive/40 bg-destructive/5 px-5 py-4">
              <p className="text-t-14-semibold text-destructive m-0 mb-3">
                ⚠️ Your cart contains old test data that the server does not
                recognise. Please clear your cart and re-add items from the
                official store.
              </p>
              <button
                onClick={handleClearCart}
                disabled={clearing}
                className="h-10 px-5 rounded-lg bg-destructive text-white text-t-14-semibold
                           border-none cursor-pointer hover:opacity-90 transition-opacity
                           flex items-center gap-2 disabled:opacity-60 disabled:cursor-default"
              >
                {clearing ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Clearing…
                  </>
                ) : (
                  "Clear Cart & Go to Store"
                )}
              </button>
            </div>
          )}

          {/* Address row */}
          {addressText && (
            <div className="mx-6 mb-3 bg-accent rounded-xl px-4 py-3 flex items-start gap-2">
              <svg className="mt-0.5 flex-shrink-0" width="14" height="14" viewBox="0 0 24 24"
                   fill="none" stroke="hsl(var(--primary))" strokeWidth="2.5"
                   strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
                <circle cx="12" cy="9" r="2.5"/>
              </svg>
              <span className="text-t-14 text-foreground">{addressText}</span>
            </div>
          )}

          {/* Pharmacy groups */}
          <div className="px-6 flex flex-col gap-3 mb-3">
            {cart.groups.map((group, gi) => {
              const images = group.items
                .map((i) => i.image)
                .filter((src): src is string => Boolean(src));
              const shownImages = images.slice(0, 3);
              const totalQty   = group.items.reduce((s, i) => s + i.quantity, 0);
              const extraQty   = totalQty - shownImages.length;

              return (
                <div
                  key={gi}
                  className="flex items-center gap-4 bg-neutral-light rounded-2xl border border-border p-4"
                >
                  {/* Image strip */}
                  <div className="relative flex-shrink-0 w-[100px] h-[72px] bg-accent rounded-xl flex items-center justify-center overflow-hidden">
                    {shownImages.length > 0 ? (
                      <div className="flex items-center gap-1 px-2">
                        {shownImages.map((src, idx) => (
                          <div key={idx} className="w-9 h-9 flex-shrink-0 flex items-center justify-center">
                            <Image src={src} alt="" width={36} height={36}
                                   className="object-contain w-full h-full" />
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
                      {group.pharmacy.name}
                    </p>
                    <p className="text-t-14 text-muted-foreground m-0 truncate">
                      {group.pharmacy.address}
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

          {/* Total */}
          <div className="mx-6 mb-6 bg-neutral-light rounded-xl border border-border px-5 py-4 flex items-center justify-between">
            <span className="text-t-17-semibold text-foreground">
              Total{" "}
              <span className="font-normal text-muted-foreground">({totalItems} items)</span>
            </span>
            <span className="text-t-25-bold text-primary">
              {checkoutData.total.toFixed(2)}$
            </span>
          </div>

          {/* Confirm & Place Order button */}
          <div className="px-6 pb-8">
            <button
              onClick={handleSave}
              disabled={isWorking || cartError}
              className={`w-full h-[56px] rounded-xl text-white text-t-17-semibold border-none
                         flex items-center justify-center gap-2 transition-colors ${
                           isWorking || cartError
                             ? "bg-secondary cursor-default opacity-60"
                             : "bg-primary cursor-pointer hover:bg-primary-hover"
                         }`}
            >
              {placing ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Placing Order…
                </>
              ) : (
                "Confirm & Place Order"
              )}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}

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