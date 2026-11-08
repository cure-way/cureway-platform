"use client";

import { useState, useEffect, useMemo } from "react";
import { useSearchContext } from "@/contexts/SearchContext";
import { useSearchRecents } from "@/hooks/search/useSearchRecents";
import { FaHistory } from "react-icons/fa";
import { X, ChevronRight, MapPin } from "lucide-react";
import { QUICK_ACTIONS, CURRENT_LOCATION } from "@/services/searchDemoData";

export function SearchDefaultState() {
  const { recents, setRecents, STORAGE_KEY } = useSearchRecents();
  const { activeIndex, setItemCount, handleSelect, setQuery, setOpen } =
    useSearchContext();
  const [quickActions, setQuickActions] = useState(QUICK_ACTIONS);

  // Build flat navigable list: quickActions + recents + location card
  const navigableCount = useMemo(
    () => quickActions.length + recents.length + 1, // +1 for location card
    [quickActions.length, recents.length],
  );

  // Report item count to context
  useEffect(() => {
    setItemCount(navigableCount);
  }, [navigableCount, setItemCount]);

  // Handle Enter on highlighted item
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Enter" || activeIndex < 0) return;
      e.preventDefault();

      if (activeIndex < quickActions.length) {
        // Quick action
        setQuery(quickActions[activeIndex].label);
      } else if (activeIndex < quickActions.length + recents.length) {
        // Recent
        const recentItem = recents[activeIndex - quickActions.length];
        handleSelect(recentItem);
      } else {
        // Location card
        setOpen(false);
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [activeIndex, quickActions, recents, setQuery, handleSelect, setOpen]);

  const clearRecents = () => {
    if (typeof window === "undefined") return;
    localStorage.removeItem(STORAGE_KEY);
    setRecents([]);
  };

  const removeQuickAction = (id: string) => {
    setQuickActions((prev) => prev.filter((a) => a.id !== id));
  };

  const handleQuickAction = (action: (typeof QUICK_ACTIONS)[0]) => {
    setQuery(action.label);
  };

  // Compute the location card index up front (last navigable item)
  const locationIdx = quickActions.length + recents.length;

  let globalIdx = 0;

  return (
    <div className="space-y-4 p-3 md:p-4">
      {/* Quick Actions */}
      {quickActions.length > 0 && (
        <div>
          <p className="font-semibold text-black text-t-14 mb-2">
            Quick actions
          </p>
          <div className="flex flex-wrap gap-2">
            {quickActions.map((action) => {
              const idx = globalIdx++;
              return (
                <button
                  key={action.id}
                  className={`flex items-center gap-1.5 text-primary text-t-12 font-medium px-3 py-1.5 rounded-full transition-colors ${
                    idx === activeIndex
                      ? "bg-primary-light ring-2 ring-primary/40"
                      : "bg-primary-light hover:bg-primary-light/80"
                  }`}
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => handleQuickAction(action)}
                >
                  {action.icon && <span>{action.icon}</span>}
                  <span>{action.label}</span>
                  {(action.count ?? 0) > 0 && (
                    <span className="text-primary/70">({action.count})</span>
                  )}
                  <X
                    className="w-3 h-3 ml-0.5 text-primary/60 hover:text-primary"
                    aria-label={`Remove ${action.label}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      removeQuickAction(action.id);
                    }}
                  />
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Recents */}
      <div>
        <div className="flex justify-between items-center mb-2">
          <p className="font-semibold text-black text-t-14">Recents</p>
          {recents.length > 0 && (
            <button
              className="text-primary text-t-12 hover:text-primary-dark transition-colors"
              onClick={clearRecents}
            >
              Delete all
            </button>
          )}
        </div>
        {recents.length !== 0 ? (
          <ul className="space-y-0.5">
            {recents.map((item) => {
              const idx = globalIdx++;
              return (
                <li
                  key={item.id}
                  className={`flex items-center justify-between px-2 md:px-3 py-2.5 rounded-lg text-t-12 md:text-t-14 cursor-pointer transition-colors ${
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
                    {item.type === "medicine" ? (
                      <span className="text-t-14">💊</span>
                    ) : (
                      <span className="text-t-14">🏥</span>
                    )}
                    <div>
                      <p className="font-semibold text-black text-t-14">
                        {item.title}
                      </p>
                      <p className="text-gray-500 text-t-12">{item.subtitle}</p>
                    </div>
                  </div>
                  <FaHistory className="text-gray-400 w-3.5 h-3.5 shrink-0" />
                </li>
              );
            })}
          </ul>
        ) : (
          <p className="py-6 md:py-4 text-gray-500 text-t-12 md:text-t-14 text-center">
            No recent searches
          </p>
        )}
      </div>

      {/* Use Current Location */}
      <button
        type="button"
        className={`flex items-center justify-between w-full px-3 py-3 rounded-xl transition-colors ${
          locationIdx === activeIndex
            ? "bg-primary-light ring-2 ring-primary/40"
            : "bg-gray-50 hover:bg-gray-100"
        }`}
        onMouseDown={(e) => e.preventDefault()}
        onClick={() => setOpen(false)}
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-primary-light flex items-center justify-center">
            <MapPin className="w-4 h-4 text-primary" />
          </div>
          <div className="text-left">
            <p className="text-t-14 font-semibold text-black">
              {CURRENT_LOCATION.title}
            </p>
            <p className="text-t-12 text-gray-500">
              {CURRENT_LOCATION.address}
            </p>
          </div>
        </div>
        <ChevronRight className="w-5 h-5 text-gray-400 shrink-0" />
      </button>
    </div>
  );
}
