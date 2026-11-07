"use client";

import Image from "next/image";
import { Globe } from "lucide-react";
import { SearchResult } from "@/types/search";
import { cn } from "@/lib/utils";
import { formatCurrency } from "@/lib/format";

interface SearchResultCardProps {
  result: SearchResult;
  onClick?: (result: SearchResult) => void;
}

export function SearchResultCard({ result, onClick }: SearchResultCardProps) {
  const tags = result.tags ?? ["OTC", "12 Tablets", "400 mg"];
  const price = result.price ?? 12.0;
  const originalPrice = result.originalPrice ?? 15.0;
  const pharmacyName = result.pharmacyName ?? "City Pharmacy";
  const isAvailable = result.isAvailable ?? true;
  const deliveryTime = result.deliveryTimeMinutes ?? 15;
  const distance = result.pharmacyDistanceKm ?? 2.55;

  return (
    <div
      className="bg-white border border-gray-200 rounded-2xl overflow-hidden cursor-pointer hover:border-primary/30 transition-colors focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:outline-none"
      role="button"
      tabIndex={0}
      onClick={() => onClick?.(result)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick?.(result);
        }
      }}
      aria-label={`${result.title} - ${formatCurrency(price)} at ${pharmacyName}`}
    >
      {/* Medicine Info Row */}
      <div className="flex items-start gap-4 p-4">
        {/* Medicine Image */}
        <div className="w-20 h-20 md:w-24 md:h-24 bg-gray-50 rounded-xl flex items-center justify-center shrink-0 overflow-hidden">
          {result.image ? (
            <Image
              src={result.image}
              alt={result.title}
              width={96}
              height={96}
              className="object-contain"
            />
          ) : (
            <div className="w-16 h-16 flex items-center justify-center">
              <span className="text-3xl">💊</span>
            </div>
          )}
        </div>

        {/* Medicine Details */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-bold text-black text-base md:text-lg">
              {result.title}
            </h3>
            <button
              className="shrink-0 p-1 hover:bg-gray-100 rounded-full transition-colors"
              aria-label="More options"
              onClick={(e) => e.stopPropagation()}
            >
              <Globe className="w-5 h-5 text-primary" />
            </button>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-1.5 mt-2">
            {tags.map((tag, i) => (
              <span
                key={`${tag}-${i}`}
                className="text-xs font-medium text-primary bg-primary-light px-2.5 py-1 rounded-md"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-2 mt-2">
            <span className="font-bold text-primary text-base">
              {formatCurrency(price)}
            </span>
            {originalPrice > price && (
              <span className="text-gray-400 text-sm line-through">
                {formatCurrency(originalPrice)}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Pharmacy Info Row */}
      <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-primary-light flex items-center justify-center">
            <span className="text-xs">🏥</span>
          </div>
          <div>
            <p className="font-semibold text-black text-sm">{pharmacyName}</p>
            <p className="text-gray-500 text-xs">
              Deliver · {deliveryTime} minutes | {distance} km
            </p>
          </div>
        </div>
        <span
          className={cn(
            "text-xs font-medium px-3 py-1 rounded-full",
            isAvailable
              ? "text-success bg-success-light"
              : "text-gray-500 bg-gray-100",
          )}
        >
          {isAvailable ? "Available" : "Unavailable"}
          {isAvailable && <span className="ml-1">✓</span>}
        </span>
      </div>
    </div>
  );
}
