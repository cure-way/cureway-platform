"use client";

import {
  createContext,
  RefObject,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { SearchFilter, SearchResult } from "@/types/search";
import { useRouter, usePathname } from "next/navigation";
import { useSearchRecents } from "@/hooks/search/useSearchRecents";

interface SearchContextValue {
  query: string;
  setQuery: React.Dispatch<React.SetStateAction<string>>;
  clearQuery: () => void;
  open: boolean;
  setOpen: (v: boolean) => void;
  appliedFilters: SearchFilter[];
  setAppliedFilters: React.Dispatch<React.SetStateAction<SearchFilter[]>>;
  activeIndex: number;
  setActiveIndex: (v: number) => void;
  /** Total number of focusable items in the current dropdown list */
  itemCount: number;
  setItemCount: (v: number) => void;
  inputRef: RefObject<HTMLInputElement | null>;
  handleSelect: (item: SearchResult) => void;
  /** Keyboard handler to attach to search inputs */
  handleInputKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}

const SearchContext = createContext<SearchContextValue | null>(null);

export function SearchProvider({ children }: { children: React.ReactNode }) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [appliedFilters, setAppliedFilters] = useState<SearchFilter[]>([]);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [itemCount, setItemCount] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const pathname = usePathname();
  const { setRecents } = useSearchRecents();

  // Wrap setQuery to also reset activeIndex (avoids a separate effect)
  const wrappedSetQuery: React.Dispatch<React.SetStateAction<string>> =
    useCallback((action) => {
      setQuery(action);
      setActiveIndex(-1);
    }, []);

  // Close dropdown on route change (deferred to avoid sync setState in effect)
  useEffect(() => {
    queueMicrotask(() => {
      setOpen(false);
      inputRef.current?.blur();
    });
  }, [pathname]);

  // Global Escape key handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && open) {
        setOpen(false);
        setActiveIndex(-1);
        inputRef.current?.blur();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open]);

  const STORAGE_KEY = "searchRecents";

  const addToRecents = (item: SearchResult) => {
    if (typeof window === "undefined") return;

    setRecents((prev) => {
      const updated = [item, ...prev.filter((r) => r.id !== item.id)].slice(
        0,
        10,
      );

      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  };

  const clearQuery = useCallback(() => {
    setQuery("");
    setActiveIndex(-1);
    inputRef.current?.focus();
  }, []);

  const handleSelect = useCallback(
    (item: SearchResult) => {
      setQuery(item.title);
      addToRecents(item);
      setOpen(false);
      setActiveIndex(-1);
      inputRef.current?.blur();
      router.push(`/medicines/${item.id}`);
    },
    [router],
  );

  /** Centralised keyboard handler for both search inputs */
  const handleInputKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (!open) return;

      if (e.key === "ArrowDown") {
        e.preventDefault();
        setActiveIndex((prev) => (prev < itemCount - 1 ? prev + 1 : 0));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setActiveIndex((prev) => (prev > 0 ? prev - 1 : itemCount - 1));
      }
      // Enter on a highlighted item is handled inside each list via data-active click
    },
    [open, itemCount],
  );

  const contextValue = useMemo<SearchContextValue>(
    () => ({
      query,
      setQuery: wrappedSetQuery,
      clearQuery,
      open,
      setOpen,
      appliedFilters,
      setAppliedFilters,
      activeIndex,
      setActiveIndex,
      itemCount,
      setItemCount,
      inputRef,
      handleSelect,
      handleInputKeyDown,
    }),
    [
      query,
      wrappedSetQuery,
      clearQuery,
      open,
      appliedFilters,
      activeIndex,
      itemCount,
      handleSelect,
      handleInputKeyDown,
    ],
  );

  return (
    <SearchContext.Provider value={contextValue}>
      {children}
    </SearchContext.Provider>
  );
}

export function useSearchContext() {
  const ctx = useContext(SearchContext);
  if (!ctx) {
    throw new Error("useSearchContext must be used inside SearchProvider");
  }
  return ctx;
}
