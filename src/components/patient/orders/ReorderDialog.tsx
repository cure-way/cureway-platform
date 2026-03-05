"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/store/cart.store";
import { ordersService } from "@/services/orders.service";
import type { Order } from "@/types/order";
import { toast } from "sonner";

export function ReorderDialog({ order, onClose }: { order: Order; onClose: () => void }) {
  const [state, setState] = useState<"idle" | "loading" | "success">("idle");
  const router    = useRouter();
  const fetchCart = useCartStore((s) => s.fetchCart);

  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", h);
    return () => document.removeEventListener("keydown", h);
  }, [onClose]);

  const handleReorder = async () => {
    setState("loading");
    try {
      // ── ordersService.reorder() ────────────────────────────────────────
      // Currently a mock: simulates a delay then resolves.
      // To connect the real API: update services/orders.service.ts →
      // ordersService.reorder() to call POST /api/orders/:id/reorder.
      // The backend adds the items to the user's active cart and returns
      // the updated cart. fetchCart() then syncs the store.
      await ordersService.reorder(order.id);

      // Sync the cart store so the updated cart is visible on /cart
      await fetchCart();

      setState("success");
      setTimeout(() => { onClose(); router.push("/cart"); }, 1200);
    } catch (err) {
      setState("idle");
      toast.error(
        err instanceof Error ? err.message : "Failed to reorder. Please try again.",
      );
    }
  };

  const items        = order.items ?? [];
  const previewItems = items.slice(0, 3);
  const moreCount    = items.length - 3;

  return (
    <>
      <style>{`@keyframes dialog-pop{from{opacity:0;transform:scale(0.94) translateY(12px)}to{opacity:1;transform:scale(1) translateY(0)}}.reorder-dialog{animation:dialog-pop 0.25s cubic-bezier(0.34,1.12,0.64,1) both}@keyframes check-draw{from{stroke-dashoffset:50}to{stroke-dashoffset:0}}.check-path{stroke-dasharray:50;animation:check-draw 0.4s 0.1s ease both}`}</style>
      <div
        onClick={state === "loading" ? undefined : onClose}
        className="fixed inset-0 bg-black/40 z-[1000] flex items-center justify-center p-4 backdrop-blur-sm"
      >
        <div
          className="reorder-dialog w-full max-w-[400px] bg-card rounded-3xl p-6 shadow-2xl font-[var(--font-montserrat)]"
          onClick={(e) => e.stopPropagation()}
        >
          {state === "success" ? (
            <div className="flex flex-col items-center py-4 gap-4">
              <div className="w-16 h-16 rounded-full bg-success-light flex items-center justify-center">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="hsl(var(--success))" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <path className="check-path" d="M20 6 9 17l-5-5"/>
                </svg>
              </div>
              <h3 className="text-t-21-bold text-foreground m-0">Added to Cart!</h3>
              <p className="text-t-14 text-muted-foreground m-0">Redirecting to your cart…</p>
            </div>
          ) : (
            <>
              <div className="w-14 h-14 rounded-2xl bg-accent flex items-center justify-center mb-4">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="hsl(var(--primary))" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
                  <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
                </svg>
              </div>
              <h3 className="text-t-21-bold text-foreground mb-1">Reorder #{order.id}?</h3>
              <p className="text-t-14 text-muted-foreground mb-4">
                This will add {items.length} item{items.length !== 1 ? "s" : ""} from {order.pharmacyName} back to your cart
              </p>
              {previewItems.length > 0 && (
                <div className="bg-neutral-light rounded-xl p-3 mb-5 flex flex-col gap-2">
                  {previewItems.map((item) => (
                    <div key={item.id} className="flex items-center gap-2">
                      <span className="text-base">💊</span>
                      <span className="text-t-14 text-foreground truncate flex-1">{item.name}</span>
                      <span className="text-t-12 text-muted-foreground flex-shrink-0">×{item.quantity}</span>
                    </div>
                  ))}
                  {moreCount > 0 && (
                    <p className="text-t-12 text-muted-foreground m-0 pl-7">+{moreCount} more items</p>
                  )}
                </div>
              )}
              <div className="flex gap-3">
                <button
                  onClick={onClose}
                  disabled={state === "loading"}
                  className="flex-1 h-11 rounded-xl border border-primary bg-card text-primary text-t-17-semibold cursor-pointer hover:bg-accent transition-colors disabled:opacity-50 disabled:cursor-default"
                >
                  Cancel
                </button>
                <button
                  onClick={handleReorder}
                  disabled={state === "loading"}
                  className={`flex-1 h-11 rounded-xl border-none text-card text-t-17-semibold flex items-center justify-center gap-2 transition-colors ${
                    state === "loading"
                      ? "bg-secondary cursor-default"
                      : "bg-primary hover:bg-primary-hover cursor-pointer"
                  }`}
                >
                  {state === "loading" ? (
                    <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Adding…</>
                  ) : (
                    "Reorder"
                  )}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
