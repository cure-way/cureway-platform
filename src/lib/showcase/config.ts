/**
 * Showcase Mode — configuration and demo-session state
 *
 * CureWay's production backend (Railway) has been retired. Showcase mode runs
 * the whole frontend off local fixtures so it can be browsed as a portfolio
 * piece with no server at all.
 *
 * The switch is installed at the HTTP transport (see `./adapter`), so every
 * service, hook, store and component above it stays untouched.
 */

export type DemoRole = "PATIENT" | "PHARMACY" | "ADMIN";

export const DEMO_ROLES: readonly DemoRole[] = ["PATIENT", "PHARMACY", "ADMIN"];

/** Label shown in the role switcher. */
export const DEMO_ROLE_LABELS: Record<DemoRole, string> = {
  PATIENT: "Patient",
  PHARMACY: "Pharmacy",
  ADMIN: "Admin",
};

// ---------------------------------------------------------------------------
// Flag resolution
// ---------------------------------------------------------------------------

/**
 * Is showcase mode active?
 *
 * Precedence (highest first):
 *   1. `NEXT_PUBLIC_SHOWCASE_MODE=true`  → forced ON, even when an API base
 *      URL is configured.
 *   2. `NEXT_PUBLIC_SHOWCASE_MODE=false` → forced OFF.
 *   3. Otherwise: ON when no backend base URL is configured, so the portfolio
 *      deployment needs no extra setup and a real API deployment keeps
 *      normal behaviour.
 *
 * Read via `process.env.NEXT_PUBLIC_*`, which Next.js inlines at build time,
 * so this is a compile-time constant in the client bundle.
 */
function resolveShowcaseMode(): boolean {
  const flag = process.env.NEXT_PUBLIC_SHOWCASE_MODE?.trim().toLowerCase();

  if (flag === "true" || flag === "1") return true;
  if (flag === "false" || flag === "0") return false;

  const apiBase =
    process.env.NEXT_PUBLIC_API_URL?.trim() ||
    process.env.NEXT_PUBLIC_API_BASE_URL?.trim();

  return !apiBase;
}

export const SHOWCASE_MODE: boolean = resolveShowcaseMode();

/**
 * Inert base URL used while in showcase mode. The fixture adapter resolves
 * every request before transport, so nothing is ever sent here — but axios
 * still wants a parsable base for relative URLs.
 */
export const SHOWCASE_BASE_URL = "http://showcase.local";

// ---------------------------------------------------------------------------
// Storage keys
// ---------------------------------------------------------------------------

export const SHOWCASE_KEYS = {
  /** Which role the visitor is currently exploring as. */
  ROLE: "cureway_demo_role",
  /** Whether the notice text has been dismissed (strip collapses to a pill). */
  NOTICE_DISMISSED: "cureway_showcase_notice_dismissed",
} as const;

/** Placeholder refresh token so `AuthProvider` hydrates instead of bailing. */
export const SHOWCASE_REFRESH_TOKEN = "showcase-demo-refresh-token";
export const SHOWCASE_ACCESS_TOKEN = "showcase-demo-access-token";

// ---------------------------------------------------------------------------
// Safe storage helpers
//
// localStorage throws in private windows and when site data is blocked, and
// is unavailable during SSR — every access is guarded.
// ---------------------------------------------------------------------------

function readStorage(key: string): string | null {
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

function writeStorage(key: string, value: string): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key, value);
  } catch {
    // Ignore — showcase mode degrades to per-page-load state.
  }
}

function isDemoRole(value: unknown): value is DemoRole {
  return (
    typeof value === "string" && (DEMO_ROLES as readonly string[]).includes(value)
  );
}

// ---------------------------------------------------------------------------
// Demo role
// ---------------------------------------------------------------------------

/**
 * The role being explored. Defaults to PATIENT so a first-time visitor lands
 * straight on the patient home with content — no login wall.
 */
export function getDemoRole(): DemoRole {
  const stored = readStorage(SHOWCASE_KEYS.ROLE);
  return isDemoRole(stored) ? stored : "PATIENT";
}

export function setDemoRole(role: DemoRole): void {
  writeStorage(SHOWCASE_KEYS.ROLE, role);
}

// ---------------------------------------------------------------------------
// Notice dismissal
// ---------------------------------------------------------------------------

export function isNoticeDismissed(): boolean {
  return readStorage(SHOWCASE_KEYS.NOTICE_DISMISSED) === "true";
}

export function setNoticeDismissed(dismissed: boolean): void {
  writeStorage(SHOWCASE_KEYS.NOTICE_DISMISSED, dismissed ? "true" : "false");
}

/** Copy shown in the showcase notice. */
export const SHOWCASE_NOTICE = {
  lead: "Showcase version.",
  body:
    "CureWay was built as a production project for Code2Career at Gaza Sky Geeks. " +
    "The live backend has been retired, so this version runs on sample data.",
} as const;

/** Message used by every action that cannot work without a backend. */
export const SHOWCASE_DISABLED_MESSAGE = "Disabled in showcase mode";

/**
 * Message for links to sections that were never built in the original
 * project. Kept distinct from the message above: calling these "disabled in
 * showcase mode" would imply they would work against a live backend.
 */
export const SHOWCASE_UNBUILT_MESSAGE =
  "This section was not built in the original project";
