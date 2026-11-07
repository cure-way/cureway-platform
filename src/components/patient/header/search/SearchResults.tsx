"use client";

import { useEffect, useMemo } from "react";
import { SearchResult } from "@/types/search";
import { useSearchContext } from "@/contexts/SearchContext";
import { useRouter } from "next/navigation";
import { ArrowUpLeft } from "lucide-react";

interface SearchResultsProps {
  results: SearchResult[];
}

export function SearchResults({ results }: SearchResultsProps) {
  const { query, activeIndex, setItemCount, handleSelect, setOpen } =
    useSearchContext();
  const router = useRouter();

  const medicineResults = useMemo(
    () => results.filter((r) => r.type === "medicine").slice(0, 3),
    [results],
  );
  const pharmacyResults = useMemo(
    () => results.filter((r) => r.type === "pharmacy").slice(0, 2),
    [results],
  );

  // Flat list for keyboard navigation
  const flatItems: SearchResult[] = useMemo(
    () => [...medicineResults, ...pharmacyResults],
    [medicineResults, pharmacyResults],
  );

  // Report item count to context (+ 1 for "Show all results" CTA)
  useEffect(() => {
    setItemCount(flatItems.length + 1);
  }, [flatItems.length, setItemCount]);

  // Handle Enter on highlighted item
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Enter" || activeIndex < 0) return;
      e.preventDefault();
      if (activeIndex < flatItems.length) {
        handleSelect(flatItems[activeIndex]);
      } else {
        // "Show all results" CTA
        setOpen(false);
        router.push(`/search?q=${encodeURIComponent(query)}`);
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [activeIndex, flatItems, handleSelect, query, router, setOpen]);

  const handleShowAll = () => {
    setOpen(false);
    router.push(`/search?q=${encodeURIComponent(query)}`);
  };

  if (results.length === 0) {
    return (
      <div className="p-4 text-center text-gray-500 text-t-14">
        No results found
      </div>
    );
  }

  let globalIdx = 0;

  return (
    <div className="p-3 md:p-4">
      <p className="font-semibold text-black text-t-14 mb-3">Suggestions</p>

      {/* Medicines Section */}
      {medicineResults.length > 0 && (
        <div className="mb-3">
          <p className="text-primary font-medium text-t-12 mb-2 px-2">
            Medicines
          </p>
          <ul className="space-y-0.5">
            {medicineResults.map((item) => {
              const idx = globalIdx++;
              return (
                <li
                  key={item.id}
                  id={`search-item-${idx}`}
                  className={`flex items-center justify-between px-2 py-2.5 rounded-lg cursor-pointer transition-colors ${
                    idx === activeIndex
                      ? "bg-primary-light"
                      : "hover:bg-gray-50"
                  }`}
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => handleSelect(item)}
                  role="option"
                  aria-selected={idx === activeIndex}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-t-14">💊</span>
                    <div>
                      <p className="font-semibold text-black text-t-14">
                        {item.title}
                      </p>
                      <p className="text-gray-500 text-t-12">{item.subtitle}</p>
                    </div>
                  </div>
                  <ArrowUpLeft className="w-4 h-4 text-gray-400 shrink-0" />
                </li>
              );
            })}
          </ul>
        </div>
      )}

      {/* Pharmacies Section */}
      {pharmacyResults.length > 0 && (
        <div className="mb-3">
          <p className="text-primary font-medium text-t-12 mb-2 px-2">
            Pharmacies
          </p>
          <ul className="space-y-0.5">
            {pharmacyResults.map((item) => {
              const idx = globalIdx++;
              return (
                <li
                  key={item.id}
                  id={`search-item-${idx}`}
                  className={`flex items-center justify-between px-2 py-2.5 rounded-lg cursor-pointer transition-colors ${
                    idx === activeIndex
                      ? "bg-primary-light"
                      : "hover:bg-gray-50"
                  }`}
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => handleSelect(item)}
                  role="option"
                  aria-selected={idx === activeIndex}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-t-14">🏥</span>
                    <div>
                      <p className="font-semibold text-black text-t-14">
                        {item.title}
                      </p>
                      <p className="text-gray-500 text-t-12">{item.subtitle}</p>
                    </div>
                  </div>
                  <ArrowUpLeft className="w-4 h-4 text-gray-400 shrink-0" />
                </li>
              );
            })}
          </ul>
        </div>
      )}

      {/* Show all results link */}
      <button
        type="button"
        className={`w-full text-center py-3 text-t-14 border-t border-gray-100 transition-colors ${
          activeIndex === flatItems.length
            ? "text-primary bg-primary-light"
            : "text-gray-500 hover:text-primary"
        }`}
        onMouseDown={(e) => e.preventDefault()}
        onClick={handleShowAll}
      >
        Show all results for &ldquo;{query}&rdquo;
      </button>
    </div>
  );
}
