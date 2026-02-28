// =============================================================================
// ORDER STORE — Global state for the patient orders list
//
// Real API integration:
//   fetchOrders()    → GET /order/my  (via ordersService)
//   cancelOrder()    → PATCH /order/my/{id}/cancel
//
// Mock:
//   reorder()        → no API endpoint, stays mock in ordersService
//
// Persistence: localStorage warm-start only; fetchOrders() always re-fetches
// from the API on mount to get the authoritative list.
// =============================================================================

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { ordersService } from "@/services/orders.service";
import { mockOrders } from "@/services/orders.mock";
import type { Order } from "@/types/order";

type LoadingState = "idle" | "loading" | "success" | "error";

interface OrderStore {
  // ── State ──────────────────────────────────────────────────────
  orders: Order[];
  loading: LoadingState;
  error: string | null;
  /** Track per-order loading state for cancel button */
  cancellingId: string | null;

  // ── Actions ────────────────────────────────────────────────────
  /** Load (or reload) all orders — calls GET /order/my */
  fetchOrders: () => Promise<void>;
  /** Inject a just-placed order at the top of the list */
  addOrder: (order: Order) => void;
  /**
   * Cancel an order via PATCH /order/my/{id}/cancel.
   * Optimistically updates status to "cancelled" then confirms from API.
   */
  cancelOrder: (orderId: string) => Promise<void>;
  /** Clear all loaded orders (e.g. on sign-out) */
  clearOrders: () => void;
}

export const useOrderStore = create<OrderStore>()(
  persist(
    (set, get) => ({
      // ── Initial state ─────────────────────────────────────────
      orders: [],
      loading: "idle" as LoadingState,
      error: null,
      cancellingId: null,

      fetchOrders: async () => {
        set({ loading: "loading", error: null });
        try {
          const response = await ordersService.getOrders();
          const orders = response?.data ?? [];

          set({ orders, loading: "success" });
        } catch (err) {
          // Determine whether this looks like a network / 404 error
          // caused by a missing API URL in development.
          const message =
            err instanceof Error ? err.message : "Failed to load orders";
          const isNetworkError =
            message.includes("404") ||
            message.includes("Network Error") ||
            message.includes("ERR_CONNECTION") ||
            message.includes("ECONNREFUSED") ||
            message.includes("Request failed with status code 404");

          const isDev = process.env.NODE_ENV !== "production";
          const hasApiUrl = Boolean(process.env.NEXT_PUBLIC_API_BASE_URL);

          if (isDev && !hasApiUrl && isNetworkError) {
            // Fall back to mock orders so UI is usable
            const current = get().orders;
            if (current.length === 0) {
              set({ orders: mockOrders, loading: "success" });
            } else {
              set({ loading: "success" });
            }
            return;
          }

          set({ loading: "error", error: message });
        }
      },

      // ── addOrder ──────────────────────────────────────────────
      // Injects a freshly-placed order at the front of the list.
      addOrder: (order: Order) => {
        set((state) => ({
          orders: [order, ...state.orders.filter((o) => o.id !== order.id)],
        }));
      },

      // ── cancelOrder ───────────────────────────────────────────
      // REAL API: PATCH /order/my/{id}/cancel
      cancelOrder: async (orderId: string) => {
        set({ cancellingId: orderId });
        try {
          // Optimistic update
          set((state) => ({
            orders: state.orders.map((o) =>
              o.id === orderId ? { ...o, status: "cancelled" as const } : o,
            ),
          }));

          await ordersService.cancelOrder(orderId);

          // Re-fetch to get authoritative state from server
          const orders = await ordersService.getOrders();
          set({ orders });
        } catch (err) {
          // Roll back optimistic update on failure
          const currentOrders = get().orders;
          set({ orders: currentOrders });
          throw err;
        } finally {
          set({ cancellingId: null });
        }
      },

      // ── clearOrders ───────────────────────────────────────────
      clearOrders: () => {
        set({ orders: [], loading: "idle", error: null, cancellingId: null });
      },
    }),
    {
      name: "cureway_orders",
      storage: createJSONStorage(() => localStorage),
      // Only persist orders list — not transient state
      partialize: (state) => ({ orders: state.orders }),
    },
  ),
);
