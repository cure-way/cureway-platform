"use client";

/**
 * WelcomeDialog
 *
 * Explains what this deployment is on a visitor's first arrival, and can be
 * reopened from the showcase strip's "About this demo" button.
 *
 * Accessibility: rendered as a labelled modal dialog, focus moves in on open
 * and is restored on close, Tab is trapped inside, Escape and the close button
 * both dismiss it, and the entrance animation is skipped under
 * `prefers-reduced-motion`.
 *
 * Layout: a full-width sheet anchored to the bottom on mobile, a centred
 * dialog from `sm` up. The body scrolls internally so the header, actions and
 * credit line stay reachable on short viewports.
 */

import { useCallback, useEffect, useRef, useSyncExternalStore } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { HiX } from "react-icons/hi";
import {
  IoArrowForward,
  IoFlaskOutline,
  IoPeopleOutline,
  IoSchoolOutline,
  IoSwapHorizontalOutline,
} from "react-icons/io5";

import { SHOWCASE_AUTHOR, SHOWCASE_MODE } from "@/lib/showcase/config";
import {
  closeWelcome,
  getWelcomeOpenServerSnapshot,
  getWelcomeOpenSnapshot,
  subscribeShowcase,
} from "@/lib/showcase/store";

const TITLE_ID = "showcase-welcome-title";
const DESC_ID = "showcase-welcome-description";

/** Elements that can hold focus inside the dialog, for the focus trap. */
const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])';

interface Point {
  icon: React.ReactNode;
  title: string;
  body: React.ReactNode;
}

const POINTS: Point[] = [
  {
    icon: <IoPeopleOutline aria-hidden="true" className="w-5 h-5" />,
    title: "What CureWay is",
    body: (
      <>
        A multi-vendor pharmacy delivery platform that connects patients with
        pharmacies, across three portals: patient, pharmacy and admin.
      </>
    ),
  },
  {
    icon: <IoSchoolOutline aria-hidden="true" className="w-5 h-5" />,
    title: "Where it came from",
    body: (
      <>
        Built by a team as a production project in the Code2Career program at
        Gaza Sky Geeks (January–March 2026), where {SHOWCASE_AUTHOR.name} worked
        as a frontend developer.
      </>
    ),
  },
  {
    icon: <IoFlaskOutline aria-hidden="true" className="w-5 h-5" />,
    title: "What this version is",
    body: (
      <>
        The live backend was retired after the program, which left the site
        unusable. {SHOWCASE_AUTHOR.name} rebuilt it to run standalone: every
        screen is served from realistic sample data in your browser, with no
        backend and no network calls. Orders, the cart and dashboard actions all
        work locally and reset whenever the page is reloaded.
      </>
    ),
  },
  {
    icon: <IoSwapHorizontalOutline aria-hidden="true" className="w-5 h-5" />,
    title: "How to explore",
    body: (
      <>
        Use the role switcher at the top of the page to move between the
        patient, pharmacy and admin experiences.
      </>
    ),
  },
];

