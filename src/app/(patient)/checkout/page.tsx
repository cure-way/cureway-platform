"use client";
import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/store/cart.store";
import { useOrderStore } from "@/store/order.store";
import ContactInformation from "@/components/patient/checkout/Contactinformation";
import DeliveryAddressForm from "@/components/patient/checkout/DeliveryAddressForm";
import DeliveryOptions from "@/components/patient/checkout/Deliveryoptions";
import PaymentMethods from "@/components/patient/checkout/Paymentmethods";
import { OrderNotes } from "@/components/patient/checkout/OrderNotes";
import { CheckoutSidebar } from "@/components/patient/checkout/CheckoutSidebar";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { DELIVERY_OPTIONS, PAYMENT_METHODS, ROUTES } from "@/constants/cart.constants";
import { MOCK_USER } from "@/data/mockData";
import type { CheckoutData, DeliveryAddress, DeliveryOption, PaymentMethod } from "@/types/cart";
import { calculateCartTotal } from "@/utils/cart.utils";
import { toast } from "sonner";

// =============================================================================
// Checkout Page
//
// Two-step flow:
//   Step 1 — "Place Order" button (left panel):
//     • Validates all required fields.
//     • Freezes the form so the user cannot accidentally change anything.
//     • Enables the "Confirm Order" button in the sidebar.
//
//   Step 2 — "Confirm Order" button (sidebar):
//     • Only clickable after Step 1.
//     • Stores the validated snapshot in the order store (pendingCheckout).
//     • Navigates to /Orderconfirmation.
//
// No API call happens here. POST /orders fires on the confirmation page.
// Saved-address API (GET /patient/addresses) is intentionally NOT used —
// the address comes entirely from what the user enters in the form.
// =============================================================================

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, applyCoupon, removeCoupon, getCartSubtotal, getCartItemCount } =
    useCartStore();
  const { setPendingCheckout } = useOrderStore();

  const [checkoutData, setCheckoutData] = useState<CheckoutData>({
    contact: MOCK_USER,
    deliveryAddress: null,
    useCurrentLocation: false,
    deliveryOption: null,
    paymentMethod: null,
    orderNotes: "",
    discount: 0,
    deliveryFee: 0,
    total: 0,
  });

  // uiFrozen: true after Place Order passes validation.
  // When true: form fields are locked + Confirm Order button is enabled.
  const [uiFrozen, setUiFrozen] = useState(false);

  const [appliedCoupon, setAppliedCoupon] = useState<string | undefined>();
  const [discountPercent, setDiscountPercent] = useState<number | undefined>();

  // ── Prescription check ─────────────────────────────────────────────────────
  const prescriptionReviewed = !cart?.groups
    .flatMap((g) => g.items)
    .some((i) => i.requiresPrescription && !i.prescriptionUploaded);

  // ── Recalculate totals when delivery option or discount changes ────────────
  useEffect(() => {
    const subtotal = getCartSubtotal();
    const deliveryFee = checkoutData.deliveryOption?.price ?? 0;
    setCheckoutData((p) => ({
      ...p,
      deliveryFee,
      total: calculateCartTotal(subtotal, deliveryFee, p.discount),
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [checkoutData.deliveryOption?.id, checkoutData.discount]);

  // ── Redirect when cart becomes empty ───────────────────────────────────────
  useEffect(() => {
    if (cart !== null && cart.groups.length === 0) router.push(ROUTES.CART);
  }, [cart, router]);

  // ── Coupon ─────────────────────────────────────────────────────────────────
  const handleApplyCoupon = useCallback(
    async (code: string) => {
      try {
        await applyCoupon(code);
        setAppliedCoupon(code);
      } catch (err) {
        throw err;
      }
    },
    [applyCoupon],
  );

  const handleRemoveCoupon = useCallback(async () => {
    await removeCoupon();
    setAppliedCoupon(undefined);
    setDiscountPercent(undefined);
    setCheckoutData((p) => ({ ...p, discount: 0 }));
  }, [removeCoupon]);

  // ── Address select handler — stable reference avoids stale closures ────────
  const handleAddressSelect = useCallback((addr: DeliveryAddress) => {
    if (!uiFrozen) setCheckoutData((p) => ({ ...p, deliveryAddress: addr }));
  }, [uiFrozen]);

  // ── Step 1: "Place Order" ─────────────────────────────────────────────────
  // Validates the form and freezes the UI. Does NOT navigate.
  const handlePlaceOrder = useCallback(() => {
    if (uiFrozen) return; // already frozen

    if (!checkoutData.deliveryAddress) {
      toast.error("Please enter a delivery address");
      return;
    }
    const hasAddressText =
      checkoutData.deliveryAddress.street?.trim() ||
      checkoutData.deliveryAddress.city?.trim();
    if (!hasAddressText) {
      toast.error("Please enter a valid delivery address");
      return;
    }
    if (!checkoutData.deliveryOption) {
      toast.error("Please select a delivery option");
      return;
    }
    if (!checkoutData.paymentMethod) {
      toast.error("Please select a payment method");
      return;
    }
    if (!prescriptionReviewed) {
      toast.error("Please upload all required prescriptions first");
      return;
    }
    if (!cart) {
      toast.error("Your cart is empty");
      return;
    }

    setUiFrozen(true);
    toast.success("Order details locked. Click Confirm Order to proceed.");
  }, [uiFrozen, checkoutData, cart, prescriptionReviewed]);

  // ── Step 2: "Confirm Order" ───────────────────────────────────────────────
  // Stores the snapshot and navigates to the confirmation page.
  const handleConfirmOrder = useCallback(() => {
    if (!uiFrozen || !cart) return;

    setPendingCheckout({ checkoutData, cart });
    router.push(ROUTES.ORDER_CONFIRMATION);
  }, [uiFrozen, checkoutData, cart, setPendingCheckout, router]);

  // ── Allow user to edit again ───────────────────────────────────────────────
  const handleEditOrder = useCallback(() => {
    setUiFrozen(false);
  }, []);

  if (!cart)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );

  const subtotal = getCartSubtotal();
  const totalItems = getCartItemCount();

  const isFormComplete =
    Boolean(checkoutData.deliveryAddress?.street?.trim() || checkoutData.deliveryAddress?.city?.trim()) &&
    Boolean(checkoutData.deliveryOption) &&
    Boolean(checkoutData.paymentMethod) &&
    prescriptionReviewed;

  return (
    <div className="min-h-screen bg-neutral-light font-[var(--font-montserrat)]">
      {/* Header */}
      <div className="w-full bg-accent px-4 sm:px-8 lg:px-10 xl:px-20 pt-4 pb-8">
        <div className="max-w-[1392px] mx-auto flex items-center justify-between gap-4">
          <h1 className="text-t-36-bold text-primary">Checkout</h1>
          <span className="text-t-21 text-foreground">
            [ {totalItems} items in total ]
          </span>
        </div>
      </div>

      {/* Body */}
      <div className="max-w-[1392px] mx-auto px-4 sm:px-8 lg:px-10 xl:px-20 py-6">
        <div className="flex flex-col xl:flex-row gap-6 items-start">

          {/* ── Left panel: form fields ── */}
          <div className="flex-1 min-w-0 bg-card rounded-3xl border-t-4 border-t-secondary p-4 sm:p-6 shadow-card flex flex-col gap-4">
            <ContactInformation contact={checkoutData.contact} />
            <div className="h-px bg-border" />

            {/* Address — no saved addresses; user enters manually or via GPS */}
            <DeliveryAddressForm
              selectedAddress={checkoutData.deliveryAddress}
              onAddressSelect={handleAddressSelect}
            />
            <div className="h-px bg-border" />

            <DeliveryOptions
              options={[...DELIVERY_OPTIONS]}
              selected={checkoutData.deliveryOption}
              frozen={uiFrozen}
              onSelect={(opt: DeliveryOption) => {
                if (!uiFrozen)
                  setCheckoutData((p) => ({ ...p, deliveryOption: opt }));
              }}
            />
            <div className="h-px bg-border" />

            <PaymentMethods
              methods={[...PAYMENT_METHODS]}
              selected={checkoutData.paymentMethod}
              frozen={uiFrozen}
              onSelect={(method: PaymentMethod) => {
                if (!uiFrozen)
                  setCheckoutData((p) => ({ ...p, paymentMethod: method }));
              }}
            />
            <div className="h-px bg-border" />

            {/* Hide notes when frozen and empty */}
            {!(uiFrozen && !(checkoutData.orderNotes ?? "").trim()) && (
              <OrderNotes
                notes={checkoutData.orderNotes ?? ""}
                onChange={(notes) => {
                  if (!uiFrozen)
                    setCheckoutData((p) => ({ ...p, orderNotes: notes }));
                }}
              />
            )}

            {/* ── Step 1 button: Place Order ── */}
            {!uiFrozen ? (
              <button
                onClick={handlePlaceOrder}
                disabled={!isFormComplete}
                className={`w-full h-[65px] rounded-xl border-none text-t-17-semibold transition-all ${
                  isFormComplete
                    ? "bg-primary text-card cursor-pointer hover:bg-primary-hover"
                    : "bg-border text-neutral cursor-default opacity-70"
                }`}
              >
                Place Order
              </button>
            ) : (
              /* Frozen state — show locked summary + edit link */
              <div className="w-full rounded-xl border border-success bg-success-light px-5 py-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
                       stroke="hsl(var(--success-darker))" strokeWidth="2.5"
                       strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 6 9 17l-5-5"/>
                  </svg>
                  <span className="text-t-14-semibold text-success-darker">
                    Order details confirmed — click Confirm Order to proceed
                  </span>
                </div>
                <button
                  onClick={handleEditOrder}
                  className="text-t-12 text-primary underline cursor-pointer bg-transparent border-none ml-4 flex-shrink-0"
                >
                  Edit
                </button>
              </div>
            )}
          </div>

          {/* ── Sidebar ── */}
          <div className="w-full xl:w-[392px] xl:flex-shrink-0">
            <CheckoutSidebar
              cartGroups={cart.groups}
              subtotal={subtotal}
              deliveryFee={checkoutData.deliveryFee}
              discount={checkoutData.discount}
              total={checkoutData.total}
              totalItems={totalItems}
              onApplyCoupon={handleApplyCoupon}
              onRemoveCoupon={handleRemoveCoupon}
              appliedCoupon={appliedCoupon}
              discountPercent={discountPercent}
              prescriptionReviewed={prescriptionReviewed}
              onConfirm={handleConfirmOrder}
              confirmEnabled={uiFrozen}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
