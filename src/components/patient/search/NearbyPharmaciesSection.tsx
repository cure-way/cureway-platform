"use client";

import { NearbyPharmacy } from "@/types/search";
import { Star, Clock, Route } from "lucide-react";
import { RiFirstAidKitFill } from "react-icons/ri";
import { formatCurrency } from "@/lib/format";

const MOCK_NEARBY_PHARMACIES: NearbyPharmacy[] = [
  {
    id: "np1",
    name: "City Pharmacy",
    location: "AlRemal area, Gaza",
    rating: 4.9,
    deliveryRange: "25-30 minutes",
    distance: "7.25 km",
    price: 12.5,
    freeDelivery: true,
  },
  {
    id: "np2",
    name: "Al-Shifa Pharmacy",
    location: "AlRemal area, Gaza",
    rating: 4.9,
    deliveryRange: "15-18 minutes",
    distance: "6.25 km",
    price: 12.5,
    freeDelivery: true,
  },
];

interface NearbyPharmaciesSectionProps {
  pharmacies?: NearbyPharmacy[];
  onCancel?: () => void;
  onSelectPharmacy?: (pharmacy: NearbyPharmacy) => void;
}

export function NearbyPharmaciesSection({
  pharmacies = MOCK_NEARBY_PHARMACIES,
  onCancel,
  onSelectPharmacy,
}: NearbyPharmaciesSectionProps) {
  return (
    <div className="flex flex-col items-center gap-6">
      {/* Nearby Pharmacies Card */}
      <div className="w-full border-2 border-primary-light-active rounded-2xl p-3">
        {/* Header */}
        <div className="border-b border-black/10 pb-4 mb-2">
          <h3 className="font-bold text-primary-dark-active text-2xl md:text-[30px] leading-[1.2] mb-3">
            Nearby Pharmacies
          </h3>
          <ul className="space-y-1">
            <li className="flex items-start gap-1.5 text-black/50 text-sm md:text-lg font-medium">
              <span className="mt-0.5">·</span>
              These pharmacies are far away from you
            </li>
            <li className="flex items-start gap-1.5 text-black/50 text-sm md:text-lg font-medium">
              <span className="mt-0.5">·</span>
              Note that it may take a long time
            </li>
          </ul>
        </div>

        {/* Pharmacy Cards */}
        <div className="space-y-2">
          {pharmacies.map((pharmacy) => (
            <div
              key={pharmacy.id}
              className="bg-neutral-light-hover rounded-2xl px-3 py-4 shadow-[0px_1px_2px_0px_rgba(0,0,0,0.3),0px_1px_3px_0px_rgba(0,0,0,0.15)] cursor-pointer hover:shadow-md transition-shadow"
              role="button"
              tabIndex={0}
              onClick={() => onSelectPharmacy?.(pharmacy)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  onSelectPharmacy?.(pharmacy);
                }
              }}
              aria-label={`${pharmacy.name} - ${formatCurrency(pharmacy.price)}`}
            >
              {/* Top row: icon + name + price */}
              <div className="flex items-center gap-2.5 mb-4">
                <div className="w-15 h-15 rounded-lg bg-white flex items-center justify-center shrink-0">
                  <RiFirstAidKitFill className="w-7 h-7 text-primary-light-active" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-primary text-lg md:text-xl leading-[1.2]">
                    {pharmacy.name}
                  </p>
                  <p className="text-neutral-dark text-sm md:text-lg font-normal leading-[1.2]">
                    {pharmacy.location}
                  </p>
                </div>
                <p className="font-bold text-success-dark text-base leading-[1.2] shrink-0">
                  {formatCurrency(pharmacy.price)}
                </p>
              </div>

              {/* Bottom row: badges */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {/* Rating badge */}
                  <div className="flex items-center gap-1 bg-white rounded-lg px-2 py-1 h-9">
                    <Star className="w-3 h-3 text-warning fill-warning" />
                    <span className="text-t-12 font-semibold text-neutral-darker">
                      {pharmacy.rating}
                    </span>
                  </div>
                  {/* Time badge */}
                  <div className="flex items-center gap-1 bg-white rounded-lg px-2 py-1 h-9">
                    <Clock className="w-3 h-3 text-neutral-dark-active" />
                    <span className="text-t-12 font-medium text-neutral-dark-active">
                      {pharmacy.deliveryRange}
                    </span>
                  </div>
                  {/* Distance badge */}
                  <div className="flex items-center gap-1 bg-white rounded-lg px-2 py-1 h-9">
                    <Route className="w-3 h-3 text-neutral-dark-active" />
                    <span className="text-t-12 font-medium text-neutral-dark-active">
                      {pharmacy.distance}
                    </span>
                  </div>
                </div>
                {pharmacy.freeDelivery && (
                  <div className="bg-success-light-hover rounded-lg px-2 py-1 h-9 flex items-center justify-center">
                    <span className="text-t-12 font-semibold text-success-darker text-center">
                      Free Delivery
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Cancel Button */}
      <button
        className="w-full max-w-3xl border border-primary rounded-2xl py-4 text-primary font-semibold text-base leading-[1.2] hover:bg-primary-light/30 transition-colors"
        onClick={onCancel}
        type="button"
      >
        Cancel
      </button>
    </div>
  );
}
