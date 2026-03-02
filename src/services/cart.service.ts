// =============================================================================
// CART SERVICE — Mock + Real API Integration Layer
// =============================================================================

import {
  MOCK_CART,
  MOCK_COUPONS,
  MOCK_ORDER_CONFIRMATION,
} from "@/data/mockData";

import { ordersApiService } from "@/services/api.service";
import { patientAddressService } from "@/services/api.service";
import type {
  Cart,
  CheckoutData,
  OrderConfirmation,
  DeliveryAddress,
} from "@/types/cart";
import type { CreateOrderDto, PatientAddressResponse } from "@/types/api.types";

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

// In-memory cart state
let _cart: Cart = cloneCart(MOCK_CART);

// ─────────────────────────────────────────────────────────────────────────────
// Cart Service — MOCK ONLY
// ─────────────────────────────────────────────────────────────────────────────
export const cartService = {
  async getCart(): Promise<Cart> {
    await delay();
    return cloneCart(_cart);
  },

  async addItem(
    pharmacyId: string,
    medicineId: string,
    quantity: number,
  ): Promise<Cart> {
    await delay();
    return cloneCart(_cart);
  },

  async updateQuantity(itemId: string, quantity: number): Promise<Cart> {
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
    await delay(200);
    _cart.groups = _cart.groups.map((g) => ({
      ...g,
      items: g.items.filter((i) => i.id !== itemId),
    }));
    _cart = recomputeCart(_cart);
  },

  async removePharmacyGroup(pharmacyId: string): Promise<void> {
    await delay();
    _cart.groups = _cart.groups.filter(
      (g) => g.pharmacy.id !== pharmacyId,
    );
    _cart = recomputeCart(_cart);
  },

  async clearCart(): Promise<void> {
    await delay();
    _cart = { groups: [], totalItems: 0, subtotal: 0, savedForLater: [] };
  },

  async saveForLater(itemId: string): Promise<Cart> {
    await delay();
    let saved = null as any;
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
    await delay(600);
    const upperCode = code.toUpperCase();
    const coupon = MOCK_COUPONS[upperCode];

    if (!coupon) throw new Error("Invalid or expired coupon code");


    const minOrderValue = coupon.minOrderValue ?? 0;
    const discountValue = coupon.discountValue ?? 0;

    if (_cart.subtotal < minOrderValue) {
      throw new Error(
        `Minimum order value for this coupon is $${minOrderValue}`,
      );
    }

    const discountAmount =
      coupon.discountType === "percentage"
        ? (_cart.subtotal * discountValue) / 100
        : discountValue;

    return {
      cart: cloneCart(_cart),
      discount: `$${discountAmount.toFixed(2)}`,
    };
  },

  async removeCoupon(): Promise<Cart> {
    await delay(200);
    return cloneCart(_cart);
  },

  clearMockCart(): void {
    _cart = { groups: [], totalItems: 0, subtotal: 0, savedForLater: [] };
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// Checkout Service — REAL API
// ─────────────────────────────────────────────────────────────────────────────
export const checkoutService = {
  async validateCheckout(data: CheckoutData): Promise<{
    valid: boolean;
    errors?: Record<string, string>;
  }> {
    const errors: Record<string, string> = {};
    if (!data.deliveryAddress) errors.deliveryAddress = "Delivery address is required";
    if (!data.deliveryOption)  errors.deliveryOption  = "Delivery option is required";
    if (!data.paymentMethod)   errors.paymentMethod   = "Payment method is required";
    return { valid: Object.keys(errors).length === 0, errors };
  },

  async placeOrder(
    data: CheckoutData,
    cart: Cart,
  ): Promise<OrderConfirmation> {
    const addressId = data.deliveryAddress?.apiId;

    if (!addressId) {
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
    }

    // REAL API Payload construction
    const dto: CreateOrderDto = {
      deliveryAddressId: addressId,
      notes: data.orderNotes || undefined,
      currency: "ILS",
      pharmacies: cart.groups.map((group) => ({
        pharmacyId: Number(group.pharmacy.id),
        items: group.items.map((item) => ({
          inventoryId: item.inventoryId ?? Number(item.id),
          quantity:    item.quantity,
          prescriptionId: item.prescriptionId ?? undefined,
        })),
      })),
    };

    const response = await ordersApiService.createOrder(dto);

    return {
      orderId:     String(response.id),
      orderNumber: `#${response.id}`,
      groups: response.pharmacies.map((p) => ({
        pharmacy: {
          id:      String(p.pharmacyId),
          name:    p.pharmacyName,
          address: p.pharmacyLocation?.address ?? "",
        },
        items: p.items.map((i) => ({
          id:                   String(i.inventoryId),
          name:                 i.medicineName,
          unitPrice:            i.unitPrice,
          quantity:             i.quantity,
          requiresPrescription: false,
          inStock:              true,
        })),
        subtotal: p.subtotal,
      })),
      totalItems:  response.itemsCount,
      subtotal:    response.subtotal,
      deliveryFee: response.deliveryFee,
      discount:    response.discount,
      total:       response.total,
      status:      "pending",
      placedAt:    new Date(response.createdAt),
    };
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// Address Service — REAL API
// ─────────────────────────────────────────────────────────────────────────────
export const addressService = {
  async getAddresses(): Promise<DeliveryAddress[]> {
    const apiAddresses = await patientAddressService.getAddresses();
    return apiAddresses.map(adaptApiAddress);
  },

  async addAddress(address: DeliveryAddress): Promise<DeliveryAddress> {
    if (!address.apiCityId) {
      throw new Error("cityId is required to save an address.");
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

  async updateAddress(
    addressId: string,
    address: Partial<DeliveryAddress>,
  ): Promise<DeliveryAddress> {
    const dto = {
      cityId:       address.apiCityId,
      addressLine1: address.street,
      addressLine2: address.area ?? null,
      label:        address.label ?? null,
      latitude:     address.coordinates?.lat ?? null,
      longitude:    address.coordinates?.lng ?? null,
    };

    const updated = await patientAddressService.updateAddress(Number(addressId), dto);
    return adaptApiAddress(updated);
  },

  async deleteAddress(addressId: string): Promise<void> {
    await patientAddressService.deleteAddress(Number(addressId));
  },

  async setDefaultAddress(addressId: string): Promise<void> {
    await patientAddressService.setDefaultAddress(Number(addressId));
  },
};

/** Adapter: API → UI */
function adaptApiAddress(dto: PatientAddressResponse): DeliveryAddress {
  return {
    id:          String(dto.id),
    apiId:       dto.id,
    apiCityId:   dto.cityId,
    street:      dto.addressLine1,
    city:        dto.cityName ?? String(dto.cityId),
    area:        dto.addressLine2 ?? undefined,
    label:       dto.label ?? undefined,
    isDefault:   dto.isDefault,
    coordinates: dto.latitude != null && dto.longitude != null
      ? { lat: dto.latitude, lng: dto.longitude }
      : undefined,
  };
}