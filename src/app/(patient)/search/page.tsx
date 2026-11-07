"use client";

import { Suspense, useState, useEffect, useMemo } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { SearchResult, SearchPageState } from "@/types/search";
import {
  SearchResultCard,
  SearchFilterTags,
  SearchEmptyState,
  NearbyPharmaciesSection,
} from "@/components/patient/search";
import type { FilterTag } from "@/components/patient/search";
import { Loader2 } from "lucide-react";
import { PageContainer, PageHeader } from "@/components/shared";
import {
  DEFAULT_FILTER_TAGS,
  searchMedicines,
  getSuggestion,
} from "@/services/searchDemoData";

/* ------------------------------------------------------------------ */
/* Page Component                                                      */
/* ------------------------------------------------------------------ */

function SearchPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Derive query directly from URL — no sync effect needed
  const query = searchParams.get("q") ?? "";
  const [filterTags, setFilterTags] = useState<FilterTag[]>([]);
  const [pageState, setPageState] = useState<SearchPageState>("loading");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [showNearby, setShowNearby] = useState(false);

  /* Simulated search — triggered by query/filter changes */
  useEffect(() => {
    let cancelled = false;

    // Defer the loading state into a microtask to avoid
    // synchronous setState inside an effect body
    queueMicrotask(() => {
      if (!cancelled) setPageState("loading");
    });

    // Simulate network delay
    const timer = setTimeout(() => {
      if (cancelled) return;

      // Spell-check — misspelled query → suggestion state
      const suggestion = getSuggestion(query);
      if (suggestion) {
        setResults([]);
        setPageState("no-results-spelling");
        return;
      }

      if (query.trim().length > 0) {
        // Too many filters → no results
        if (filterTags.length >= 6) {
          setResults([]);
          setPageState("no-results-filters");
          return;
        }

        // Run actual search against mock DB
        let found = searchMedicines(query);

        // Apply filter tag logic
        if (filterTags.length > 0) {
          found = found.filter((item) => {
            for (const tag of filterTags) {
              if (tag.id === "no-prescription" && item.requiresPrescription)
                return false;
              if (tag.id === "in-stock" && !item.isAvailable) return false;
              if (tag.id === "on-sale" && item.price === item.originalPrice)
                return false;
              if (tag.id === "distance" && (item.pharmacyDistanceKm ?? 0) > 5)
                return false;
              if (tag.id === "price" && (item.price ?? 0) > 50) return false;
            }
            return true;
          });
        }

        if (found.length === 0) {
          setResults([]);
          setPageState("not-available-nearby");
          return;
        }

        setResults(found);
        setPageState("results");
      } else {
        setResults([]);
        setPageState("results");
      }
    }, 600);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [query, filterTags]);

  const handleRemoveTag = (id: string) => {
    setFilterTags((prev) => prev.filter((t) => t.id !== id));
  };

  const handleResetFilters = () => {
    setFilterTags([]);
  };

  const handleEditFilters = () => {
    // Toggle showing default filter tags for demo
    setFilterTags(DEFAULT_FILTER_TAGS);
  };

  const handleSearchSuggestion = (term: string) => {
    router.push(`/search?q=${encodeURIComponent(term)}`);
  };

  const handleTryAgain = () => {
    // Force re-run by toggling a filter (the effect will re-fire)
    setFilterTags((prev) => [...prev]);
  };

  const handleResultClick = (result: SearchResult) => {
    router.push(`/medicines/${result.id}`);
  };

  const resultCount = results.length;
  const deliveryTime = 25; // Mock

  const spellSuggestion = useMemo(() => getSuggestion(query), [query]);

  return (
    <PageContainer variant="list">
      <PageHeader title="Search" subtitle="Medicines and pharmacies near you" />

      {/* Results Header */}
      {pageState === "results" && results.length > 0 && (
        <div className="mb-4">
          <p className="text-primary-darker">
            <span className="font-semibold text-t-17 md:text-t-21">
              ({resultCount})
            </span>
            <span className="text-t-21 md:text-[30px] font-normal leading-[1.2]">
              {" "}
              results · delivery in{" "}
            </span>
            <span className="font-semibold text-t-17 md:text-t-21">
              ({deliveryTime})
            </span>
            <span className="text-t-17 md:text-t-17 font-normal leading-[1.2]">
              {" "}
              min
            </span>
          </p>
        </div>
      )}

      {/* Filter Tags */}
      {filterTags.length > 0 && (
        <div className="mb-5">
          <SearchFilterTags tags={filterTags} onRemove={handleRemoveTag} />
        </div>
      )}

      {/* Loading State */}
      {pageState === "loading" && (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      )}

      {/* Results List */}
      {pageState === "results" && results.length > 0 && !showNearby && (
        <div className="space-y-4">
          {results.map((result) => (
            <SearchResultCard
              key={result.id}
              result={result}
              onClick={handleResultClick}
            />
          ))}
        </div>
      )}

      {/* Results with Nearby Pharmacies */}
      {pageState === "results" && showNearby && (
        <NearbyPharmaciesSection onCancel={() => setShowNearby(false)} />
      )}

      {/* Nearby Pharmacies state (from page state) */}
      {pageState === "nearby-pharmacies" && (
        <NearbyPharmaciesSection
          onCancel={() => {
            setPageState("results");
            setShowNearby(false);
          }}
        />
      )}

      {/* Empty States */}
      {pageState === "no-results-filters" && (
        <SearchEmptyState
          state="no-results-filters"
          onResetFilters={handleResetFilters}
          onEditFilters={handleEditFilters}
        />
      )}

      {pageState === "no-results-spelling" && (
        <SearchEmptyState
          state="no-results-spelling"
          query={query}
          suggestion={spellSuggestion ?? undefined}
          onSearchSuggestion={handleSearchSuggestion}
        />
      )}

      {pageState === "not-available-nearby" && (
        <SearchEmptyState
          state="not-available-nearby"
          onResetFilters={handleResetFilters}
          onEditFilters={handleEditFilters}
        />
      )}

      {pageState === "network-error" && (
        <SearchEmptyState state="network-error" onTryAgain={handleTryAgain} />
      )}
    </PageContainer>
  );
}

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      }
    >
      <SearchPageContent />
    </Suspense>
  );
}
