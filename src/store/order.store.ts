// =============================================================================
// ORDER STORE
//
// Complete flow:
//   1. Checkout page: user fills form → clicks Place Order (validates, freezes UI)
//      → clicks Confirm Order → calls setPendingCheckout({ checkoutData, cart })
//      → navigates to /Orderconfirmation
//
//   2. Confirmation page: user reviews → clicks Save
//      → calls store.placeOrder()
//      → placeOrder() calls ordersService.createOrder() → POST /orders (real API)
//      → on success: order added to list, pendingCheckout cleared
//      → navigate to /orders
//
//   3. Orders page on mount: calls fetchOrders() → GET /orders (always from server)
// =============================================================================

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { ordersService } from "@/services/orders.service";
import { mockOrders } from "@/services/orders.mock";
import type { Order } from "@/types/order";
import type { CheckoutData, Cart } from "@/types/cart";

type LoadingState = "idle" | "loading" | "success" | "error";

export interface PendingCheckout {
  checkoutData: CheckoutData;
  cart: Cart;
}

interface OrderStore {
  orders: Order[];
  loading: LoadingState;
  error: string | null;

  /** Set by Confirm Order button on checkout page; read by confirmation page */
  pendingCheckout: PendingCheckout | null;

  /** True while POST /orders is in-flight */
  placing: boolean;

  cancellingId: string | null;
  fetchingDetailsId: string | null;

  // ── Actions ────────────────────────────────────────────────────────────────

  setPendingCheckout: (data: PendingCheckout) => void;

  /**
   * THE ONLY FUNCTION that calls POST /orders.
   * Invoked by the confirmation page Save button.
   */
  placeOrder: () => Promise<Order>;

  addOrder: (order: Order) => void;

  /**
   * GET /orders — always fetches fresh from the server.
   * Called on mount of the Orders page.
   *
   * IMPORTANT: ordersService.getOrders() returns Order[] directly.
   * Do NOT do `response.data` — there is no wrapper.
   */
  fetchOrders: () => Promise<void>;

  fetchOrderDetails: (orderId: string) => Promise<Order>;

  cancelOrder: (orderId: string) => Promise<void>;

  clearOrders: () => void;
}

export const useOrderStore = create<OrderStore>()(
  persist(
    (set, get) => ({
      orders: [],
      loading: "idle" as LoadingState,
      error: null,
      pendingCheckout: null,
      placing: false,
      cancellingId: null,
      fetchingDetailsId: null,

      // ── setPendingCheckout ────────────────────────────────────────────────
      setPendingCheckout: (data: PendingCheckout) => {
        set({ pendingCheckout: data });
      },

      // ── placeOrder ────────────────────────────────────────────────────────
      placeOrder: async (): Promise<Order> => {
        const pending = get().pendingCheckout;
        if (!pending) {
          throw new Error(
            "No pending checkout found. Please go back and try again.",
          );
        }

        set({ placing: true });
        try {
          const order = await ordersService.createOrder(
            pending.checkoutData,
            pending.cart,
          );

          set((state) => ({
            orders: [order, ...state.orders.filter((o) => o.id !== order.id)],
            pendingCheckout: null,
          }));

          return order;
        } finally {
          set({ placing: false });
        }
      },

      // ── addOrder ──────────────────────────────────────────────────────────
      addOrder: (order: Order) => {
        set((state) => ({
          orders: [order, ...state.orders.filter((o) => o.id !== order.id)],
        }));
      },

      // ── fetchOrders ───────────────────────────────────────────────────────
      // ordersService.getOrders() returns Order[] — NOT { data: Order[] }.
      // Always fetches fresh from the server on every call.
      fetchOrders: async () => {
        set({ loading: "loading", error: null });
        try {
          const orders = await ordersService.getOrders();
          set({ orders, loading: "success" });
        } catch (err) {
          const message =
            err instanceof Error ? err.message : "Failed to load orders";

          const isNetworkError =
            message.includes("404") ||
            message.includes("Network Error") ||
            message.includes("ERR_CONNECTION") ||
            message.includes("ECONNREFUSED") ||
            message.includes("status code 404");

          const isDev = process.env.NODE_ENV !== "production";
          const hasApiUrl = Boolean(process.env.NEXT_PUBLIC_API_BASE_URL);

          if (isDev && !hasApiUrl && isNetworkError) {
            const current = get().orders;
            set({
              orders: current.length === 0 ? mockOrders : current,
              loading: "success",
            });
            return;
          }

          set({ loading: "error", error: message });
        }
      },

      // ── fetchOrderDetails ─────────────────────────────────────────────────
      fetchOrderDetails: async (orderId: string): Promise<Order> => {
        set({ fetchingDetailsId: orderId });
        try {
          const detailed = await ordersService.getOrderById(orderId);
          set((state) => {
            const exists = state.orders.some((o) => o.id === orderId);
            return {
              orders: exists
                ? state.orders.map((o) => (o.id === orderId ? detailed : o))
                : [detailed, ...state.orders],
            };
          });
          return detailed;
        } finally {
          set({ fetchingDetailsId: null });
        }
      },

      // ── cancelOrder ───────────────────────────────────────────────────────
      // Snapshot taken BEFORE optimistic update so rollback is correct.
      cancelOrder: async (orderId: string) => {
        const originalOrders = get().orders;
        set({ cancellingId: orderId });
        try {
          set((state) => ({
            orders: state.orders.map((o) =>
              o.id === orderId ? { ...o, status: "cancelled" as const } : o,
            ),
          }));

          await ordersService.cancelOrder(orderId);

          const freshOrders = await ordersService.getOrders();
          set({ orders: freshOrders });
        } catch (err) {
          set({ orders: originalOrders });
          throw err;
        } finally {
          set({ cancellingId: null });
        }
      },

      // ── clearOrders ───────────────────────────────────────────────────────
      clearOrders: () => {
        set({
          orders: [],
          loading: "idle",
          error: null,
          pendingCheckout: null,
          placing: false,
          cancellingId: null,
          fetchingDetailsId: null,
        });
      },
    }),
    {
      name: "cureway_orders",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        orders: state.orders,
        pendingCheckout: state.pendingCheckout,
      }),
    },
  ),
);
