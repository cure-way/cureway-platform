"use client";

/**
 * ShowcaseBar
 *
 * Slim strip above every portal explaining that this deployment runs on
 * sample data, with the role switcher that lets a visitor explore the
 * Patient, Pharmacy and Admin sides.
 *
 * Visual language is deliberately borrowed from `AnnouncementsBar`
 * (`bg-primary` + `text-primary-light` + `text-t-14 font-semibold`) so it
 * reads as part of the existing design system rather than a dev banner.
 * `AnnouncementsBar` hides itself in showcase mode so the two never stack.
 *
 * Dismissing the notice collapses the strip to a compact row: the role
 * switcher stays reachable, because losing it would strand a visitor in
 * whichever portal they happened to be in.
 */

import { useCallback, useEffect, useState, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { HiX } from "react-icons/hi";
import { IoInformationCircleOutline, IoRefreshOutline } from "react-icons/io5";

import { useAuth } from "@/features/auth";
import { getRoleHome } from "@/lib/routes";
import {
  DEMO_ROLES,
  DEMO_ROLE_LABELS,
  SHOWCASE_MODE,
  SHOWCASE_NOTICE,
  type DemoRole,
} from "@/lib/showcase/config";
import {
  getNoticeDismissedServerSnapshot,
  getNoticeDismissedSnapshot,
  getRoleServerSnapshot,
  getRoleSnapshot,
  selectDemoRole,
  setNoticeDismissedState,
  subscribeShowcase,
} from "@/lib/showcase/store";
import { exposeShowcaseDiagnostics } from "@/lib/showcase/adapter";
import { resetDb } from "@/lib/showcase/db";
import { STORAGE_KEYS } from "@/constants/cart.constants";

/** Per-viewer state that a reset should clear along with the fixtures. */
const RESETTABLE_KEYS = [
  STORAGE_KEYS.CART,
  STORAGE_KEYS.CHECKOUT_DRAFT,
  STORAGE_KEYS.DELIVERY_ADDRESSES,
  STORAGE_KEYS.SELECTED_ADDRESS,
  STORAGE_KEYS.LAST_SYNC,
];

export function ShowcaseBar() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { refreshIfNeeded } = useAuth();
  const prefersReducedMotion = useReducedMotion();

  // Read from the external store rather than an effect, so the server and
  // client markup agree without a cascading render after mount.
  const role = useSyncExternalStore(
    subscribeShowcase,
    getRoleSnapshot,
    getRoleServerSnapshot,
  );
  const dismissed = useSyncExternalStore(
    subscribeShowcase,
    getNoticeDismissedSnapshot,
    getNoticeDismissedServerSnapshot,
  );
  const expanded = !dismissed;

  const [switching, setSwitching] = useState(false);

  useEffect(() => {
    exposeShowcaseDiagnostics();
  }, []);

  const handleSwitch = useCallback(
    async (next: DemoRole) => {
      if (next === role || switching) return;
      setSwitching(true);
      selectDemoRole(next);

      // Drop cached queries so the new role never sees the previous role's
      // data, then re-hydrate the session before navigating.
      queryClient.clear();
      await refreshIfNeeded();
      router.replace(getRoleHome(next));
      setSwitching(false);
    },
    [role, switching, queryClient, refreshIfNeeded, router],
  );

  const handleReset = useCallback(() => {
    resetDb();
    queryClient.clear();

    for (const key of RESETTABLE_KEYS) {
      try {
        window.localStorage.removeItem(key);
      } catch {
        // Ignore — storage may be unavailable; fixtures still reset.
      }
    }

    // Fixtures live in memory, so a reload is the honest way to guarantee
    // every store and cache is back to its seeded state.
    window.location.reload();
  }, [queryClient]);

  const handleDismiss = useCallback(() => {
    setNoticeDismissedState(true);
  }, []);

  const handleReopen = useCallback(() => {
    setNoticeDismissedState(false);
  }, []);

  if (!SHOWCASE_MODE) return null;

  const switcher = (
    <div
      className="flex items-center gap-1 bg-white/15 rounded-lg p-0.5 shrink-0"
      role="group"
      aria-label="Explore CureWay as a different role"
    >
      {DEMO_ROLES.map((r) => {
        const active = r === role;
        return (
          <button
            key={r}
            type="button"
            onClick={() => handleSwitch(r)}
            aria-pressed={active}
            disabled={switching}
            className={`px-2.5 py-1 rounded-md text-t-14 font-semibold transition-colors cursor-pointer disabled:cursor-wait ${
              active
                ? "bg-white text-primary"
                : "text-primary-light hover:bg-white/15"
            }`}
          >
            {DEMO_ROLE_LABELS[r]}
          </button>
        );
      })}
    </div>
  );

  const resetButton = (
    <button
      type="button"
      onClick={handleReset}
      title="Restore the original sample data"
      className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-t-14 font-semibold text-primary-light hover:bg-white/15 transition-colors cursor-pointer shrink-0"
    >
      <IoRefreshOutline className="w-4 h-4" aria-hidden="true" />
      <span className="hidden sm:inline">Reset demo</span>
      <span className="sr-only sm:hidden">Reset demo</span>
    </button>
  );

  return (
    <div
      className="bg-primary w-full"
      role="region"
      aria-label="Showcase mode"
      data-showcase-bar={expanded ? "expanded" : "collapsed"}
    >
      <div className="flex items-center gap-2 md:gap-3 px-3 md:px-6 lg:px-8 py-2">
        <AnimatePresence initial={false} mode="wait">
          {expanded ? (
            <motion.p
              key="notice"
              initial={prefersReducedMotion ? undefined : { opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={prefersReducedMotion ? undefined : { opacity: 0 }}
              transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.18 }}
              className="text-t-14 text-primary-light min-w-0 flex-1"
            >
              <span className="font-bold text-white">{SHOWCASE_NOTICE.lead}</span>{" "}
              <span className="font-medium">{SHOWCASE_NOTICE.body}</span>
            </motion.p>
          ) : (
            <motion.button
              key="reopen"
              type="button"
              onClick={handleReopen}
              initial={prefersReducedMotion ? undefined : { opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={prefersReducedMotion ? undefined : { opacity: 0 }}
              transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.18 }}
              aria-label="Show the showcase notice again"
              className="flex items-center gap-1.5 text-t-14 font-semibold text-primary-light hover:text-white transition-colors cursor-pointer min-w-0 flex-1 text-left"
            >
              <IoInformationCircleOutline
                className="w-4 h-4 shrink-0"
                aria-hidden="true"
              />
              <span className="truncate">Showcase version — sample data</span>
            </motion.button>
          )}
        </AnimatePresence>

        {switcher}
        {resetButton}

        {expanded && (
          <button
            type="button"
            onClick={handleDismiss}
            aria-label="Dismiss the showcase notice"
            className="p-1 rounded-md text-primary-light hover:bg-white/15 hover:text-white transition-colors cursor-pointer shrink-0"
          >
            <HiX className="w-4 h-4" aria-hidden="true" />
          </button>
        )}
      </div>
    </div>
  );
}
