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

export default function CheckoutPage() {
  const router = useRouter();
  
  // الآن applyCoupon و removeCoupon موجودين بفضل تحديث الـ Store
  const { cart, applyCoupon, removeCoupon, getCartSubtotal, getCartItemCount } = useCartStore();
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

  const [uiFrozen, setUiFrozen] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState<string | undefined>();
  const [discountPercent, setDiscountPercent] = useState<number | undefined>();

  // ── Prescription check ─────────────────────────────────────────────────────
  const prescriptionReviewed = !cart?.groups
    .flatMap((g) => g.items)
    .some((i) => i.requiresPrescription && !i.prescriptionUploaded);

  // ── Recalculate totals ─────────────────────────────────────────────────────
  useEffect(() => {
    const subtotal = getCartSubtotal();
    const deliveryFee = checkoutData.deliveryOption?.price ?? 0;
    setCheckoutData((p) => ({
      ...p,
      deliveryFee,
      total: calculateCartTotal(subtotal, deliveryFee, p.discount),
    }));
  }, [checkoutData.deliveryOption?.id, checkoutData.discount, getCartSubtotal]);

  // ── Redirect when cart becomes empty ───────────────────────────────────────
  useEffect(() => {
    if (cart !== null && cart.groups.length === 0) router.push(ROUTES.CART);
  }, [cart, router]);

  // ── Coupon Handlers ────────────────────────────────────────────────────────
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

  const handleAddressSelect = useCallback((addr: DeliveryAddress) => {
    if (!uiFrozen) setCheckoutData((p) => ({ ...p, deliveryAddress: addr }));
  }, [uiFrozen]);

  const handlePlaceOrder = useCallback(() => {
    if (uiFrozen) return;
    if (!checkoutData.deliveryAddress) {
      toast.error("Please enter a delivery address");
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
    setUiFrozen(true);
    toast.success("Order details locked. Click Confirm Order to proceed.");
  }, [uiFrozen, checkoutData, prescriptionReviewed]);

  const handleConfirmOrder = useCallback(() => {
    if (!uiFrozen || !cart) return;
    setPendingCheckout({ checkoutData, cart });
    router.push(ROUTES.ORDER_CONFIRMATION);
  }, [uiFrozen, cart, checkoutData, setPendingCheckout, router]);

  if (!cart) return <div className="min-h-screen flex items-center justify-center"><LoadingSpinner size="lg" /></div>;

  const subtotal = getCartSubtotal();
  const totalItems = getCartItemCount();
  const isFormComplete = Boolean(checkoutData.deliveryAddress) && Boolean(checkoutData.deliveryOption) && Boolean(checkoutData.paymentMethod) && prescriptionReviewed;

  return (
    <div className="min-h-screen bg-neutral-light font-[var(--font-montserrat)]">
      <div className="w-full bg-accent px-4 sm:px-8 lg:px-10 xl:px-20 pt-4 pb-8">
        <div className="max-w-[1392px] mx-auto flex items-center justify-between gap-4">
          <h1 className="text-t-36-bold text-primary">Checkout</h1>
          <span className="text-t-21 text-foreground">[ {totalItems} items in total ]</span>
        </div>
      </div>

      <div className="max-w-[1392px] mx-auto px-4 sm:px-8 lg:px-10 xl:px-20 py-6">
        <div className="flex flex-col xl:flex-row gap-6 items-start">
          <div className="flex-1 min-w-0 bg-card rounded-3xl border-t-4 border-t-secondary p-4 sm:p-6 shadow-card flex flex-col gap-4">
            <ContactInformation contact={checkoutData.contact} />
            <div className="h-px bg-border" />
            
            <DeliveryAddressForm selectedAddress={checkoutData.deliveryAddress} onAddressSelect={handleAddressSelect} />
            <div className="h-px bg-border" />

            <DeliveryOptions 
              options={[...DELIVERY_OPTIONS] as DeliveryOption[]} 
              selected={checkoutData.deliveryOption} 
              frozen={uiFrozen} 
              onSelect={(opt) => !uiFrozen && setCheckoutData(p => ({ ...p, deliveryOption: opt }))} 
            />
            <div className="h-px bg-border" />

            {/* تم حل خطأ الـ icon هنا عبر الـ Type Casting الصحيح لمصفوفة الـ PAYMENT_MEHODS */}
            <PaymentMethods 
              methods={PAYMENT_METHODS as unknown as PaymentMethod[]} 
              selected={checkoutData.paymentMethod} 
              frozen={uiFrozen} 
              onSelect={(method) => !uiFrozen && setCheckoutData(p => ({ ...p, paymentMethod: method }))} 
            />
            <div className="h-px bg-border" />

            <OrderNotes 
              notes={checkoutData.orderNotes ?? ""} 
              onChange={(notes) => !uiFrozen && setCheckoutData(p => ({ ...p, orderNotes: notes }))} 
            />

            <button
              onClick={handlePlaceOrder}
              disabled={!isFormComplete || uiFrozen}
              className={`w-full h-[65px] rounded-xl border-none text-t-17-semibold transition-all ${
                isFormComplete && !uiFrozen ? "bg-primary text-card cursor-pointer" : "bg-border text-neutral opacity-70"
              }`}
            >
              {uiFrozen ? "Order Details Locked" : "Place Order"}
            </button>
            
            {uiFrozen && (
              <button onClick={() => setUiFrozen(false)} className="text-primary underline bg-transparent border-none py-2">
                Edit Order Details
              </button>
            )}
          </div>

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