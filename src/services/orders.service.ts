// =============================================================================
// ORDERS SERVICE
//
// All order API calls in one place. Adapts raw API types → UI types.
//
// Endpoints:
//   POST /orders              → createOrder()
//   GET  /orders              → getOrders()
//   GET  /orders/{id}         → getOrderById()
//   PATCH /orders/{id}/cancel → cancelOrder()
//
// ADDRESS NOTE:
//   The API requires deliveryAddressId (a saved address foreign key).
//   Since saved addresses are not used in this flow, the user-entered address
//   text is appended to the order notes so the pharmacy sees the full address.
//   deliveryAddressId defaults to 1 as a placeholder — replace with the real
//   default address ID from your backend if needed.
// =============================================================================

import { ordersApiService, mapApiOrderStatus } from "@/services/api.service";
import type { Order, OrderItem, OrderPharmacyGroup } from "@/types/order";
import type { CheckoutData, Cart } from "@/types/cart";
import type {
  PatientOrderListItemDto,
  PatientOrderDetailsResponseDto,
  CreatePharmacyOrderItemResponseDto,
  CreateOrderDto,
} from "@/types/api.types";

// =============================================================================
// Private adapters
// =============================================================================

function adaptItem(item: CreatePharmacyOrderItemResponseDto): OrderItem {
  return {
    id: String(item.inventoryId),
    name: item.medicineName,
    genericName: undefined,
    image: undefined,
    quantity: item.quantity,
    unitPrice: item.unitPrice,
  };
}

function adaptListItem(dto: PatientOrderListItemDto): Order {
  const pharmacyNames =
    dto.pharmacyOrders
      ?.map((po) => po.pharmacyName)
      .filter(Boolean)
      .join(" + ") ?? "—";

  const totalItems =
    dto.pharmacyOrders?.reduce((s, po) => s + (po.itemsCount ?? 0), 0) ?? 0;

  const discount = Math.max(
    0,
    (dto.subAmount ?? 0) + (dto.deliveryFee ?? 0) - (dto.totalAmount ?? 0),
  );

  const addressText = dto.deliveryAddress?.addressText ?? "";

  return {
    id: String(dto.id),
    pharmacyName: pharmacyNames,
    pharmacyId: String(dto.pharmacyOrders?.[0]?.pharmacyId ?? ""),
    address: addressText,
    deliveryAddress: addressText || undefined,
    itemsCount: totalItems,
    total: dto.totalAmount ?? 0,
    deliveryFee: dto.deliveryFee ?? 0,
    discount,
    currency: dto.currency ?? "ILS",
    orderedAtISO: dto.createdAt,
    status: mapApiOrderStatus(dto.status),
    items: [],
  };
}

function adaptDetailItem(dto: PatientOrderDetailsResponseDto): Order {
  const pharmacyNames = dto.pharmacyOrders
    .map((po) => po.pharmacyName)
    .filter(Boolean)
    .join(" + ");

  const allItems: OrderItem[] = dto.pharmacyOrders.flatMap((po) =>
    po.items.map(adaptItem),
  );

  const pharmacyGroups: OrderPharmacyGroup[] = dto.pharmacyOrders.map((po) => ({
    pharmacyId: String(po.pharmacyId),
    pharmacyName: po.pharmacyName,
    pharmacyAddress: po.pharmacyLocation?.address ?? "",
    subtotal: po.subtotal,
    items: po.items.map(adaptItem),
  }));

  const addressText = dto.deliveryAddress?.addressText ?? "";
  const discount = Math.max(
    0,
    (dto.subAmount ?? 0) + (dto.deliveryFee ?? 0) - (dto.totalAmount ?? 0),
  );

  return {
    id: String(dto.id),
    pharmacyName: pharmacyNames,
    pharmacyId: String(dto.pharmacyOrders[0]?.pharmacyId ?? ""),
    address: addressText,
    deliveryAddress: addressText || undefined,
    itemsCount: allItems.length,
    items: allItems,
    pharmacyGroups,
    total: dto.totalAmount ?? 0,
    deliveryFee: dto.deliveryFee ?? 0,
    discount,
    currency: dto.currency ?? "ILS",
    orderedAtISO: dto.createdAt,
    status: mapApiOrderStatus(dto.status),
  };
}

// =============================================================================
// Public service
// =============================================================================

