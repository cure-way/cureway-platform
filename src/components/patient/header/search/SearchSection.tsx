"use client";

import { SearchResult } from "@/types/search";
import { useSearchContext } from "@/contexts/SearchContext";

interface SearchSectionProps {
  title: string;
  icon: string;
  items: SearchResult[];
  offset: number;
  onSelect?: (item: SearchResult) => void;
}

export function SearchSection({
  title,
  icon,
  items,
  onSelect,
}: SearchSectionProps) {
  const { query } = useSearchContext();

  return (
    <>
      {items.length !== 0 ? (
        <div>
          <p className="mb-2 font-semibold text-gray-500 text-t-12">
            Suggestions
          </p>
          <ul className="space-y-2">
            {items.map((item) => {
              return (
                <li
                  key={item.id}
                  className="flex items-start gap-2 hover:bg-gray-200 px-2 py-2 rounded cursor-pointer"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => onSelect?.(item)}
                >
                  <span className="mt-0.5">{icon}</span>
                  <div>
                    <p className="text-t-14">{item.title}</p>
                    <p className="text-gray-500 text-t-12">{item.subtitle}</p>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      ) : (
        <p className="py-4 text-gray-500 text-t-14 text-center">
          No Found {title} for &ldquo;{query}&rdquo;
        </p>
      )}
    </>
  );
}
