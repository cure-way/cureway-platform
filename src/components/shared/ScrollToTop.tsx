"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * ScrollToTop
 * Forces the browser to scroll to the top on initial load and on every
 * client-side navigation.  Also disables the browser's built-in scroll
 * restoration so a refresh never lands mid-page.
 */
export function ScrollToTop() {
  const pathname = usePathname();

  useEffect(() => {
    window.history.scrollRestoration = "manual";
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}
