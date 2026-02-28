"use client";

import { Medicine } from "@/types/medicine.types";
import { useRouter } from "next/navigation";

interface Props {
  medicines: Medicine[];
}

export default function SimilarProductsSection({ medicines }: Props) {
  const router = useRouter();

  if (medicines.length === 0) return null;

  return (
    <div className="bg-white shadow-sm mb-6 p-6 sm:p-8 border border-gray-200 rounded-2xl">
      <h2 className="mb-6 font-bold text-gray-900 text-xl">Similar Products</h2>

      <div className="-mx-2 px-2 overflow-x-auto">
        <div className="flex gap-4 pb-2">
          {medicines.map((medicine) => (
            <div
              key={medicine.id}
              onClick={() => router.push(`/medicines/${medicine.id}`)}
              className="bg-gray-50 hover:shadow-md p-4 border border-gray-200 rounded-xl w-60 transition cursor-pointer shrink-0"
            >
              <h3 className="mb-2 font-semibold text-gray-900 text-sm truncate">
                {medicine.name}
              </h3>

              <p className="text-gray-600 text-xs">{medicine.dosageForm}</p>

              <div className="mt-2 font-semibold text-gray-900 text-sm">
                ${medicine.minPrice.toFixed(2)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
