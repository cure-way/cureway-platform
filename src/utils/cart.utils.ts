// ===================================================================
// CART UTILS — Pure utility functions for Cart & Checkout
// ===================================================================

import type { CartItem, CartGroup, Coupon, DeliveryAddress } from "@/types/cart";
import { DEFAULTS } from "@/constants/cart.constants";

// ─────────────────────────────────────────────────────────────────
// Calculations
// ─────────────────────────────────────────────────────────────────

/** Unit price × quantity for one item */
export const getItemTotal = (item: CartItem): number =>
  item.price * item.quantity;

/** Sum of all item totals */
export const calculateSubtotal = (items: CartItem[]): number =>
  items.reduce((sum, item) => sum + getItemTotal(item), 0);

/** Total quantity across all items */
export const calculateTotalItems = (items: CartItem[]): number =>
  items.reduce((sum, item) => sum + item.quantity, 0);

/** Group a flat item list by pharmacy */
export const groupByPharmacy = (items: CartItem[]): CartGroup[] => {
  const map = new Map<
    string,
    { pharmacy: CartItem["pharmacy"]; items: CartItem[]; subtotal: number }
  >();
  items.forEach((item) => {
    const id = item.pharmacy.id;
    if (!map.has(id)) {
      map.set(id, { pharmacy: item.pharmacy, items: [], subtotal: 0 });
    }
    const group = map.get(id)!;
    group.items.push(item);
    group.subtotal += getItemTotal(item);
  });
  return Array.from(map.values());
};

// ─────────────────────────────────────────────────────────────────
// Prescription Filters
// ─────────────────────────────────────────────────────────────────

/** Items that need a prescription but haven't uploaded one yet */
export const getPendingPrescriptionItems = (items: CartItem[]): CartItem[] =>
  items.filter((i) => i.requiresPrescription && !i.prescriptionUploaded);

/** OTC (over-the-counter) items */
export const getOTCItems = (items: CartItem[]): CartItem[] =>
  items.filter((i) => !i.requiresPrescription);

// ─────────────────────────────────────────────────────────────────
// Discounts & Totals
// ─────────────────────────────────────────────────────────────────

/** Calculate coupon discount amount against a given subtotal */
export const calculateDiscount = (
  subtotal: number,
  coupon?: Coupon,
): number => {
  if (!coupon) return 0;
  if (coupon.minOrderValue && subtotal < coupon.minOrderValue) return 0;
  let discount =
    coupon.discountType === "percentage"
      ? (subtotal * coupon.discountValue) / 100
      : coupon.discountValue;
  if (coupon.maxDiscount) discount = Math.min(discount, coupon.maxDiscount);
  return Math.min(discount, subtotal);
};

/** Final total: subtotal + delivery fee - discount */
export const calculateCartTotal = (
  subtotal: number,
  deliveryFee: number,
  discount: number,
): number => Math.max(0, subtotal + deliveryFee - discount);
// ─────────────────────────────────────────────────────────────────
// Formatting
// ─────────────────────────────────────────────────────────────────

/** Format a monetary amount as a currency string  (e.g. "$12.00") */
export const formatCurrency = (
  amount: number,
  currency = DEFAULTS.CURRENCY,
): string =>
  new Intl.NumberFormat("en-US", { style: "currency", currency }).format(
    amount,
  );

/** Format a delivery address to a human-readable single line */
export const formatAddress = (address: DeliveryAddress): string => {
  if (!address) return "";
  const parts = [
    address.street,
    address.area,
    address.city,
    address.building  && `Building ${address.building}`,
    address.floor     && `Floor ${address.floor}`,
    address.apartment && `Apt ${address.apartment}`,
  ].filter(Boolean);
  return parts.join(", ");
};

/** Format a phone number for display (e.g. "0599 123 456") */
export const formatPhoneNumber = (phone: string): string => {
  if (!phone) return "";
  const cleaned = phone.replace(/\D/g, "");
  if (cleaned.length === 10) {
    return `${cleaned.slice(0, 4)} ${cleaned.slice(4, 7)} ${cleaned.slice(7)}`;
  }
  return phone;
};

/** Format a distance in metres to a readable string */
export const formatDistance = (meters: number): string =>
  meters < 1000
    ? `${Math.round(meters)}m`
    : `${(meters / 1000).toFixed(2)}km`;

/** Format a number with locale-aware thousands separators */
export const formatNumber = (num: number): string =>
  new Intl.NumberFormat("en-US").format(num);

/** Format a date according to the requested style */
export const formatDate = (
  date: string | Date,
  style: "short" | "long" = "short",
): string => {
  const d = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat("en-US", {
    year:    "numeric",
    month:   style === "long" ? "long" : "short",
    day:     "numeric",
    hour:    style === "long" ? "2-digit" : undefined,
    minute:  style === "long" ? "2-digit" : undefined,
  }).format(d);
};

/** Capitalise the first letter of a string */
export const capitalize = (text: string): string =>
  text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