export function WelcomeDialog() {
  const open = useSyncExternalStore(
    subscribeShowcase,
    getWelcomeOpenSnapshot,
    getWelcomeOpenServerSnapshot,
  );

  const panelRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const restoreFocusRef = useRef<HTMLElement | null>(null);
  const prefersReducedMotion = useReducedMotion();

  const handleClose = useCallback(() => closeWelcome(), []);

  // Remember what had focus, move focus in, and lock background scrolling.
  useEffect(() => {
    if (!open) return;

    restoreFocusRef.current = document.activeElement as HTMLElement | null;
    closeRef.current?.focus();

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
      restoreFocusRef.current?.focus?.();
    };
  }, [open]);

  // Escape closes; Tab cycles within the dialog.
  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        handleClose();
        return;
      }
      if (event.key !== "Tab") return;

      const nodes = panelRef.current?.querySelectorAll<HTMLElement>(FOCUSABLE);
      if (!nodes || nodes.length === 0) return;

      const first = nodes[0];
      const last = nodes[nodes.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, handleClose]);

  if (!SHOWCASE_MODE) return null;

  const motionProps = prefersReducedMotion
    ? {}
    : {
        initial: { opacity: 0, y: 24, scale: 0.98 },
        animate: { opacity: 1, y: 0, scale: 1 },
        exit: { opacity: 0, y: 24, scale: 0.98 },
        transition: { duration: 0.22, ease: "easeOut" as const },
      };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="showcase-welcome"
          className="fixed inset-0 z-[80] flex items-end sm:items-center justify-center bg-black/50 p-0 sm:p-4"
          initial={prefersReducedMotion ? undefined : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={prefersReducedMotion ? undefined : { opacity: 0 }}
          transition={
            prefersReducedMotion ? { duration: 0 } : { duration: 0.18 }
          }
          onClick={handleClose}
        >
          <motion.div
            {...motionProps}
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={TITLE_ID}
            aria-describedby={DESC_ID}
            onClick={(event) => event.stopPropagation()}
            // NOTE: this project remaps Tailwind's container scale to breakpoint
            // widths (--container-2xl is 1440px), so max-w-2xl would be
            // full-width here. An explicit value keeps the intent clear.
            className="bg-white w-full sm:max-w-[40rem] max-h-[92dvh] sm:max-h-[85dvh] rounded-t-2xl sm:rounded-2xl shadow-xl flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-start gap-3 px-5 sm:px-7 pt-5 sm:pt-6 pb-4 border-b border-border">
              <div className="min-w-0 flex-1">
                <p className="text-t-12 font-semibold text-primary uppercase tracking-wide">
                  Showcase version
                </p>
                <h2
                  id={TITLE_ID}
                  className="mt-1 text-t-21-bold sm:text-t-25-bold text-primary-darker"
                >
                  Welcome to CureWay
                </h2>
              </div>

              <button
                ref={closeRef}
                type="button"
                onClick={handleClose}
                aria-label="Close"
                className="shrink-0 p-2 -mr-1 rounded-lg text-neutral hover:bg-neutral-light hover:text-neutral-darker transition-colors cursor-pointer"
              >
                <HiX aria-hidden="true" className="w-5 h-5" />
              </button>
            </div>

            {/* Body — scrolls on short viewports */}
            <div
              id={DESC_ID}
              className="flex-1 overflow-y-auto px-5 sm:px-7 py-5 flex flex-col gap-5"
            >
              {POINTS.map((point) => (
                <div key={point.title} className="flex gap-3.5">
                  <span
                    className="shrink-0 mt-0.5 w-9 h-9 rounded-xl bg-primary-light text-primary flex items-center justify-center"
                    aria-hidden="true"
                  >
                    {point.icon}
                  </span>
                  <div className="min-w-0">
                    <h3 className="text-t-14-semibold sm:text-t-17-semibold text-neutral-darker">
                      {point.title}
                    </h3>
                    <p className="mt-1 text-t-14 leading-relaxed text-neutral-dark">
                      {point.body}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="border-t border-border px-5 sm:px-7 py-4 flex flex-col-reverse sm:flex-row sm:items-center gap-3 sm:justify-between">
              <p className="text-t-12 text-neutral text-center sm:text-left">
                Showcase version rebuilt by{" "}
                <a
                  href={SHOWCASE_AUTHOR.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-primary underline underline-offset-2 hover:text-primary-hover"
                >
                  {SHOWCASE_AUTHOR.name}
                </a>
              </p>

              <button
                type="button"
                onClick={handleClose}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 min-h-11 rounded-xl bg-primary hover:bg-primary-hover text-white text-t-14-semibold transition-colors cursor-pointer"
              >
                Start exploring
                <IoArrowForward aria-hidden="true" className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
