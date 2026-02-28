// =============================================================================
// ORDERS SERVICE — Real API Integration
//
// Fetches patient orders from the real API endpoints:
//   GET  /order/my         — paginated list
//   GET  /order/my/{id}    — detailed order
//   PATCH /order/my/{id}/cancel — cancel order
//
// Reorder has NO endpoint in the API spec and stays mock.
//
// This service wraps ordersApiService and maps API types → UI Order type.
// =============================================================================

import { ordersApiService, mapApiOrderStatus } from "@/services/api.service";
import type { Order } from "@/types/order";
import type { PatientOrderListItemDto } from "@/types/api.types";

// ─────────────────────────────────────────────────────────────────────────────
// Type adapter: API list item → UI Order
// ─────────────────────────────────────────────────────────────────────────────

function adaptListItemToOrder(dto: PatientOrderListItemDto): Order {
  const pharmacyNames =
    dto.pharmacyOrders
      ?.map((po) => po.pharmacyName)
      .filter(Boolean)
      .join(" + ") ?? "—";

  const totalItems =
    dto.pharmacyOrders?.reduce((sum, po) => sum + (po.itemsCount ?? 0), 0) ?? 0;

  return {
    id: String(dto.id),
    pharmacyName: pharmacyNames,
    pharmacyId: String(dto.pharmacyOrders?.[0]?.pharmacyId ?? ""),
    address: dto.deliveryAddress?.addressText ?? "",
    itemsCount: totalItems,
    total: dto.totalAmount,
    deliveryFee: dto.deliveryFee,
    discount: 0,
    currency: dto.currency,
    orderedAtISO: dto.createdAt,
    status: mapApiOrderStatus(dto.status),
    // items only available in detailed view
    items: [],
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// Orders Service
// ─────────────────────────────────────────────────────────────────────────────

export const ordersService = {
  /**
   * Fetch all orders for the current patient.
   *
   * REAL API: GET /order/my
   */
  async getOrders(): Promise<Order[]> {
    const result = await ordersApiService.getMyOrders({
      limit: 100,
      sortOrder: "desc",
    });
    return (result.data ?? []).map(adaptListItemToOrder);
  },

  /**
   * Fetch full details for a single order.
   *
   * REAL API: GET /order/my/{id}
   */
  async getOrderById(orderId: string): Promise<Order> {
    const dto = await ordersApiService.getOrderById(Number(orderId));

    const pharmacyNames = dto.pharmacyOrders
      .map((po) => po.pharmacyName)
      .join(" + ");

    const allItems = dto.pharmacyOrders.flatMap((po) =>
      po.items.map((item) => ({
        id: String(item.inventoryId),
        name: item.medicineName,
        genericName: undefined as string | undefined,
        image: undefined as string | undefined,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
      })),
    );

    return {
      id: String(dto.id),
      pharmacyName: pharmacyNames,
      pharmacyId: String(dto.pharmacyOrders[0]?.pharmacyId ?? ""),
      address: dto.deliveryAddress?.addressText ?? "",
      itemsCount: allItems.length,
      items: allItems,
      total: dto.totalAmount,
      deliveryFee: dto.deliveryFee,
      discount: 0,
      currency: dto.currency,
      orderedAtISO: dto.createdAt,
      status: mapApiOrderStatus(dto.status),
    };
  },

  /**
   * Cancel an order.
   *
   * REAL API: PATCH /order/my/{id}/cancel
   */
  async cancelOrder(orderId: string): Promise<void> {
    await ordersApiService.cancelOrder(Number(orderId));
  },

  /**
   * Reorder — NO endpoint in API spec. Stays mock.
   *
   * MOCK: simulated delay only
   */
  async reorder(orderId: string): Promise<void> {
    // ── MOCK ────────────────────────────────────────────────────────────────
    // No reorder endpoint in the API spec. Simulate delay for UI animation.
    await new Promise<void>((r) => setTimeout(r, 900));
    void orderId;
    // ── END MOCK ─────────────────────────────────────────────────────────────
    //
    // When the real endpoint is added:
    // await http.post(API_ENDPOINTS.ORDERS.REORDER(orderId));
    // Then call cartStore.fetchCart() to sync the updated cart.
  },
};
