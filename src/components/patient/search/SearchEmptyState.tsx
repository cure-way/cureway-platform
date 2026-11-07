"use client";

import { Button } from "@/components/shared/Button";
import { SearchPageState } from "@/types/search";
import { FilterX, SearchX, WifiOff, MapPinOff } from "lucide-react";

interface SearchEmptyStateProps {
  state: Extract<
    SearchPageState,
    | "no-results-filters"
    | "no-results-spelling"
    | "not-available-nearby"
    | "network-error"
  >;
  query?: string;
  suggestion?: string;
  onResetFilters?: () => void;
  onEditFilters?: () => void;
  onTryAgain?: () => void;
  onSearchSuggestion?: (term: string) => void;
}

const stateConfig = {
  "no-results-filters": {
    icon: FilterX,
    title: "No results match your filters",
    subtitle: "Some filters may be too restrictive",
  },
  "no-results-spelling": {
    icon: SearchX,
    title: "",
    subtitle: "Check the spelling of the word or try a different keyword.",
  },
  "not-available-nearby": {
    icon: MapPinOff,
    title: "Not available nearby",
    subtitle: "Not currently available in nearby pharmacies.",
  },
  "network-error": {
    icon: WifiOff,
    title: "Unable to load results",
    subtitle: "Please check your connection and try again.",
  },
};

export function SearchEmptyState({
  state,
  query,
  suggestion,
  onResetFilters,
  onEditFilters,
  onTryAgain,
  onSearchSuggestion,
}: SearchEmptyStateProps) {
  const config = stateConfig[state];
  const Icon = config.icon;

  const title =
    state === "no-results-spelling"
      ? `No results for "${query}"`
      : config.title;

  /* ── Spelling / No-results state ── */
  if (state === "no-results-spelling") {
    return (
      <div className="flex flex-col items-center w-full">
        {/* Suggestions section – rendered first (above icon) */}
        {suggestion && (
          <div className="w-full mb-8">
            <h3 className="text-2xl md:text-[30px] font-bold text-primary-darker mb-4">
              Suggestions
            </h3>
            <div className="flex flex-col gap-3">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="w-full bg-primary-light rounded-2xl flex items-center px-5 py-5 md:py-6"
                >
                  <span className="text-lg md:text-xl font-semibold text-primary-darker">
                    Brand names (e.g., Panadol)
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Large search-off icon */}
        <div className="text-primary mb-4">
          <SearchX className="w-36 h-36 md:w-48 md:h-48" strokeWidth={1} />
        </div>

        {/* Title */}
        <h2 className="text-2xl md:text-[30px] font-bold text-primary-darker text-center mb-2">
          {title}
        </h2>

        {/* Subtitle */}
        <p className="text-lg md:text-xl font-medium text-neutral-dark text-center mb-8">
          {config.subtitle}
        </p>

        {/* CTA Button */}
        {suggestion && (
          <button
            onClick={() => onSearchSuggestion?.(suggestion)}
            className="w-full max-w-[26rem] h-11 bg-primary hover:bg-primary-hover text-white text-t-14-semibold rounded-lg transition-colors cursor-pointer"
          >
            Search for &ldquo;{suggestion}&rdquo;
          </button>
        )}
      </div>
    );
  }

  /* ── Other empty states (filters / nearby / network) ── */
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6">
      {/* Icon */}
      <div className="w-24 h-24 text-primary mb-6">
        <Icon className="w-full h-full" strokeWidth={1.2} />
      </div>

      {/* Title */}
      <h2 className="text-xl md:text-2xl font-bold text-black text-center mb-2">
        {title}
      </h2>

      {/* Subtitle */}
      <p className="text-neutral-dark text-sm text-center mb-8">
        {config.subtitle}
      </p>

      {/* Action Buttons */}
      <div className="w-full max-w-md space-y-3">
        {(state === "no-results-filters" ||
          state === "not-available-nearby") && (
          <div className="flex gap-3">
            <Button
              variant="primary"
              size="md"
              fullWidth
              onClick={onResetFilters}
            >
              Reset filters
            </Button>
            <Button
              variant="outline"
              size="md"
              fullWidth
              onClick={onEditFilters}
            >
              Edit Filters
            </Button>
          </div>
        )}

        {state === "network-error" && (
          <Button variant="primary" size="md" fullWidth onClick={onTryAgain}>
            Try again
          </Button>
        )}
      </div>
    </div>
  );
}
