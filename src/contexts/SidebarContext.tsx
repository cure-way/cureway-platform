"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  useMemo,
  type ReactNode,
} from "react";
import { usePathname } from "next/navigation";

const STORAGE_KEY = "cw.sidebar.collapsed";

interface SidebarContextValue {
  /** Whether the mobile/tablet sidebar drawer is open */
  isOpen: boolean;
  toggle: () => void;
  open: () => void;
  close: () => void;

  /** Whether the desktop sidebar is collapsed to icons-only */
  isDesktopCollapsed: boolean;
  toggleDesktopCollapsed: () => void;
}

const SidebarContext = createContext<SidebarContextValue | undefined>(
  undefined,
);

export function SidebarProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isDesktopCollapsed, setIsDesktopCollapsed] = useState(() => {
    if (typeof window === "undefined") return false;
    try {
      return localStorage.getItem(STORAGE_KEY) === "true";
    } catch {
      return false;
    }
  });
  const pathname = usePathname();

  // Close mobile sidebar on route change
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- standard Next.js pattern for route-change cleanup
    setIsOpen(false);
  }, [pathname]);

  // Close mobile sidebar on Escape key
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setIsOpen(false);
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  const toggle = useCallback(() => setIsOpen((prev) => !prev), []);
  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);

  const toggleDesktopCollapsed = useCallback(() => {
    setIsDesktopCollapsed((prev) => {
      const next = !prev;
      try {
        localStorage.setItem(STORAGE_KEY, String(next));
      } catch {
        // storage unavailable
      }
      return next;
    });
  }, []);

  const contextValue = useMemo<SidebarContextValue>(
    () => ({
      isOpen,
      toggle,
      open,
      close,
      isDesktopCollapsed,
      toggleDesktopCollapsed,
    }),
    [isOpen, toggle, open, close, isDesktopCollapsed, toggleDesktopCollapsed],
  );

  return (
    <SidebarContext.Provider value={contextValue}>
      {children}
    </SidebarContext.Provider>
  );
}

export function useSidebar() {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider");
  }
  return context;
}
