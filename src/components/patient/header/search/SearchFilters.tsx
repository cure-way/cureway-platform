import { SearchFilter } from "@/types/search";
import { FilterToggle } from "./FilterToggle";
import { DEFAULT_FILTERS } from "@/lib/constants";

interface SearchFiltersProps {
  open: boolean;
  activeFilters: SearchFilter[];
  onToggle: (key: SearchFilter["key"]) => void;
  onApply: () => void;
  onClear: () => void;
}

export function SearchFilters({
  open,
  activeFilters,
  onToggle,
  onApply,
  onClear,
}: SearchFiltersProps) {
  if (!open) return null;

  return (
    <div className="space-y-4 mt-4">
      <div className="flex flex-wrap gap-2">
        {DEFAULT_FILTERS.map((filter) => {
          const isActive = activeFilters.some((f) => f.key === filter.key);

          return (
            <div
              key={filter.key}
              className="flex items-start gap-2 bg-gray-50 px-3 py-2 border rounded-lg w-full sm:w-fit text-t-14"
            >
              <div>
                <p className="font-medium">{filter.label}</p>
                <p className="text-gray-500 text-t-12">{filter.description}</p>
              </div>

              <FilterToggle
                checked={isActive}
                onChange={() => onToggle(filter.key)}
              />
            </div>
          );
        })}
      </div>

      <div className="flex gap-2">
        <button
          type="button"
          className="flex-1 hover:bg-gray-100 py-2 border rounded-lg text-gray-700 text-t-14"
          onClick={onClear}
        >
          Clear all
        </button>

        <button
          type="button"
          className="flex-1 bg-primary hover:bg-primary-hover py-2 rounded-lg text-white text-t-14"
          onClick={onApply}
        >
          Apply filters
        </button>
      </div>
    </div>
  );
}
