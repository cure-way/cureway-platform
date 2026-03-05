"use client";
import { useCallback } from "react";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/store/cart.store";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import PharmacyGroupCard from "./PharmacyGroupCard";
import OrderSummary from "./OrderSummary";
import AddProductButton from "./AddProductButton";
import StatusWarning from "./StatusWarning";
import { ROUTES } from "@/constants/cart.constants";

export default function CartPageSummary() {
  const router = useRouter();
  const { cart, getCartItemCount, getCartSubtotal } = useCartStore();
  const handleCheckout = useCallback(() => { router.push(ROUTES.CHECKOUT); }, [router]);

  if (!cart) return <div className="flex justify-center p-12"><LoadingSpinner size="lg" text="Loading cart…" /></div>;

  if (cart.groups.length === 0)
    return (
      <div className="text-center py-16 px-6 font-[var(--font-montserrat)]">
        <div className="text-6xl mb-6">🛒</div>
        <h2 className="text-t-30-bold text-primary mb-8">Your cart is empty</h2>
        <button onClick={() => router.push(ROUTES.MEDICINES)} className="btn btn-lg btn-primary">Browse Medicines</button>
      </div>
    );

  return (
    <div className="max-w-[1392px] mx-auto px-4 sm:px-8 lg:px-10 xl:px-20 py-8">
      <div className="flex flex-col xl:flex-row gap-6 items-start">
        <div className="flex-1 min-w-0 bg-card rounded-3xl border-t-4 border-t-secondary p-4 sm:p-6 shadow-card">
          {cart.groups.map(group => (
            <div key={group.pharmacy.id}>
              <PharmacyGroupCard group={group} />
              {group.items.some(i => i.requiresPrescription) && <StatusWarning />}
            </div>
          ))}
          <AddProductButton onClick={() => router.push(ROUTES.MEDICINES)} />
        </div>
        <div className="w-full xl:w-[350px] xl:flex-shrink-0">
          <OrderSummary subtotal={getCartSubtotal()} totalItems={getCartItemCount()} onCheckout={handleCheckout} onContinueShopping={() => router.push(ROUTES.MEDICINES)} />
        </div>
      </div>
    </div>
  );
}
