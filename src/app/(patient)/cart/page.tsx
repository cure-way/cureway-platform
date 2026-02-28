"use client";
import { useEffect, useState } from "react";
import { useCartStore } from "@/store/cart.store";
import { getPendingPrescriptionItems } from "@/utils/cart.utils";
import CartHeader from "@/components/patient/cart/CartHeader";
import CartPageDetailed from "@/components/patient/cart/CartPageDetailed";
import CartPageSummary from "@/components/patient/cart/CartPageSummary";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";

type CartView = "detailed" | "summary";

export default function CartPage() {
  const { cart, fetchCart, loading } = useCartStore();
  const [view, setView] = useState<CartView>("detailed");

  useEffect(() => { if (!cart) fetchCart(); /* eslint-disable-next-line */ }, []);
  useEffect(() => {
    if (!cart) return;
    const pending = getPendingPrescriptionItems(cart.groups.flatMap(g => g.items));
    setView(pending.length === 0 ? "summary" : "detailed");
  }, [cart]);

  if (loading === "loading" && !cart)
    return <div className="min-h-screen flex items-center justify-center"><LoadingSpinner size="lg" text="Loading your cart…" /></div>;

  const totalItems = cart?.groups.reduce((s, g) => s + g.items.reduce((ss, i) => ss + i.quantity, 0), 0) ?? 0;

  return (
    <div className="min-h-screen bg-background">
      <CartHeader totalItems={totalItems} />
      <main>{view === "detailed" ? <CartPageDetailed /> : <CartPageSummary />}</main>
    </div>
  );
}
