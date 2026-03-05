"use client";

import { useEffect, useState } from "react";
import { useClickOutside } from "@/hooks/useClickOutside";

export function useGlobalSearch() {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const searchRef = useClickOutside<HTMLDivElement>(() => {
    setIsOpen(false);
  });

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search.trim());
    }, 400);

    return () => clearTimeout(handler);
  }, [search]);

  return {
    search,
    setSearch,
    debouncedSearch,
    isOpen,
    setIsOpen,
    searchRef,
  };
}
