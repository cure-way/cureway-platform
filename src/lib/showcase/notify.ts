/**
 * Showcase toasts.
 *
 * Uses `react-hot-toast`, which is the library actually mounted by
 * `ToastProvider`. (`sonner` is imported in a couple of components but its
 * `<Toaster />` is never rendered, so those toasts are silent.)
 */

import toast from "react-hot-toast";

import {
  SHOWCASE_DISABLED_MESSAGE,
  SHOWCASE_UNBUILT_MESSAGE,
} from "./config";

/** An action that needs a backend, so it cannot work here. */
export function notifyDisabled(detail?: string): void {
  toast(detail ? `${SHOWCASE_DISABLED_MESSAGE} — ${detail}` : SHOWCASE_DISABLED_MESSAGE, {
    icon: "🔒",
    id: "showcase-disabled",
  });
}

/** A link to a section that does not exist in this codebase. */
export function notifyUnbuilt(section?: string): void {
  toast(section ? `${section}: ${SHOWCASE_UNBUILT_MESSAGE}` : SHOWCASE_UNBUILT_MESSAGE, {
    icon: "🚧",
    id: "showcase-unbuilt",
  });
}

/** A change kept in memory only, so the visitor is not misled. */
export function notifyLocalOnly(detail: string): void {
  toast.success(`${detail} — not saved in showcase mode`, {
    id: "showcase-local",
  });
}
