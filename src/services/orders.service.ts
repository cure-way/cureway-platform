// =============================================================================
// ORDERS SERVICE
//
// Real API endpoints:
//   POST /order                  → createOrder()
//   GET  /order/my               → getOrders()
//   GET  /order/my/{id}          → getOrderById()
//   PATCH /order/my/{id}/cancel  → cancelOrder()
//
// createOrder() owns the COMPLETE pre-order pipeline so nothing outside
// this file needs to know about addresses or city IDs:
//
//   1. Auth check
//   2. Mock-data guard      – pharmacyId < 10 or inventoryId < 10 → throw
//   3. POST /patient/addresses  – build a real deliveryAddressId from the
//                                  address text the user typed in the form
//   4. POST /order              – clean Swagger-compliant payload
// =============================================================================

import {
  ordersApiService,
  patientAddressService,
  mapApiOrderStatus,
} from "@/services/api.service";
import { http, getAccessToken } from "@/lib/api/http";
import type { Order, OrderItem, OrderPharmacyGroup } from "@/types/order";
import type { CheckoutData, Cart } from "@/types/cart";
import type {
  PatientOrderListItemDto,
  PatientOrderDetailsResponseDto,
  CreatePharmacyOrderItemResponseDto,
  CreateOrderDto,
} from "@/types/api.types";

// =============================================================================
// Internal helpers
// =============================================================================

interface CityDto { id: number; name: string; }

/**
 * GET /cities → return the cityId that best matches cityName.
 * Falls back to cities[0] for single-city deployments (e.g. Gaza-only).
 * Throws only when the endpoint returns an empty list.
 */
async function resolveCityId(cityName: string): Promise<number> {
  const res = await http.get<
    CityDto[] | { data?: CityDto[]; items?: CityDto[] }
  >("/cities");

  let cities: CityDto[];
  if (Array.isArray(res.data)) {
    cities = res.data;
  } else {
    cities =
      (res.data as { data?: CityDto[] }).data ??
      (res.data as { items?: CityDto[] }).items ??
      [];
  }

  if (cities.length === 0) {
    throw new Error(
      "City list is empty — cannot create a delivery address. Please contact support.",
    );
  }

  const q = cityName.trim().toLowerCase();
  const match = q
    ? cities.find((c) => c.name.toLowerCase().includes(q))
    : undefined;

  return (match ?? cities[0]).id;
}

// =============================================================================
// Private response adapters
// =============================================================================

