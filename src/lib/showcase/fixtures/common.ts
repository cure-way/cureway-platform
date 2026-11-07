/**
 * Shared fixture primitives — cities, image assets, date and money helpers.
 *
 * Conventions used across every fixture file:
 *  - **All IDs are >= 10.** `src/services/orders.service.ts` rejects
 *    `pharmacyId < 10` / `inventoryId < 10` as "stale mock values", so low IDs
 *    would make checkout refuse its own sample data.
 *  - Images only ever point at assets committed under `public/`.
 *  - Currency is USD to match `DEFAULTS.CURRENCY` in `@/constants/cart.constants`.
 */

export const CURRENCY = "USD";

/** Palestinian cities served by the platform. */
export const CITIES = [
  { id: 11, name: "Gaza" },
  { id: 12, name: "Khan Younis" },
  { id: 13, name: "Rafah" },
  { id: 14, name: "Deir al-Balah" },
  { id: 15, name: "Jabalia" },
  { id: 16, name: "Beit Lahia" },
] as const;

export const CITY_DELIVERY_FEES: Record<
  number,
  { standardFeeAmount: number; expressFeeAmount: number; currency: string }
> = {
  11: { standardFeeAmount: 3, expressFeeAmount: 6, currency: CURRENCY },
  12: { standardFeeAmount: 3.5, expressFeeAmount: 6.5, currency: CURRENCY },
  13: { standardFeeAmount: 4, expressFeeAmount: 7, currency: CURRENCY },
  14: { standardFeeAmount: 3.5, expressFeeAmount: 6.5, currency: CURRENCY },
  15: { standardFeeAmount: 3, expressFeeAmount: 6, currency: CURRENCY },
  16: { standardFeeAmount: 4, expressFeeAmount: 7, currency: CURRENCY },
};

/** Images that exist in `public/` — never a remote host. */
export const IMG = {
  painRelief: "/patient/Pain Relief-X.png",
  vitamins: "/patient/Vitamins and Supplements.png",
  coldFlu: "/patient/Cold and Flu medicine.png",
  dailyEssentials: "/patient/Daily Essentials.png",
  medicalEquipment: "/patient/Medical Equipment.png",
  firstAid: "/patient/Discount on First Aid.png",
  pills: "/patient/pills.png",
  panadol: "/icons/medicine/panadol.png",
  voltaren: "/patient/Voltaren.png",
  zecuf: "/patient/Zecuf.png",
  vitaminC: "/patient/Vitamin C.png",
  collagen: "/patient/Biogen Collagen.png",
  chAlpha: "/patient/CH Alpha Active.png",
  placeholder: "/placeholder-medicine.png",
  shelves: "/patient/Pharnacy-shelves.png",
  pharmacyCity: "/patient/City Pharmacy.png",
  pharmacyAmal: "/patient/Amal Pharmacy.png",
  pharmacyLie: "/patient/LIE Pharmacy.png",
  avatar: "/avatar.png",
  avatarBoy: "/avatar-boy-with-glaces.png",
  avatarGirl: "/avatar-girl-with-glaces.png",
  prescription: "/patient/Upload-Prescription.png",
} as const;

// ---------------------------------------------------------------------------
// Date helpers
//
// Fixtures are seeded in the browser after mount, so relative dates are safe
// (no SSR/client hydration mismatch) and keep the demo looking current
// however long after the deploy somebody opens it.
// ---------------------------------------------------------------------------

/** ISO timestamp `days` in the past (optionally offset by hours). */
export function daysAgo(days: number, hours = 0): string {
  const d = new Date();
  d.setDate(d.getDate() - days);
  d.setHours(d.getHours() - hours);
  return d.toISOString();
}

/** ISO timestamp earlier today, so "today's orders" panels have content. */
export function hoursAgo(hours: number): string {
  const d = new Date();
  d.setHours(d.getHours() - hours);
  return d.toISOString();
}

/** ISO date (YYYY-MM-DD) `months` into the future — for expiry dates. */
export function monthsAhead(months: number): string {
  const d = new Date();
  d.setMonth(d.getMonth() + months);
  return d.toISOString().slice(0, 10);
}

/** Round to 2dp so money never renders as 12.340000000000001. */
export function money(value: number): number {
  return Math.round(value * 100) / 100;
}

/** Structured deep clone, so a reset always restores pristine fixtures. */
export function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}
