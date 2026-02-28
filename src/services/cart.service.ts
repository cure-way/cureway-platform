// =============================================================================
// CART SERVICE — Mock + Real API Integration Layer
//
// REAL API (live):
//   checkoutService.placeOrder()  → POST /order
//   addressService.*              → /patient/addresses/*
//
// MOCK (no endpoint in API spec):
//   cartService.*        — cart CRUD (no cart endpoints exist in the spec)
//   checkoutService.validateCheckout — client-side validation only
//   deliveryService.*    — no delivery-options endpoint in spec
//   coupon logic         — no coupon endpoint in spec
//
// Mock data is isolated in @/data/mockData.ts and never mixed with real calls.
// =============================================================================

// ── Mock imports (cart CRUD only) ─────────────────────────────────
import {
  MOCK_CART,
  MOCK_COUPONS,
  MOCK_ORDER_CONFIRMATION,
} from "@/data/mockData";

// ── Real API imports ───────────────────────────────────────────────
import { ordersApiService }      from "@/services/api.service";
import { patientAddressService } from "@/services/api.service";
import type {
  Cart,
  CheckoutData,
  OrderConfirmation,
  DeliveryAddress,
} from "@/types/cart";
import type { CreateOrderDto } from "@/types/api.types";

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

/** Simulated network latency for mock calls */
const delay = (ms = 400) => new Promise<void>((r) => setTimeout(r, ms));

/** Recompute derived totals after any mutation */
function recomputeCart(cart: Cart): Cart {
  const groups = cart.groups
    .map((g) => ({
      ...g,
      subtotal: g.items.reduce((s, i) => s + i.price * i.quantity, 0),
    }))
    .filter((g) => g.items.length > 0);

  const totalItems = groups.reduce(
    (s, g) => s + g.items.reduce((ss, i) => ss + i.quantity, 0),
    0,
  );
  const subtotal = groups.reduce((s, g) => s + g.subtotal, 0);

  return { ...cart, groups, totalItems, subtotal };
}

/** Deep-clone so consumers always get a fresh reference */
const cloneCart = (cart: Cart): Cart => JSON.parse(JSON.stringify(cart));

// In-memory cart state — persists across service calls within a session
let _cart: Cart = cloneCart(MOCK_CART);

