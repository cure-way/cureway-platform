/**
 * Showcase UI state as an external store.
 *
 * The selected role and the notice's dismissed flag live in `localStorage`,
 * which is not readable during SSR. Reading them in a mount effect and calling
 * `setState` causes a cascading render (and trips
 * `react-hooks/set-state-in-effect`), so they are exposed through
 * `useSyncExternalStore` instead: the server snapshot is the default, the
 * client snapshot is the stored value, and React reconciles the two.
 *
 * Snapshots are cached at module scope because `useSyncExternalStore` requires
 * `getSnapshot` to return a stable value for unchanged state.
 */

import {
  getDemoRole,
  hasSeenWelcome,
  setDemoRole,
  setWelcomeSeen,
  type DemoRole,
} from "./config";

type Listener = () => void;

const listeners = new Set<Listener>();

function emit(): void {
  for (const listener of listeners) listener();
}

export function subscribeShowcase(listener: Listener): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

// ---------------------------------------------------------------------------
// Selected demo role
// ---------------------------------------------------------------------------

let roleCache: DemoRole | null = null;

export function getRoleSnapshot(): DemoRole {
  if (roleCache === null) roleCache = getDemoRole();
  return roleCache;
}

/** First visit defaults to the patient portal, so there is no login wall. */
export function getRoleServerSnapshot(): DemoRole {
  return "PATIENT";
}

export function selectDemoRole(role: DemoRole): void {
  setDemoRole(role);
  roleCache = role;
  emit();
}

// ---------------------------------------------------------------------------
// Welcome dialog
// ---------------------------------------------------------------------------

let welcomeOpen: boolean | null = null;

/**
 * Whether the welcome dialog is open. On a first visit it opens by itself;
 * afterwards it only opens from the strip's "About this demo" button.
 */
export function getWelcomeOpenSnapshot(): boolean {
  if (welcomeOpen === null) welcomeOpen = !hasSeenWelcome();
  return welcomeOpen;
}

/** Closed during SSR: the dialog is a client-only, per-visitor decision. */
export function getWelcomeOpenServerSnapshot(): boolean {
  return false;
}

export function openWelcome(): void {
  welcomeOpen = true;
  emit();
}

export function closeWelcome(): void {
  welcomeOpen = false;
  setWelcomeSeen(true);
  emit();
}