function adaptItem(item: CreatePharmacyOrderItemResponseDto): OrderItem {
  return {
    id:          String(item.inventoryId),
    name:        item.medicineName,
    genericName: undefined,
    image:       undefined,
    quantity:    item.quantity,
    unitPrice:   item.unitPrice,
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
    id:              String(dto.id),
    pharmacyName:    pharmacyNames,
    pharmacyId:      String(dto.pharmacyOrders?.[0]?.pharmacyId ?? ""),
    address:         addressText,
    deliveryAddress: addressText || undefined,
    itemsCount:      totalItems,
    total:           dto.totalAmount ?? 0,
    deliveryFee:     dto.deliveryFee ?? 0,
    discount,
    currency:        dto.currency ?? "ILS",
    orderedAtISO:    dto.createdAt,
    status:          mapApiOrderStatus(dto.status),
    items:           [],
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

  const pharmacyGroups: OrderPharmacyGroup[] = dto.pharmacyOrders.map(
    (po) => ({
      pharmacyId:      String(po.pharmacyId),
      pharmacyName:    po.pharmacyName,
      pharmacyAddress: po.pharmacyLocation?.address ?? "",
      subtotal:        po.subtotal,
      items:           po.items.map(adaptItem),
    }),
  );

  const addressText = dto.deliveryAddress?.addressText ?? "";
  const discount = Math.max(
    0,
    (dto.subAmount ?? 0) + (dto.deliveryFee ?? 0) - (dto.totalAmount ?? 0),
  );

  return {
    id:              String(dto.id),
    pharmacyName:    pharmacyNames,
    pharmacyId:      String(dto.pharmacyOrders[0]?.pharmacyId ?? ""),
    address:         addressText,
    deliveryAddress: addressText || undefined,
    itemsCount:      allItems.length,
    items:           allItems,
    pharmacyGroups,
    total:           dto.totalAmount ?? 0,
    deliveryFee:     dto.deliveryFee ?? 0,
    discount,
    currency:        dto.currency ?? "ILS",
    orderedAtISO:    dto.createdAt,
    status:          mapApiOrderStatus(dto.status),
  };
}

// =============================================================================
// Public service
// =============================================================================

export const ordersService = {

  // ──────────────────────────────────────────────────────────────────────────
  async createOrder(checkoutData: CheckoutData, cart: Cart): Promise<Order> {

    // ── Step 1: Auth ───────────────────────────────────────────────────────
    if (!getAccessToken()) {
      throw new Error("You are not signed in. Please sign in and try again.");
    }

    // ── Step 2: Mock-data guard ────────────────────────────────────────────
    // Real IDs from this backend are ≥ 10. IDs 1–9 are stale mock values
    // stuck in localStorage. We reject them with a clear, actionable message.
    const MOCK_ID_THRESHOLD = 10;

    for (const group of cart.groups) {
      const pharmacyId = Number(group.pharmacy.id);

      if (!pharmacyId || isNaN(pharmacyId) || pharmacyId < MOCK_ID_THRESHOLD) {
        throw new Error(
          "Please clear your cart and add items from the real store",
        );
      }

      for (const item of group.items) {
        const inventoryId = item.inventoryId;

        if (
          inventoryId === null ||
          inventoryId === undefined ||
          isNaN(Number(inventoryId)) ||
          Number(inventoryId) < MOCK_ID_THRESHOLD
        ) {
          throw new Error(
            "Please clear your cart and add items from the real store",
          );
        }
      }
    }

    // ── Step 3: Create delivery address ───────────────────────────────────
    const addr        = checkoutData.deliveryAddress;
    const addressLine1 = addr?.street?.trim() || addr?.city?.trim() || "Delivery Address";
    const cityName     = addr?.city?.trim() ?? "";

    let deliveryAddressId: number;
    try {
      const cityId  = await resolveCityId(cityName);
      const created = await patientAddressService.createAddress({
        cityId,
        addressLine1,
        addressLine2: addr?.area?.trim()            || null,
        label:        "Order Address",
        isDefault:    false,
        latitude:     addr?.coordinates?.lat        ?? null,
        longitude:    addr?.coordinates?.lng        ?? null,
      });
      deliveryAddressId = created.id;
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      throw new Error(`Could not save delivery address: ${msg}`);
    }

    // ── Step 4: Build and POST the order ──────────────────────────────────
    const notes = [
      addr
        ? [addr.street, addr.area, addr.city].filter(Boolean).join(", ")
        : "",
      checkoutData.orderNotes?.trim() ?? "",
    ]
      .filter(Boolean)
      .join(" | ");

    // Exact Swagger shape:
    // pharmacies: Array<{ pharmacyId: number, items: Array<{ inventoryId: number, quantity: number }> }>
    const pharmacies: CreateOrderDto["pharmacies"] = cart.groups.map(
      (group) => ({
        pharmacyId: Number(group.pharmacy.id),
        items: group.items.map((item) => ({
          inventoryId: item.inventoryId as number,
          quantity:    item.quantity,
          ...(item.prescriptionId
            ? { prescriptionId: item.prescriptionId }
            : {}),
        })),
      }),
    );

    const dto: CreateOrderDto = {
      deliveryAddressId,
      currency:   "ILS",
      notes:      notes || undefined,
      pharmacies,
    };

    console.info("[orders] POST /order payload:", JSON.stringify(dto, null, 2));

    const response = await ordersApiService.createOrder(dto);
    console.info("[orders] POST /order response:", response);

    if (!response?.id) {
      throw new Error(
        "Order was not created — unexpected server response. Please try again.",
      );
    }

    // ── Adapt response → UI Order ─────────────────────────────────────────
    const pharmacyGroups: OrderPharmacyGroup[] = response.pharmacies.map(
      (p) => ({
        pharmacyId:      String(p.pharmacyId),
        pharmacyName:    p.pharmacyName,
        pharmacyAddress: p.pharmacyLocation?.address ?? "",
        subtotal:        p.subtotal,
        items:           p.items.map(adaptItem),
      }),
    );

    const responseAddress =
      response.deliveryAddress?.addressText ??
      [addr?.street, addr?.area, addr?.city].filter(Boolean).join(", ");

    return {
      id:              String(response.id),
      pharmacyName:    response.pharmacies.map((p) => p.pharmacyName).join(" + "),
      pharmacyId:      String(response.pharmacies[0]?.pharmacyId ?? ""),
      address:         responseAddress,
      deliveryAddress: responseAddress || undefined,
      itemsCount:      response.itemsCount,
      items:           response.pharmacies.flatMap((p) => p.items.map(adaptItem)),
      pharmacyGroups,
      total:           response.total,
      deliveryFee:     response.deliveryFee,
      discount:        response.discount ?? 0,
      currency:        response.currency ?? "ILS",
      orderedAtISO:    response.createdAt,
      status:          "processing",
      paymentMethod:   checkoutData.paymentMethod?.name ?? "",
    };
  },

  // ──────────────────────────────────────────────────────────────────────────
  async getOrders(): Promise<Order[]> {
    const result = await ordersApiService.getMyOrders({
      limit:     100,
      sortOrder: "desc",
    });
    return (result.data ?? []).map(adaptListItem);
  },

  async getOrderById(orderId: string): Promise<Order> {
    const dto = await ordersApiService.getOrderById(Number(orderId));
    return adaptDetailItem(dto);
  },

  async cancelOrder(orderId: string): Promise<void> {
    await ordersApiService.cancelOrder(Number(orderId));
  },

  async reorder(orderId: string): Promise<void> {
    await new Promise<void>((r) => setTimeout(r, 900));
    void orderId;
  },
};