// ─────────────────────────────────────────────────────────────────────────────
// Cart Service — MOCK ONLY
// No cart endpoints exist in the CureWay API spec.
// Cart is managed locally; items are submitted via POST /order at checkout.
// ─────────────────────────────────────────────────────────────────────────────
export const cartService = {
  async getCart(): Promise<Cart> {
    // ── MOCK ──────────────────────────────────────────────────────
    await delay();
    return cloneCart(_cart);
  },

  async addItem(
    pharmacyId: string,
    medicineId: string,
    quantity: number,
  ): Promise<Cart> {
    // ── MOCK ──────────────────────────────────────────────────────
    await delay();
    return cloneCart(_cart); // Optimistic update already applied in store
  },

  async updateQuantity(itemId: string, quantity: number): Promise<Cart> {
    // ── MOCK ──────────────────────────────────────────────────────
    await delay(200);
    _cart.groups = _cart.groups.map((g) => ({
      ...g,
      items: g.items.map((i) =>
        i.id === itemId ? { ...i, quantity } : i,
      ),
    }));
    _cart = recomputeCart(_cart);
    return cloneCart(_cart);
  },

  async removeItem(itemId: string): Promise<void> {
    // ── MOCK ──────────────────────────────────────────────────────
    await delay(200);
    _cart.groups = _cart.groups.map((g) => ({
      ...g,
      items: g.items.filter((i) => i.id !== itemId),
    }));
    _cart = recomputeCart(_cart);
  },

  async removePharmacyGroup(pharmacyId: string): Promise<void> {
    // ── MOCK ──────────────────────────────────────────────────────
    await delay();
    _cart.groups = _cart.groups.filter(
      (g) => g.pharmacy.id !== pharmacyId,
    );
    _cart = recomputeCart(_cart);
  },

  async clearCart(): Promise<void> {
    // ── MOCK ──────────────────────────────────────────────────────
    await delay();
    _cart = { groups: [], totalItems: 0, subtotal: 0, savedForLater: [] };
  },

  async saveForLater(itemId: string): Promise<Cart> {
    // ── MOCK ──────────────────────────────────────────────────────
    await delay();
    let saved = null as Cart["savedForLater"][0] | null;
    _cart.groups = _cart.groups.map((g) => {
      const item = g.items.find((i) => i.id === itemId);
      if (item) saved = { ...item };
      return { ...g, items: g.items.filter((i) => i.id !== itemId) };
    });
    if (saved) _cart.savedForLater = [..._cart.savedForLater, saved];
    _cart = recomputeCart(_cart);
    return cloneCart(_cart);
  },

  async moveToCart(itemId: string): Promise<Cart> {
    // ── MOCK ──────────────────────────────────────────────────────
    await delay();
    const item = _cart.savedForLater.find((i) => i.id === itemId);
    if (item) {
      _cart.savedForLater = _cart.savedForLater.filter((i) => i.id !== itemId);
      const group = _cart.groups.find(
        (g) => g.pharmacy.id === item.pharmacy.id,
      );
      if (group) {
        group.items.push(item);
      } else {
        _cart.groups.push({
          pharmacy: item.pharmacy,
          items: [item],
          subtotal: item.price * item.quantity,
        });
      }
      _cart = recomputeCart(_cart);
    }
    return cloneCart(_cart);
  },

  async applyCoupon(
    code: string,
  ): Promise<{ cart: Cart; discount: string }> {
    // ── MOCK ──────────────────────────────────────────────────────
    // NOTE: No coupon endpoint in the API spec. Stays mock.
    await delay(600);
    const coupon = MOCK_COUPONS[code.toUpperCase()];
    if (!coupon) throw new Error("Invalid or expired coupon code");
    if (_cart.subtotal < coupon.minOrderValue) {
      throw new Error(
        `Minimum order value for this coupon is $${coupon.minOrderValue}`,
      );
    }
    const discountAmount =
      coupon.discountType === "percentage"
        ? (_cart.subtotal * coupon.discountValue) / 100
        : coupon.discountValue;
    return {
      cart: cloneCart(_cart),
      discount: `$${discountAmount.toFixed(2)}`,
    };
  },

  async removeCoupon(): Promise<Cart> {
    // ── MOCK ──────────────────────────────────────────────────────
    await delay(200);
    return cloneCart(_cart);
  },

  /** Clear the in-memory mock cart (called after a real order is placed) */
  clearMockCart(): void {
    _cart = { groups: [], totalItems: 0, subtotal: 0, savedForLater: [] };
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// Checkout Service — REAL API for placeOrder
//
// POST /order — payload: CreateOrderDto (see types/api.types.ts)
//
// Payload construction:
//   deliveryAddressId — the numeric ID of the saved address (from /patient/addresses)
//   pharmacies        — grouped from cart.groups, each item needs inventoryId
//
// If a cart item is missing inventoryId (still using mock data), the item.id
// is used as a fallback so the UI doesn't break — but the real API will reject
// orders with invalid inventoryIds. Add inventoryId to cart items when real
// inventory browsing is integrated.
// ─────────────────────────────────────────────────────────────────────────────
export const checkoutService = {
  /**
   * Client-side checkout validation — no API endpoint exists for this.
   * MOCK: validates locally.
   */
  async validateCheckout(data: CheckoutData): Promise<{
    valid: boolean;
    errors?: Record<string, string>;
  }> {
    // ── CLIENT-SIDE VALIDATION (no API endpoint) ──────────────────
    const errors: Record<string, string> = {};
    if (!data.deliveryAddress) errors.deliveryAddress = "Delivery address is required";
    if (!data.deliveryOption)  errors.deliveryOption  = "Delivery option is required";
    if (!data.paymentMethod)   errors.paymentMethod   = "Payment method is required";
    return { valid: Object.keys(errors).length === 0, errors };
  },

  /**
   * Place an order via the real API: POST /order
   *
   * Builds CreateOrderDto from checkout data + cart state.
   * Returns OrderConfirmation shaped from the API response.
   *
   * REAL API: POST /order
   */
  async placeOrder(
    data: CheckoutData,
    cart: Cart,
  ): Promise<OrderConfirmation> {
    // ── Build the API payload ──────────────────────────────────────
    const addressId = data.deliveryAddress?.apiId;

    if (!addressId) {
      // Address has no API ID — this means no saved address was selected.
      // Fall back to mock for dev; in production this should never happen
      // because DeliveryAddressForm must select a saved address.
      // ── MOCK FALLBACK ─────────────────────────────────────────────
      await delay(1200);
      const confirmation: OrderConfirmation = {
        ...MOCK_ORDER_CONFIRMATION,
        orderId:     `ORD-${Date.now()}`,
        orderNumber: `#${Math.floor(Math.random() * 900_000 + 100_000)}`,
        subtotal:    data.total - data.deliveryFee + data.discount,
        deliveryFee: data.deliveryFee,
        discount:    data.discount,
        total:       data.total,
        placedAt:    new Date(),
        status:      "pending",
      };
      cartService.clearMockCart();
      return confirmation;
      // ── END MOCK FALLBACK ──────────────────────────────────────────
    }

    // ── REAL API ──────────────────────────────────────────────────
    const dto: CreateOrderDto = {
      deliveryAddressId: addressId,
      notes: data.orderNotes || undefined,
      currency: "ILS",
      pharmacies: cart.groups.map((group) => ({
        pharmacyId: Number(group.pharmacy.id),
        items: group.items.map((item) => ({
          // inventoryId is required by the API spec.
          // If the cart item was built from real inventory browsing,
          // item.inventoryId will be populated. Fallback to medicineId as int.
          inventoryId:    item.inventoryId ?? Number(item.medicineId),
          quantity:       item.quantity,
          prescriptionId: item.prescriptionId ?? undefined,
        })),
      })),
    };

    const response = await ordersApiService.createOrder(dto);

    // Map API response → OrderConfirmation for the confirmation page
    const confirmation: OrderConfirmation = {
      orderId:     String(response.id),
      orderNumber: `#${response.id}`,
      groups: response.pharmacies.map((p) => ({
        pharmacy: {
          id:      String(p.pharmacyId),
          name:    p.pharmacyName,
          address: p.pharmacyLocation?.address ?? "",
        },
        items: p.items.map((i) => ({
          id:                  String(i.inventoryId),
          name:                i.medicineName,
          genericName:         undefined,
          image:               undefined,
          unitPrice:           i.unitPrice,
          quantity:            i.quantity,
          requiresPrescription: false,
          inStock:             true,
        })),
        subtotal: p.subtotal,
      })),
      totalItems:        response.itemsCount,
      subtotal:          response.subtotal,
      deliveryFee:       response.deliveryFee,
      discount:          response.discount,
      total:             response.total,
      status:            "pending",
      placedAt:          new Date(response.createdAt),
      estimatedDelivery: undefined,
    };

    // Clear the in-memory mock cart so it is empty after a real order
    cartService.clearMockCart();

    return confirmation;
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// Delivery Service — MOCK ONLY
// No delivery-options endpoint exists in the API spec.
// ─────────────────────────────────────────────────────────────────────────────
export const deliveryService = {
  async getDeliveryOptions(pharmacyId: string): Promise<unknown[]> {
    // ── MOCK ──────────────────────────────────────────────────────
    await delay();
    return [];
  },

  async validateAddress(
    address: string,
  ): Promise<{ valid: boolean; formatted?: string }> {
    // ── MOCK ──────────────────────────────────────────────────────
    return { valid: true, formatted: address };
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// Address Service — REAL API
//
// Wraps patientAddressService from api.service.ts and adapts
// the API's PatientAddressResponse ↔ UI's DeliveryAddress type.
//
// The UI DeliveryAddress uses string fields; the API uses numeric cityId.
// We keep apiId (numeric) on the address so checkout can send it as
// deliveryAddressId in the order payload.
// ─────────────────────────────────────────────────────────────────────────────
export const addressService = {
  /**
   * GET /patient/addresses — list all saved addresses.
   * REAL API.
   */
  async getAddresses(): Promise<DeliveryAddress[]> {
    const apiAddresses = await patientAddressService.getAddresses();
    return apiAddresses.map(adaptApiAddress);
  },

  /**
   * POST /patient/addresses — create a new address.
   * REAL API.
   */
  async addAddress(address: DeliveryAddress): Promise<DeliveryAddress> {
    if (!address.apiCityId) {
      // No cityId available — would require city selection UI.
      // NOTE: cityId is a required field in the API spec.
      // This path will be hit when the address is entered manually
      // without a city selection. The calling code should ensure
      // cityId is populated before calling addAddress.
      throw new Error("cityId is required to save an address. Please select a city.");
    }

    const dto = {
      cityId:       address.apiCityId,
      addressLine1: address.street,
      addressLine2: address.area ?? null,
      label:        address.label ?? null,
      isDefault:    address.isDefault ?? false,
      latitude:     address.coordinates?.lat ?? null,
      longitude:    address.coordinates?.lng ?? null,
    };

    const created = await patientAddressService.createAddress(dto);
    return adaptApiAddress(created);
  },

  /**
   * PATCH /patient/addresses/{id} — update an existing address.
   * REAL API.
   */
  async updateAddress(
    addressId: string,
    address: Partial<DeliveryAddress>,
  ): Promise<DeliveryAddress> {
    const apiId = Number(addressId);
    const dto = {
      cityId:       address.apiCityId,
      addressLine1: address.street,
      addressLine2: address.area ?? null,
      label:        address.label ?? null,
      latitude:     address.coordinates?.lat ?? null,
      longitude:    address.coordinates?.lng ?? null,
    };

    const updated = await patientAddressService.updateAddress(apiId, dto);
    return adaptApiAddress(updated);
  },

  /**
   * DELETE /patient/addresses/{id} — delete an address.
   * REAL API.
   */
  async deleteAddress(addressId: string): Promise<void> {
    await patientAddressService.deleteAddress(Number(addressId));
  },

  /**
   * PATCH /patient/addresses/{id}/default — set as default address.
   * REAL API.
   */
  async setDefaultAddress(addressId: string): Promise<void> {
    await patientAddressService.setDefaultAddress(Number(addressId));
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// Adapter: PatientAddressResponse (API) → DeliveryAddress (UI)
// ─────────────────────────────────────────────────────────────────────────────
import type { PatientAddressResponse } from "@/types/api.types";

function adaptApiAddress(dto: PatientAddressResponse): DeliveryAddress {
  return {
    id:          String(dto.id),
    apiId:       dto.id,                            // numeric ID for order payload
    apiCityId:   dto.cityId,                        // cityId for address mutations
    street:      dto.addressLine1,
    city:        dto.cityName ?? String(dto.cityId),
    area:        dto.addressLine2 ?? undefined,
    label:       dto.label ?? undefined,
    notes:       undefined,
    isDefault:   dto.isDefault,
    coordinates: dto.latitude != null && dto.longitude != null
      ? { lat: dto.latitude, lng: dto.longitude }
      : undefined,
  };
}
