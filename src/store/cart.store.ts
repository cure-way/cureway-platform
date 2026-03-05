import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import type { Cart, CartItem, LoadingState } from "@/types/cart";
import { STORAGE_KEYS, CART_LIMITS } from "@/constants/cart.constants";
import { toast } from "sonner";

// ===================================================================
// CART STORE — Client-Side Only
// ===================================================================

const EMPTY_CART: Cart = {
  groups: [],
  totalItems: 0,
  subtotal: 0,
  savedForLater: [],
};

interface CartStore {
  // ── State ────────────────────────────────────────────────────
  cart: Cart;
  loading: LoadingState;
  error: string | null;
  lastSyncTime: number | null;

  // ── Cart CRUD ────────────────────────────────────────────────
  fetchCart: () => void;
  addItem: (pharmacy: { id: string; name: string; address: string }, item: CartItem) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  removePharmacyGroup: (pharmacyId: string) => void;
  clearCart: () => void;
  
  // ── Coupons ──────────────────────────────────────────────────
  applyCoupon: (code: string) => void;
  removeCoupon: () => void;

  // ── Prescription ─────────────────────────────────────────────
  markPrescriptionUploaded: (itemId: string) => void;

  // ── Selectors ────────────────────────────────────────────────
  getCartItemCount: () => number;
  getCartSubtotal: () => number;
  hasItems: () => boolean;
  isItemInCart: (itemId: string) => boolean;
  getItemQuantity: (itemId: string) => number;
}

// ─────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────
function recomputeTotals(cart: Cart): void {
  cart.groups.forEach((g) => {

    g.subtotal = g.items.reduce((s, i) => s + (i.price || 0) * i.quantity, 0);
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
      cart: EMPTY_CART,
      loading: "idle",
      error: null,
      lastSyncTime: null,

      fetchCart: () => {
        set((state) => {
          state.loading = "success";
        });
      },

      // ── addItem ────────────────────────────────────────────────
      addItem: (pharmacy, item) => {
        const invId = Number(item.inventoryId);
        

        if (!invId || invId < 10) {
          toast.error("Cannot add mock items. Please use the real store.");
          return;
        }

        set((state) => {
          let group = state.cart.groups.find((g) => g.pharmacy.id === pharmacy.id);
          
          if (!group) {
          
            group = {
              pharmacy: { 
                id: pharmacy.id, 
                name: pharmacy.name, 
                address: pharmacy.address,
                isAvailable: true // خاصية مطلوبة في النوع
              },
              items: [],
              subtotal: 0,
            };
            state.cart.groups.push(group);
          }
          
          if (group) {
            const existing = group.items.find((i) => i.id === item.id);
            if (existing) {
              existing.quantity += item.quantity;
            } else {
              group.items.push({ ...item });
            }
          }
          
          recomputeTotals(state.cart);
        });
        
        toast.success("Item added to cart");
      },

      removeItem: (itemId) => {
        set((state) => {
          state.cart.groups.forEach((g) => {
            g.items = g.items.filter((i) => i.id !== itemId);
          });
          recomputeTotals(state.cart);
        });
        toast.success("Item removed");
      },

      updateQuantity: (itemId, quantity) => {
        if (quantity < 1) {
          get().removeItem(itemId);
          return;
        }
        if (quantity > CART_LIMITS.MAX_QUANTITY_PER_ITEM) {
          toast.error(`Maximum quantity is ${CART_LIMITS.MAX_QUANTITY_PER_ITEM}`);
          return;
        }

        set((state) => {
          state.cart.groups.forEach((g) => {
            const item = g.items.find((i) => i.id === itemId);
            if (item) item.quantity = quantity;
          });
          recomputeTotals(state.cart);
        });
      },

      removePharmacyGroup: (pharmacyId) => {
        set((state) => {
          state.cart.groups = state.cart.groups.filter(
            (g) => g.pharmacy.id !== pharmacyId,
          );
          recomputeTotals(state.cart);
        });
        toast.success("Pharmacy removed");
      },

      clearCart: () => {
        set((state) => {
          state.cart = EMPTY_CART;
        });
        toast.success("Cart cleared");
      },

      // Placeholder functions
      applyCoupon: (code) => { console.log("Coupon application logic:", code); },
      removeCoupon: () => { console.log("Coupon removal logic"); },

      markPrescriptionUploaded: (itemId) => {
        set((state) => {
          state.cart.groups.forEach((g) => {
            const item = g.items.find((i) => i.id === itemId);
            if (item) item.prescriptionUploaded = true;
          });
        });
      },

      // ── Selectors ─────────────────────────────────────────────
      getCartItemCount: () => get().cart.totalItems || 0,
      getCartSubtotal: () => get().cart.subtotal || 0,
      hasItems: () => get().cart.groups.length > 0,
      isItemInCart: (itemId) => get().cart.groups.some((g) => g.items.some((i) => i.id === itemId)),
      getItemQuantity: (itemId) => {
        const { cart } = get();
        for (const g of cart.groups) {
          const item = g.items.find((i) => i.id === itemId);
          if (item) return item.quantity;
        }
        return 0;
      },
    })),
    {
      name: STORAGE_KEYS.CART,
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        cart: state.cart,
        lastSyncTime: state.lastSyncTime,
      }),
    },
  ),
);