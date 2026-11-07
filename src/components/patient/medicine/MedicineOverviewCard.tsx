"use client";

import { useState } from "react";
import Image from "next/image";
import toast from "react-hot-toast";

import { Medicine, PharmacyStock } from "@/types/medicine.types";
import { useCartStore } from "@/store/cart.store";
import { formatPriceRange } from "@/lib/format";
import { notifyDisabled } from "@/lib/showcase/notify";

interface Props {
  medicine: Medicine;
  /**
   * The pharmacy this medicine is added from — normally the cheapest one
   * that has stock. Undefined when no pharmacy carries it, in which case
   * adding to the cart is not possible.
   */
  stock?: PharmacyStock;
}

export default function MedicineOverviewCard({ medicine, stock }: Props) {
  const [quantity, setQuantity] = useState(1);
  const addItem = useCartStore((s) => s.addItem);

  const canAddToCart = Boolean(stock?.inventoryId);

  const handleAddToCart = () => {
    if (!stock?.inventoryId) {
      // No inventory row means POST /orders could not reference the item.
      notifyDisabled("this medicine has no pharmacy stock to order from");
      return;
    }

    const pharmacy = {
      id: String(stock.pharmacyId),
      name: stock.pharmacyName,
      address: stock.addressLine,
    };

    addItem(pharmacy, {
      id: `${stock.inventoryId}-${medicine.id}`,
      medicineId: String(medicine.id),
      inventoryId: stock.inventoryId,
      name: medicine.name,
      genericName: medicine.genericName,
      image: medicine.imageUrl,
      quantity,
      price: stock.price,
      requiresPrescription: medicine.requiresPrescription,
      pharmacy: { ...pharmacy, isAvailable: true },
    });
  };

  const minPrice = medicine.minPrice ?? 0;
  const maxPrice = medicine.maxPrice ?? 0;

  const displayPrice = formatPriceRange(minPrice, maxPrice);

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
            <h1 className="mb-2 text-page-title text-primary-darker">
              {medicine.name}
            </h1>

            <p className="text-gray-500 text-t-14">{medicine.genericName}</p>

            <p className="mt-1 text-gray-500 text-t-14">
              {medicine.manufacturer}
            </p>
          </div>

          {/* Price */}
          <div className="font-bold text-gray-900 text-t-25">
            {displayPrice}
          </div>

          {/* Badges */}
          <div className="flex flex-wrap gap-2 text-t-14">
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
            <label className="font-medium text-gray-700 text-t-14">
              Quantity
            </label>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="flex justify-center items-center hover:bg-gray-50 border border-gray-300 rounded-lg w-10 h-10"
              >
                −
              </button>

              <span className="w-12 font-semibold text-t-17 text-center">
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
            <button
              type="button"
              onClick={handleAddToCart}
              disabled={!canAddToCart}
              className="flex-1 rounded-lg bg-(--color-primary) px-6 py-3.5 font-semibold text-white transition hover:bg-(--color-primary-dark) disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Add to Cart
            </button>

            <button
              type="button"
              onClick={() =>
                toast.success(`${medicine.name} — link copied for sharing`)
              }
              className="hover:bg-gray-50 px-6 py-3.5 border border-gray-300 rounded-lg transition"
            >
              Share
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
