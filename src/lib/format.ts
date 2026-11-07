/**
 * Shared value formatting.
 *
 * Before this existed the app rendered money four different ways — `$2.50`,
 * `2.50$`, `2.50 $` and `10.50USD` — sometimes two of them on the same page.
 * Every price must go through `formatCurrency`.
 */

const CURRENCY_SYMBOLS: Record<string, string> = {
  USD: "$",
  EUR: "€",
  ILS: "₪",
};

/** Canonical money format: symbol first, always two decimals. e.g. `$2.50`. */
export function formatCurrency(
  amount: number | string | null | undefined,
  currency = "USD",
): string {
  const value = typeof amount === "string" ? Number(amount) : amount;
  const safe = Number.isFinite(value) ? (value as number) : 0;

  const symbol = CURRENCY_SYMBOLS[currency.toUpperCase()] ?? "$";
  const sign = safe < 0 ? "-" : "";

  return `${sign}${symbol}${Math.abs(safe).toFixed(2)}`;
}

/** A price span, e.g. `$2.50 – $3.75`, collapsing to one value when equal. */
export function formatPriceRange(
  min: number | string | null | undefined,
  max: number | string | null | undefined,
  currency = "USD",
): string {
  const lo = formatCurrency(min, currency);
  const hi = formatCurrency(max, currency);
  return lo === hi ? lo : `${lo} – ${hi}`;
}

/** Canonical date format across the app, e.g. `7 Nov 2026`. */
export function formatDate(
  value: string | number | Date | null | undefined,
): string {
  if (!value) return "";
  const d = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(d.getTime())) return "";

  return d.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}
