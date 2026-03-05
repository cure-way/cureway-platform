"use client";

import { useState } from "react";
import Image from "next/image";
import { Medicine } from "@/types/medicine.types";

interface Props {
  medicine: Medicine;
}

export default function MedicineOverviewCard({ medicine }: Props) {
  const [quantity, setQuantity] = useState(1);

  const displayPrice =
    medicine.minPrice === medicine.maxPrice
      ? `$${medicine.minPrice.toFixed(2)}`
      : `$${medicine.minPrice.toFixed(2)} – $${medicine.maxPrice.toFixed(2)}`;

  return (
    <div className="bg-white shadow-sm p-6 sm:p-8 border border-gray-200 rounded-2xl">
      <div className="gap-8 grid grid-cols-1 lg:grid-cols-2">
        <div className="relative bg-gray-50 border border-gray-200 rounded-xl w-full aspect-square overflow-hidden">
          <Image
            src={medicine.imageUrl || "/placeholder-medicine.png"}
            alt={medicine.name}
            fill
            className="p-8 object-contain"
          />
        </div>

        <div className="space-y-6">
          {/* Title */}
          <div>
            <h1 className="mb-2 font-bold text-gray-900 text-2xl sm:text-3xl">
              {medicine.name}
            </h1>

            <p className="text-gray-500 text-sm">{medicine.genericName}</p>

            <p className="mt-1 text-gray-500 text-sm">
              {medicine.manufacturer}
            </p>
          </div>

          {/* Price */}
          <div className="font-bold text-gray-900 text-3xl">{displayPrice}</div>

          {/* Badges */}
          <div className="flex flex-wrap gap-2 text-sm">
            <span className="bg-gray-100 px-3 py-1 rounded-lg text-gray-700">
              {medicine.dosageForm}
            </span>

            <span className="bg-gray-100 px-3 py-1 rounded-lg text-gray-700">
              {medicine.packSize} {medicine.packUnit}
            </span>

            <span className="bg-gray-100 px-3 py-1 rounded-lg text-gray-700">
              {medicine.packSize}
            </span>

            <span className="bg-gray-100 px-3 py-1 rounded-lg text-gray-700">
              {medicine.categoryName}
            </span>

            {medicine.requiresPrescription && (
              <span className="bg-orange-50 px-3 py-1 rounded-lg text-orange-700">
                Prescription Required
              </span>
            )}
          </div>

          {/* Quantity */}
          <div className="space-y-2">
            <label className="font-medium text-gray-700 text-sm">
              Quantity
            </label>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="flex justify-center items-center hover:bg-gray-50 border border-gray-300 rounded-lg w-10 h-10"
              >
                −
              </button>

              <span className="w-12 font-semibold text-lg text-center">
                {quantity}
              </span>

              <button
                onClick={() => setQuantity((q) => q + 1)}
                className="flex justify-center items-center hover:bg-gray-50 border border-gray-300 rounded-lg w-10 h-10"
              >
                +
              </button>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button className="flex-1 rounded-lg bg-(--color-primary) px-6 py-3.5 font-semibold text-white transition hover:bg-(--color-primary-dark)">
              Add to Cart
            </button>

            <button className="hover:bg-gray-50 px-6 py-3.5 border border-gray-300 rounded-lg transition">
              Share
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
