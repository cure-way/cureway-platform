/**
 * Showcase mode — public surface.
 *
 * See `docs/showcase-mode-plan.md` for the design and the endpoint inventory.
 */

export {
  DEMO_ROLES,
  DEMO_ROLE_LABELS,
  SHOWCASE_BASE_URL,
  SHOWCASE_DISABLED_MESSAGE,
  SHOWCASE_MODE,
  SHOWCASE_NOTICE,
  getDemoRole,
  hasSeenWelcome,
  setDemoRole,
  setWelcomeSeen,
  type DemoRole,
} from "./config";

export { showcaseAdapter, exposeShowcaseDiagnostics } from "./adapter";
export { resetDb } from "./db";
export { routeCount, unmatched } from "./router";
