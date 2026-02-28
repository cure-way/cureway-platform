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
import { checkoutService, addressService } from "@/services/cart.service";
import { DELIVERY_OPTIONS, PAYMENT_METHODS, ROUTES } from "@/constants/cart.constants";
import { MOCK_USER } from "@/data/mockData";
import type { CheckoutData, DeliveryAddress, DeliveryOption, PaymentMethod } from "@/types/cart";
import { calculateCartTotal } from "@/utils/cart.utils";
import { toast } from "sonner";

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, applyCoupon, removeCoupon, getCartSubtotal, getCartItemCount } = useCartStore();
  const { addOrder } = useOrderStore();

  // ── Contact / User ────────────────────────────────────────────────────────
  // Currently using MOCK_USER so the form is pre-filled during development.
  // TO CONNECT REAL API: replace MOCK_USER with the authenticated user from auth context.
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

  const [submitting, setSubmitting]         = useState(false);
  const [savedAddresses, setSavedAddresses] = useState<DeliveryAddress[]>([]);
  const [loadingAddresses, setLoadingAddresses] = useState(false);

  // ── Load saved addresses from API ─────────────────────────────────────────
  useEffect(() => {
    setLoadingAddresses(true);
    addressService.getAddresses()
      .then((addresses) => {
        setSavedAddresses(addresses);
        if (!checkoutData.deliveryAddress) {
          const defaultAddr = addresses.find((a) => a.isDefault) ?? addresses[0];
          if (defaultAddr) {
            setCheckoutData((p) => ({ ...p, deliveryAddress: defaultAddr }));
          }
        }
      })
      .catch(() => {
        // Silently ignore — user can still enter address manually
      })
      .finally(() => setLoadingAddresses(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [appliedCoupon,    setAppliedCoupon]    = useState<string | undefined>();
  const [discountPercent,  setDiscountPercent]  = useState<number | undefined>();
  const [uiFrozen,         setUiFrozen]         = useState(false);

  // ── Prescription check ────────────────────────────────────────────────────
  const prescriptionReviewed = !cart?.groups
    .flatMap((g) => g.items)
    .some((i) => i.requiresPrescription && !i.prescriptionUploaded);

  // ── Total recalculation ───────────────────────────────────────────────────
  useEffect(() => {
    const subtotal    = getCartSubtotal();
    const deliveryFee = checkoutData.deliveryOption?.price ?? 0;
    setCheckoutData((p) => ({
      ...p,
      deliveryFee,
      total: calculateCartTotal(subtotal, deliveryFee, p.discount),
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [checkoutData.deliveryOption?.id, checkoutData.discount]);

  // ── Redirect when cart is empty ───────────────────────────────────────────
  useEffect(() => {
    if (cart !== null && cart.groups.length === 0) router.push(ROUTES.CART);
  }, [cart, router]);

  // ── Coupon ────────────────────────────────────────────────────────────────
  const handleApplyCoupon = useCallback(
    async (code: string) => {
      try {
        const result = await applyCoupon(code);
        void result;
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

  // ── Place / Confirm order ─────────────────────────────────────────────────
  const handlePlaceOrder = useCallback(() => {
    if (!checkoutData.deliveryAddress) { toast.error("Please select a delivery address"); return; }
    if (!checkoutData.deliveryOption)  { toast.error("Please select a delivery option");  return; }
    if (!checkoutData.paymentMethod)   { toast.error("Please select a payment method");   return; }
    setUiFrozen(true);
  }, [checkoutData]);

  const handleConfirmOrder = useCallback(async () => {
    if (!uiFrozen) return;
    setSubmitting(true);
    try {
      const order      = await checkoutService.placeOrder(checkoutData, cart!);
      const totalItems = cart?.groups.reduce(
        (s, g) => s + g.items.reduce((ss, i) => ss + i.quantity, 0), 0,
      ) ?? 0;

      const deliveryAddrText = checkoutData.deliveryAddress
        ? [
            checkoutData.deliveryAddress.street,
            checkoutData.deliveryAddress.area,
            checkoutData.deliveryAddress.city,
          ]
            .filter(Boolean)
            .join(", ")
        : (order.groups[0]?.pharmacy.address ?? "");

      // Build the Order record.
      // pharmacyGroups stores the per-pharmacy breakdown for the confirmation page.
      addOrder({
        id:            order.orderId,
        pharmacyName:  order.groups.map((g) => g.pharmacy.name).join(" + "),
        pharmacyId:    order.groups[0]?.pharmacy.id ?? "",
        address:       deliveryAddrText,
        itemsCount:    order.totalItems,
        items: order.groups.flatMap((g) =>
          g.items.map((i) => ({
            id:          i.id,
            name:        i.name,
            genericName: i.genericName,
            image:       i.image,
            quantity:    i.quantity,
            unitPrice:   i.unitPrice,
          })),
        ),
        // Per-pharmacy breakdown for the confirmation page
        pharmacyGroups: order.groups.map((g) => ({
          pharmacyId:      g.pharmacy.id,
          pharmacyName:    g.pharmacy.name,
          pharmacyAddress: g.pharmacy.address,
          subtotal:        g.subtotal,
          items: g.items.map((i) => ({
            id:          i.id,
            name:        i.name,
            genericName: i.genericName,
            image:       i.image,
            quantity:    i.quantity,
            unitPrice:   i.unitPrice,
          })),
        })),
        total:            order.total,
        deliveryFee:      order.deliveryFee,
        discount:         order.discount,
        currency:         "ILS",
        paymentMethod:    checkoutData.paymentMethod?.name ?? "",
        deliveryAddress:  deliveryAddrText,
        orderedAtISO:     new Date().toISOString(),
        estimatedDelivery: undefined,
        status:           "processing",
      });

      toast.success("Order placed successfully!");
      router.push(
        `${ROUTES.ORDER_CONFIRMATION}?orderId=${order.orderId}&total=${order.total}&items=${totalItems}`,
      );
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to place order");
      setUiFrozen(false);
    } finally {
      setSubmitting(false);
    }
  }, [uiFrozen, checkoutData, cart, addOrder, router]);

  if (!cart) return (
    <div className="min-h-screen flex items-center justify-center">
      <LoadingSpinner size="lg" />
    </div>
  );

  const subtotal    = getCartSubtotal();
  const totalItems  = getCartItemCount();
  const isFormComplete =
    Boolean(checkoutData.deliveryAddress) &&
    Boolean(checkoutData.deliveryOption) &&
    Boolean(checkoutData.paymentMethod) &&
    prescriptionReviewed &&
    !uiFrozen;

  return (
    <div className="min-h-screen bg-neutral-light font-[var(--font-montserrat)]">
      {/* Header */}
      <div className="w-full bg-accent px-4 sm:px-8 lg:px-10 xl:px-20 pt-4 pb-8">
        <div className="max-w-[1392px] mx-auto flex items-center justify-between gap-4">
          <h1 className="text-t-36-bold text-primary">Checkout</h1>
          <span className="text-t-21 text-foreground">[ {totalItems} items in total ]</span>
        </div>
      </div>

      {/* Body */}
      <div className="max-w-[1392px] mx-auto px-4 sm:px-8 lg:px-10 xl:px-20 py-6">
        <div className="flex flex-col xl:flex-row gap-6 items-start">
          {/* Left panel */}
          <div className="flex-1 min-w-0 bg-card rounded-3xl border-t-4 border-t-secondary p-4 sm:p-6 shadow-card flex flex-col gap-4">
            <ContactInformation contact={checkoutData.contact} />
            <div className="h-px bg-border" />
            <DeliveryAddressForm
              selectedAddress={checkoutData.deliveryAddress}
              onAddressSelect={(addr: DeliveryAddress) =>
                setCheckoutData((p) => ({ ...p, deliveryAddress: addr }))
              }
              savedAddresses={savedAddresses}
              loadingAddresses={loadingAddresses}
            />
            <div className="h-px bg-border" />
            <DeliveryOptions
              options={[...DELIVERY_OPTIONS]}
              selected={checkoutData.deliveryOption}
              frozen={uiFrozen}
              onSelect={(opt: DeliveryOption) =>
                setCheckoutData((p) => ({ ...p, deliveryOption: opt }))
              }
            />
            <div className="h-px bg-border" />
            <PaymentMethods
              methods={[...PAYMENT_METHODS]}
              selected={checkoutData.paymentMethod}
              frozen={uiFrozen}
              onSelect={(method: PaymentMethod) =>
                setCheckoutData((p) => ({ ...p, paymentMethod: method }))
              }
            />
            <div className="h-px bg-border" />
            {!(uiFrozen && !(checkoutData.orderNotes ?? "").trim()) && (
              <OrderNotes
                notes={checkoutData.orderNotes ?? ""}
                onChange={(notes) => setCheckoutData((p) => ({ ...p, orderNotes: notes }))}
              />
            )}
            {!uiFrozen && (
              <button
                onClick={isFormComplete ? handlePlaceOrder : undefined}
                disabled={submitting}
                className={`w-full h-[65px] rounded-xl border-none text-t-17-semibold transition-all ${
                  isFormComplete && !submitting
                    ? "bg-primary text-card cursor-pointer hover:bg-primary-hover"
                    : "bg-border text-neutral cursor-default"
                }`}
              >
                Place Order
              </button>
            )}
          </div>

          {/* Sidebar */}
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
              onConfirm={handleConfirmOrder}
              submitting={submitting}
              confirmEnabled={uiFrozen}
              prescriptionReviewed={prescriptionReviewed}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
