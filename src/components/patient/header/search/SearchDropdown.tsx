"use client";

import { useSearchContext } from "@/contexts/SearchContext";
import { SearchDefaultState } from "./SearchDefaultState";
import { SearchResults } from "./SearchResults";
import { useSearch } from "@/hooks/search/useSearch";

export function SearchDropdown() {
  const { query, open, setOpen, appliedFilters } = useSearchContext();
  const { results, isLoading, error } = useSearch(query, appliedFilters);

  const isTyping = query.length > 0;

  if (!open) return null;

  return (
    <>
      {/* Backdrop blur / dim overlay */}
      <div
        className="fixed inset-0 bg-black/30 backdrop-blur-[2px] z-40"
        aria-hidden="true"
        onClick={() => setOpen(false)}
      />

      {/* Dropdown panel */}
      <div
        id="search-dropdown"
        className="absolute top-full left-0 right-0 z-50 bg-white shadow-lg mt-2 border rounded-xl max-h-[60vh] md:max-h-100 overflow-y-auto w-full md:min-w-125"
        role={isTyping ? "listbox" : "dialog"}
        aria-label={isTyping ? "Search suggestions" : "Search options"}
      >
        {isLoading && (
          <div className="p-4 text-neutral-dark text-t-14">Searching…</div>
        )}

        {error && !isLoading && (
          <div className="p-4 text-error text-t-14">{error}</div>
        )}

        {!isTyping && <SearchDefaultState />}

        {isTyping && !isLoading && !error && (
          <SearchResults results={results} />
        )}
      </div>
    </>
  );
}
