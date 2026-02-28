// ===================================================================
// CART STORE — Global State Management (Zustand + Immer + Persist)
// ===================================================================

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import type {
  Cart,
  CartItem,
  LoadingState,
} from "@/types/cart";
import { cartService } from "@/services/cart.service";
import { STORAGE_KEYS, CART_LIMITS } from "@/constants/cart.constants";
import { toast } from "sonner";

// ─────────────────────────────────────────────────────────────────
// Store Interface
// ─────────────────────────────────────────────────────────────────
interface CartStore {
  // ── State ────────────────────────────────────────────────────
  cart:          Cart | null;
  loading:       LoadingState;
  error:         string | null;
  lastSyncTime:  number | null;
  /**
   * Pending rollback callbacks keyed by update ID.
   * Stored as a plain object (not Map) so Zustand/localStorage can
   * serialise and deserialise this slice correctly.
   */
  optimisticUpdates: Record<string, () => void>;

  // ── Cart CRUD ────────────────────────────────────────────────
  fetchCart:           ()                                     => Promise<void>;
  addItem:             (pharmacyId: string, item: CartItem)   => Promise<void>;
  removeItem:          (itemId: string)                       => Promise<void>;
  updateQuantity:      (itemId: string, quantity: number)     => Promise<void>;
  removePharmacyGroup: (pharmacyId: string)                   => Promise<void>;
  clearCart:           ()                                     => Promise<void>;

  // ── Prescription ─────────────────────────────────────────────
  markPrescriptionUploaded: (itemId: string) => void;

  // ── Save-for-later ───────────────────────────────────────────
  saveForLater: (itemId: string) => Promise<void>;
  moveToCart:   (itemId: string) => Promise<void>;

  // ── Coupon ───────────────────────────────────────────────────
  applyCoupon:  (code: string) => Promise<void>;
  removeCoupon: ()             => Promise<void>;

  // ── Optimistic update helpers ────────────────────────────────
  addOptimisticUpdate:     (key: string, rollback: () => void) => void;
  commitOptimisticUpdate:  (key: string)                       => void;
  rollbackOptimisticUpdate:(key: string)                       => void;

  // ── Sync ─────────────────────────────────────────────────────
  syncCart:       () => Promise<void>;
  setLastSyncTime:(time: number) => void;

  // ── Selectors ────────────────────────────────────────────────
  getCartItemCount: () => number;
  getCartSubtotal:  () => number;
  hasItems:         () => boolean;
  isItemInCart:     (itemId: string) => boolean;
  getItemQuantity:  (itemId: string) => number;
}

// ─────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────

/** Recompute subtotals and totals from items */
function recomputeTotals(cart: Cart): void {
  cart.groups.forEach((g) => {
    g.subtotal = g.items.reduce((s, i) => s + i.price * i.quantity, 0);
  });
  cart.groups = cart.groups.filter((g) => g.items.length > 0);
  cart.totalItems = cart.groups.reduce(
    (s, g) => s + g.items.reduce((ss, i) => ss + i.quantity, 0),
    0,
  );
  cart.subtotal = cart.groups.reduce((s, g) => s + g.subtotal, 0);
}

