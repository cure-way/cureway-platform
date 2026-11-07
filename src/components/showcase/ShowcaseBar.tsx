"use client";

/**
 * ShowcaseBar
 *
 * Always-visible strip above every portal. It states that this deployment runs
 * on sample data and carries the controls a visitor needs: the role switcher,
 * Reset demo, and a button that reopens the welcome dialog.
 *
 * It is deliberately not dismissible — the switcher is the only way to reach
 * the pharmacy and admin portals, so hiding the strip would strand a visitor.
 *
 * Visual language is borrowed from `AnnouncementsBar` (`bg-primary` +
 * `text-primary-light` + `text-t-14`), which hides itself in showcase mode so
 * the two blue strips never stack.
 *
 * Layout: the strip is sticky, and its rendered height is published as the
 * `--showcase-bar-h` custom property. It wraps onto a second row on narrow
 * screens, so that height is not a constant — layouts that pin themselves to
 * the viewport subtract the live value rather than a hardcoded number.
 */

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { IoInformationCircleOutline, IoRefreshOutline } from "react-icons/io5";

import { useAuth } from "@/features/auth";
import { getRoleHome } from "@/lib/routes";
import {
  DEMO_ROLES,
  DEMO_ROLE_LABELS,
  SHOWCASE_BAR_HEIGHT_VAR,
  SHOWCASE_MODE,
  SHOWCASE_NOTICE,
  type DemoRole,
} from "@/lib/showcase/config";
import {
  getRoleServerSnapshot,
  getRoleSnapshot,
  openWelcome,
  selectDemoRole,
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

  const role = useSyncExternalStore(
    subscribeShowcase,
    getRoleSnapshot,
    getRoleServerSnapshot,
  );

  const [switching, setSwitching] = useState(false);
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    exposeShowcaseDiagnostics();
  }, []);

  // Publish the strip's live height so pinned layouts can subtract it. A
  // ResizeObserver keeps it correct when the strip wraps to a second row.
  useEffect(() => {
    const node = barRef.current;
    if (!node) return;

    const root = document.documentElement;
    const publish = () => {
      root.style.setProperty(
        SHOWCASE_BAR_HEIGHT_VAR,
        `${Math.ceil(node.getBoundingClientRect().height)}px`,
      );
    };

    publish();
    const observer = new ResizeObserver(publish);
    observer.observe(node);

    return () => {
      observer.disconnect();
      root.style.removeProperty(SHOWCASE_BAR_HEIGHT_VAR);
    };
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

  if (!SHOWCASE_MODE) return null;

  return (
    <div
      ref={barRef}
      className="bg-primary w-full sticky top-0 z-[60]"
      role="region"
      aria-label="Showcase mode"
      data-showcase-bar="visible"
    >
      {/*
        Wraps to two rows below `lg`: the notice takes the full first row and
        the controls sit on the second, so nothing is ever truncated.
      */}
      <div className="flex flex-col lg:flex-row lg:items-center gap-2 lg:gap-4 px-3 sm:px-4 md:px-6 lg:px-8 py-2">
        <p className="text-t-12 sm:text-t-14 text-primary-light min-w-0 lg:flex-1">
          <span className="font-bold text-white">{SHOWCASE_NOTICE.lead}</span>{" "}
          <span className="font-medium">{SHOWCASE_NOTICE.body}</span>
        </p>

        <div className="flex items-center flex-wrap gap-x-2 gap-y-1.5 shrink-0">
          <div
            className="flex items-center gap-1 bg-white/15 rounded-lg p-0.5"
            role="group"
            aria-label="Explore CureWay as a different role"
          >
            {DEMO_ROLES.map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => handleSwitch(r)}
                aria-pressed={r === role}
                disabled={switching}
                className={`px-3 py-2 min-h-11 rounded-md text-t-12 sm:text-t-14 font-semibold transition-colors cursor-pointer disabled:cursor-wait ${
                  r === role
                    ? "bg-white text-primary"
                    : "text-primary-light hover:bg-white/15"
                }`}
              >
                {DEMO_ROLE_LABELS[r]}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={openWelcome}
            className="inline-flex items-center gap-1.5 px-3 py-2 min-h-11 rounded-md text-t-12 sm:text-t-14 font-semibold text-primary-light hover:bg-white/15 transition-colors cursor-pointer"
          >
            <IoInformationCircleOutline
              aria-hidden="true"
              className="w-4 h-4"
            />
            About this demo
          </button>

          <button
            type="button"
            onClick={handleReset}
            title="Restore the original sample data"
            className="inline-flex items-center gap-1.5 px-3 py-2 min-h-11 rounded-md text-t-12 sm:text-t-14 font-semibold text-primary-light hover:bg-white/15 transition-colors cursor-pointer"
          >
            <IoRefreshOutline aria-hidden="true" className="w-4 h-4" />
            Reset demo
          </button>
        </div>
      </div>
    </div>
  );
}
