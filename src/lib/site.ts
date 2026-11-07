/**
 * Site URL / Public Origin
 *
 * Single source of truth for the public origin of this app. Every absolute
 * URL the app emits (metadataBase, canonical links, Open Graph / Twitter
 * URLs and images, sitemap, robots, JSON-LD, share links) must be derived
 * from here — never hardcoded at the call site.
 *
 * Override per environment with `NEXT_PUBLIC_SITE_URL` (e.g. preview
 * deployments or local development); production falls back to the canonical
 * custom subdomain.
 */

/** Canonical production origin. Used when `NEXT_PUBLIC_SITE_URL` is unset. */
export const DEFAULT_SITE_URL = "https://cureway.aymanismail.com";

/** Strip any trailing slash so joins never produce a double slash. */
function normalizeOrigin(value: string): string {
  return value.trim().replace(/\/+$/, "");
}

/**
 * The public origin of this deployment, without a trailing slash.
 * e.g. `https://cureway.aymanismail.com`
 */
export const SITE_URL: string = normalizeOrigin(
  process.env.NEXT_PUBLIC_SITE_URL || DEFAULT_SITE_URL,
);

/** The bare hostname of the public origin, e.g. `cureway.aymanismail.com`. */
export const SITE_DOMAIN: string = SITE_URL.replace(/^https?:\/\//, "");

/** `SITE_URL` as a `URL`, for Next.js `metadataBase`. */
export const SITE_ORIGIN_URL = new URL(SITE_URL);

/** Brand / SEO defaults that travel with the origin. */
export const SITE_NAME = "CureWay";
export const SITE_DESCRIPTION =
  "Multi-vendor medicine and pharmacy delivery platform";

/** Default Open Graph / Twitter share image, resolved against `SITE_URL`. */
export const SITE_OG_IMAGE_PATH = "/logo.png";

/**
 * Build an absolute URL on the public origin from a root-relative path.
 *
 *   absoluteUrl("/auth/sign-in") → "https://cureway.aymanismail.com/auth/sign-in"
 */
export function absoluteUrl(path = "/"): string {
  if (/^https?:\/\//i.test(path)) return path;
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}