// ─────────────────────────────────────────────────────────────────
// Store
// ─────────────────────────────────────────────────────────────────
export const useCartStore = create<CartStore>()(
  persist(
    immer((set, get) => ({
      // ── Initial state ──────────────────────────────────────────
      cart:              null,
      loading:           "idle" as LoadingState,
      error:             null,
      lastSyncTime:      null,
      optimisticUpdates: {},

      // ── fetchCart ──────────────────────────────────────────────
      fetchCart: async () => {
        set({ loading: "loading", error: null });
        try {
          const cart = await cartService.getCart();
          set({ cart, loading: "success", lastSyncTime: Date.now() });
        } catch (err) {
          const message =
            err instanceof Error ? err.message : "Failed to fetch cart";
          set({ loading: "error", error: message });
          toast.error(message);
        }
      },

      // ── addItem ────────────────────────────────────────────────
      addItem: async (pharmacyId, item) => {
        const previousCart = get().cart;

        // Optimistic update
        set((state) => {
          if (!state.cart) {
            state.cart = {
              groups:      [],
              totalItems:  0,
              subtotal:    0,
              savedForLater: [],
            };
          }
          let group = state.cart.groups.find(
            (g) => g.pharmacy.id === pharmacyId,
          );
          if (!group) {
            group = {
              pharmacy:   item.pharmacy,
              items:      [],
              subtotal:   0,
            };
            state.cart.groups.push(group);
          }
          const existing = group.items.find((i) => i.id === item.id);
          if (existing) {
            existing.quantity += item.quantity;
          } else {
            group.items.push({ ...item });
          }
          recomputeTotals(state.cart);
        });

        const key = `add-${item.id}`;
        get().addOptimisticUpdate(key, () => set({ cart: previousCart }));

        try {
          const updatedCart = await cartService.addItem(
            pharmacyId,
            item.medicineId,
            item.quantity,
          );
          set({ cart: updatedCart });
          get().commitOptimisticUpdate(key);
          toast.success("Item added to cart");
        } catch (err) {
          get().rollbackOptimisticUpdate(key);
          toast.error(
            err instanceof Error ? err.message : "Failed to add item",
          );
          throw err;
        }
      },

      // ── removeItem ─────────────────────────────────────────────
      removeItem: async (itemId) => {
        const previousCart = get().cart;

        set((state) => {
          if (!state.cart) return;
          state.cart.groups = state.cart.groups.map((g) => ({
            ...g,
            items: g.items.filter((i) => i.id !== itemId),
          }));
          recomputeTotals(state.cart);
        });

        const key = `remove-${itemId}`;
        get().addOptimisticUpdate(key, () => set({ cart: previousCart }));

        try {
          await cartService.removeItem(itemId);
          get().commitOptimisticUpdate(key);
          toast.success("Item removed from cart");
        } catch (err) {
          get().rollbackOptimisticUpdate(key);
          toast.error(
            err instanceof Error ? err.message : "Failed to remove item",
          );
          throw err;
        }
      },

      // ── updateQuantity ─────────────────────────────────────────
      updateQuantity: async (itemId, quantity) => {
        if (quantity < 1) return get().removeItem(itemId);
        if (quantity > CART_LIMITS.MAX_QUANTITY_PER_ITEM) {
          toast.error(`Maximum quantity is ${CART_LIMITS.MAX_QUANTITY_PER_ITEM}`);
          return;
        }

        const previousCart = get().cart;

        set((state) => {
          if (!state.cart) return;
          state.cart.groups.forEach((g) => {
            const item = g.items.find((i) => i.id === itemId);
            if (item) item.quantity = quantity;
          });
          recomputeTotals(state.cart);
        });

        const key = `update-${itemId}`;
        get().addOptimisticUpdate(key, () => set({ cart: previousCart }));

        try {
          const updatedCart = await cartService.updateQuantity(itemId, quantity);
          set({ cart: updatedCart });
          get().commitOptimisticUpdate(key);
        } catch (err) {
          get().rollbackOptimisticUpdate(key);
          toast.error(
            err instanceof Error ? err.message : "Failed to update quantity",
          );
          throw err;
        }
      },

      // ── removePharmacyGroup ────────────────────────────────────
      removePharmacyGroup: async (pharmacyId) => {
        const previousCart = get().cart;

        set((state) => {
          if (!state.cart) return;
          state.cart.groups = state.cart.groups.filter(
            (g) => g.pharmacy.id !== pharmacyId,
          );
          recomputeTotals(state.cart);
        });

        const key = `remove-pharmacy-${pharmacyId}`;
        get().addOptimisticUpdate(key, () => set({ cart: previousCart }));

        try {
          await cartService.removePharmacyGroup(pharmacyId);
          get().commitOptimisticUpdate(key);
          toast.success("Pharmacy removed from cart");
        } catch (err) {
          get().rollbackOptimisticUpdate(key);
          toast.error(
            err instanceof Error ? err.message : "Failed to remove pharmacy",
          );
          throw err;
        }
      },

      // ── clearCart ──────────────────────────────────────────────
      clearCart: async () => {
        const previousCart = get().cart;
        set({ cart: null });
        try {
          await cartService.clearCart();
          toast.success("Cart cleared");
        } catch (err) {
          set({ cart: previousCart });
          toast.error(
            err instanceof Error ? err.message : "Failed to clear cart",
          );
          throw err;
        }
      },

      // ── markPrescriptionUploaded ───────────────────────────────
      // Synchronous — updates in-memory state immediately.
      // The prescriptions page calls this after a successful upload
      // so cart/page.tsx auto-rechecks and switches to summary view.
      markPrescriptionUploaded: (itemId) => {
        set((state) => {
          if (!state.cart) return;
          state.cart.groups.forEach((g) => {
            const item = g.items.find((i) => i.id === itemId);
            if (item) item.prescriptionUploaded = true;
          });
        });
      },

      // ── saveForLater ───────────────────────────────────────────
      saveForLater: async (itemId) => {
        const previousCart = get().cart;

        set((state) => {
          if (!state.cart) return;
          let saved: CartItem | null = null;
          state.cart.groups = state.cart.groups
            .map((g) => {
              const item = g.items.find((i) => i.id === itemId);
              if (item) { saved = { ...item }; }
              return { ...g, items: g.items.filter((i) => i.id !== itemId) };
            })
            .filter((g) => g.items.length > 0);
          if (saved) state.cart.savedForLater.push(saved);
          recomputeTotals(state.cart);
        });

        try {
          await cartService.saveForLater(itemId);
          toast.success("Item saved for later");
        } catch (err) {
          set({ cart: previousCart });
          toast.error(
            err instanceof Error ? err.message : "Failed to save item",
          );
          throw err;
        }
      },

      // ── moveToCart ─────────────────────────────────────────────
      moveToCart: async (itemId) => {
        const previousCart = get().cart;
        try {
          const updatedCart = await cartService.moveToCart(itemId);
          set({ cart: updatedCart });
          toast.success("Item moved to cart");
        } catch (err) {
          set({ cart: previousCart });
          toast.error(
            err instanceof Error ? err.message : "Failed to move item",
          );
          throw err;
        }
      },

      // ── applyCoupon ────────────────────────────────────────────
      applyCoupon: async (code) => {
        try {
          const result = await cartService.applyCoupon(code);
          set({ cart: result.cart });
          toast.success(`Coupon applied! You saved ${result.discount}`);
        } catch (err) {
          toast.error(
            err instanceof Error ? err.message : "Invalid coupon code",
          );
          throw err;
        }
      },

      // ── removeCoupon ───────────────────────────────────────────
      removeCoupon: async () => {
        try {
          const cart = await cartService.removeCoupon();
          set({ cart });
          toast.success("Coupon removed");
        } catch (err) {
          toast.error(
            err instanceof Error ? err.message : "Failed to remove coupon",
          );
          throw err;
        }
      },

      // ── Optimistic helpers ────────────────────────────────────
      addOptimisticUpdate: (key, rollback) => {
        set((state) => { state.optimisticUpdates[key] = rollback; });
      },
      commitOptimisticUpdate: (key) => {
        set((state) => { delete state.optimisticUpdates[key]; });
      },
      rollbackOptimisticUpdate: (key) => {
        const rollback = get().optimisticUpdates[key];
        if (rollback) {
          rollback();
          set((state) => { delete state.optimisticUpdates[key]; });
        }
      },

      // ── Sync ──────────────────────────────────────────────────
      syncCart: async () => {
        try {
          const cart = await cartService.getCart();
          set({ cart, lastSyncTime: Date.now() });
        } catch {
          // Silently ignore — sync failures are non-critical
        }
      },
      setLastSyncTime: (time) => set({ lastSyncTime: time }),

      // ── Selectors ─────────────────────────────────────────────
      getCartItemCount: () => {
        const { cart } = get();
        if (!cart) return 0;
        return cart.groups.reduce(
          (s, g) => s + g.items.reduce((ss, i) => ss + i.quantity, 0),
          0,
        );
      },
      getCartSubtotal: () => get().cart?.subtotal ?? 0,
      hasItems:        () => (get().cart?.groups.length ?? 0) > 0,
      isItemInCart: (itemId) =>
        get().cart?.groups.some((g) => g.items.some((i) => i.id === itemId)) ?? false,
      getItemQuantity: (itemId) => {
        const { cart } = get();
        if (!cart) return 0;
        for (const g of cart.groups) {
          const item = g.items.find((i) => i.id === itemId);
          if (item) return item.quantity;
        }
        return 0;
      },
    })),
    {
      name:    STORAGE_KEYS.CART,
      storage: createJSONStorage(() => localStorage),
      // Only persist the data that actually needs to survive a page reload.
      // Omit `optimisticUpdates` (functions aren't serialisable) and
      // transient loading/error state.
      partialize: (state) => ({
        cart:         state.cart,
        lastSyncTime: state.lastSyncTime,
      }),
    },
  ),
);
