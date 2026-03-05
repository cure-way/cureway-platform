"use client";
import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/store/cart.store";
import { getPendingPrescriptionItems } from "@/utils/cart.utils";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import CartTableHeader from "@/components/patient/cart/CartTableHeader";
import CartItemCard from "@/components/patient/cart/CartItemCard";
import AddProductButton from "@/components/patient/cart/AddProductButton";
import OrderSummary from "@/components/patient/cart/OrderSummary";
import { ROUTES } from "@/constants/cart.constants";

export default function CartPageDetailed() {
  const router = useRouter();
  const { cart, updateQuantity, removeItem, getCartItemCount, getCartSubtotal } = useCartStore();
  const [pendingIds, setPendingIds] = useState<string[]>([]);

  const handleCheckout = useCallback(() => {
    if (!cart) return;
    const pending = getPendingPrescriptionItems(cart.groups.flatMap(g => g.items));
    if (pending.length > 0) { setPendingIds(pending.map(i => i.id)); return; }
    router.push(ROUTES.CHECKOUT);
  }, [cart, router]);

  const handleQuantityChange = useCallback((itemId: string, delta: number) => {
    if (!cart) return;
    const item = cart.groups.flatMap(g => g.items).find(i => i.id === itemId);
    if (item) updateQuantity(itemId, item.quantity + delta);
  }, [cart, updateQuantity]);

  if (!cart) return <div className="flex justify-center p-12"><LoadingSpinner size="lg" text="Loading cart…" /></div>;

  if (cart.groups.length === 0)
    return (
      <div className="text-center py-16 px-6 font-[var(--font-montserrat)]">
        <div className="text-6xl mb-6">🛒</div>
        <h2 className="text-t-30-bold text-primary mb-3">Your cart is empty</h2>
        <p className="text-t-17 text-muted-foreground mb-8">Add medicines to get started</p>
        <button onClick={() => router.push(ROUTES.MEDICINES)} className="btn btn-lg btn-primary">Browse Medicines</button>
      </div>
    );

  return (
    <div className="max-w-[1392px] mx-auto px-4 sm:px-8 lg:px-10 xl:px-20 py-8">
      <div className="flex flex-col xl:flex-row gap-6 items-start">
        <div className="flex-1 min-w-0 bg-card rounded-3xl border-t-4 border-t-secondary p-4 sm:p-6 shadow-card">
          <CartTableHeader />
          {cart.groups.map(group => group.items.map(item => (
            <CartItemCard key={item.id} item={item}
              onQuantityChange={handleQuantityChange} onRemove={removeItem}
              onUploadPrescription={() => router.push(`/prescriptions?pharmacyId=${group.pharmacy.id}`)}
              highlightPrescription={pendingIds.includes(item.id)} />
          )))}
          <AddProductButton onClick={() => router.push(ROUTES.MEDICINES)} />
        </div>
        <div className="w-full xl:w-[350px] xl:flex-shrink-0">
          <OrderSummary subtotal={getCartSubtotal()} totalItems={getCartItemCount()}
            onCheckout={handleCheckout} onContinueShopping={() => router.push(ROUTES.MEDICINES)} />
        </div>
      </div>
    </div>
  );
}
