"use client";

import { FaSearch } from "react-icons/fa";
import { IoCloseCircle } from "react-icons/io5";
import { SearchDropdown } from "./search/SearchDropdown";
import { useSearchContext } from "@/contexts/SearchContext";
import { useClickOutside } from "@/hooks/useClickOutside";
import { useRouter } from "next/navigation";

export function HeaderSearch() {
  const { query, setQuery, clearQuery, setOpen, inputRef, handleInputKeyDown } =
    useSearchContext();
  const router = useRouter();

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && query.trim().length > 0) {
      e.preventDefault();
      setOpen(false);
      inputRef.current?.blur();
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
      return;
    }
    handleInputKeyDown(e);
  };

  const containerRef = useClickOutside<HTMLDivElement>(() => {
    setOpen(false);
  });

  return (
    <div ref={containerRef} className="relative z-50 w-full">
      <div className="relative z-50 flex items-center gap-2 md:gap-3 bg-gray-100 px-3 md:px-4 rounded-lg h-11 focus-within:ring-2 focus-within:ring-primary/40 transition-shadow">
        <FaSearch className="text-gray-400 w-3.5 h-3.5 md:w-4 md:h-4" />
        <input
          ref={inputRef}
          type="text"
          placeholder="Search medicine, pharmacy..."
          className="bg-transparent outline-none w-full text-t-12 md:text-t-14 focus-visible:outline-none"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => setOpen(true)}
          aria-label="Search medicine or pharmacy"
        />

        {/* Clear (X) button — visible when typing */}
        {query.length > 0 && (
          <button
            className="shrink-0 p-1 hover:bg-primary-light rounded-lg transition-colors"
            onClick={clearQuery}
            aria-label="Clear search"
            type="button"
          >
            <IoCloseCircle className="w-4 h-4 text-gray-400" />
          </button>
        )}
      </div>

      <SearchDropdown />
    </div>
  );
}
