"use client";

import { MotionConfig } from "framer-motion";
import type { ReactNode } from "react";

/**
 * Applies the visitor's reduced-motion preference to every framer-motion
 * animation in the app.
 *
 * `reducedMotion="user"` makes framer-motion honour
 * `prefers-reduced-motion` globally, so transform and layout animations are
 * disabled at the source. Only 13 of the 46 animated components called
 * `useReducedMotion` themselves; this covers the rest without touching them,
 * and the existing per-component checks keep working.
 */
export function MotionProvider({ children }: { children: ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