export const ordersService = {
  // ──────────────────────────────────────────────────────────────────────────
  // POST /orders
  //
  // Called ONLY from order.store.ts → placeOrder()
  // which is triggered by the confirmation page's "Save" button.
  //
  // Address handling:
  //   The API requires deliveryAddressId (numeric FK to a saved address).
  //   Since we're not using the saved-address API, we fall back to
  //   deliveryAddressId: 1 and append the user-entered address text to notes.
  //   Update the fallback ID to match a real address in your backend if needed.
  // ──────────────────────────────────────────────────────────────────────────
  async createOrder(checkoutData: CheckoutData, cart: Cart): Promise<Order> {
    // Build address text from whatever the user typed/selected
    const enteredAddress = [
      checkoutData.deliveryAddress?.street,
      checkoutData.deliveryAddress?.area,
      checkoutData.deliveryAddress?.city,
    ]
      .filter(Boolean)
      .join(", ");

    // Combine user notes with the address text so the backend sees the full address
    const combinedNotes = [
      enteredAddress ? `Delivery address: ${enteredAddress}` : "",
      checkoutData.orderNotes?.trim() ?? "",
    ]
      .filter(Boolean)
      .join(" | ");

    // Use the saved address API ID if available (from a previously selected
    // saved address), otherwise fall back to 1.
    // TODO: replace 1 with the real default address ID for your backend.
    const deliveryAddressId = checkoutData.deliveryAddress?.apiId ?? 1;

    const dto: CreateOrderDto = {
      deliveryAddressId,
      notes: combinedNotes || undefined,
      currency: "ILS",
      pharmacies: cart.groups.map((group) => ({
        pharmacyId: Number(group.pharmacy.id),
        items: group.items
          .filter((item) => {
            const invId = item.inventoryId ?? Number(item.medicineId);
            if (!invId || isNaN(invId)) {
              console.warn("[orders] Skipping item with invalid inventoryId:", item.name, item);
            }
            return invId && !isNaN(invId);
          })
          .map((item) => ({
            inventoryId: item.inventoryId ?? Number(item.medicineId),
            quantity: item.quantity,
            prescriptionId: item.prescriptionId ?? undefined,
          })),
      })).filter((group) => {
        const pid = group.pharmacyId;
        if (!pid || isNaN(pid)) {
          console.warn("[orders] Skipping pharmacy group with invalid pharmacyId");
        }
        return pid && !isNaN(pid) && group.items.length > 0;
      }),
    };

    console.info("[orders] POST /orders payload:", JSON.stringify(dto, null, 2));

    const response = await ordersApiService.createOrder(dto);
    console.info("[orders] POST /orders raw response:", response);

    if (!response || response.id == null) {
      console.error("[orders] Unexpected POST /orders response shape:", response);
      throw new Error(
        "Order was not created — unexpected response from server. Please try again.",
      );
    }

    console.info("[orders] POST /orders response id:", response.id);

    const pharmacyGroups: OrderPharmacyGroup[] = response.pharmacies.map((p) => ({
      pharmacyId: String(p.pharmacyId),
      pharmacyName: p.pharmacyName,
      pharmacyAddress: p.pharmacyLocation?.address ?? "",
      subtotal: p.subtotal,
      items: p.items.map(adaptItem),
    }));

    const allItems: OrderItem[] = response.pharmacies.flatMap((p) =>
      p.items.map(adaptItem),
    );

    const responseAddress = response.deliveryAddress?.addressText ?? enteredAddress;

    return {
      id: String(response.id),
      pharmacyName: response.pharmacies.map((p) => p.pharmacyName).join(" + "),
      pharmacyId: String(response.pharmacies[0]?.pharmacyId ?? ""),
      address: responseAddress,
      deliveryAddress: responseAddress || undefined,
      itemsCount: response.itemsCount,
      items: allItems,
      pharmacyGroups,
      total: response.total,
      deliveryFee: response.deliveryFee,
      discount: response.discount ?? 0,
      currency: response.currency ?? "ILS",
      orderedAtISO: response.createdAt,
      status: "processing",
      paymentMethod: checkoutData.paymentMethod?.name ?? "",
    };
  },

  // ──────────────────────────────────────────────────────────────────────────
  // GET /orders — returns Order[] directly (not wrapped in { data: ... })
  // ──────────────────────────────────────────────────────────────────────────
  async getOrders(): Promise<Order[]> {
    const result = await ordersApiService.getMyOrders({
      limit: 100,
      sortOrder: "desc",
    });
    return (result.data ?? []).map(adaptListItem);
  },

  // ──────────────────────────────────────────────────────────────────────────
  // GET /orders/{id} — full detail with items + pharmacyGroups
  // ──────────────────────────────────────────────────────────────────────────
  async getOrderById(orderId: string): Promise<Order> {
    const dto = await ordersApiService.getOrderById(Number(orderId));
    return adaptDetailItem(dto);
  },

  // ──────────────────────────────────────────────────────────────────────────
  // PATCH /orders/{id}/cancel
  // ──────────────────────────────────────────────────────────────────────────
  async cancelOrder(orderId: string): Promise<void> {
    await ordersApiService.cancelOrder(Number(orderId));
  },

  // Reorder — no API endpoint in spec, stays mock
  async reorder(orderId: string): Promise<void> {
    await new Promise<void>((r) => setTimeout(r, 900));
    void orderId;
  },
};
