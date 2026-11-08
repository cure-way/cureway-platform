import { Medicine } from "@/types/medicine.types";
import { Eye } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { formatPriceRange } from "@/lib/format";

interface Props {
  medicines: Medicine[];
  loading?: boolean;
  error?: string | null;
}

export default function ProductGrid({ medicines, loading, error }: Props) {
  if (loading) {
    return (
      <div className="gap-6 grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7">
        {Array.from({ length: 10 }).map((_, i) => (
          <div key={i} className="bg-gray-200 rounded-2xl h-60 animate-pulse" />
        ))}
      </div>
    );
  }

  if (error) {
    return <div className="py-10 text-red-600 text-center">{error}</div>;
  }

  if (!medicines.length) {
    return (
      <div className="py-10 text-gray-500 text-center">
        No medicines found in this category.
      </div>
    );
  }

  return (
    <div className="gap-6 grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7">
      {medicines.map((medicine) => (
        <div
          key={medicine.id}
          className="flex flex-col bg-white shadow-sm hover:shadow-md p-3 border border-gray-100 rounded-2xl h-full transition-shadow"
        >
          {/* Image */}
          <div className="relative bg-gray-100 mb-3 rounded-xl w-full h-32 overflow-hidden">
            <Link
              href={`/medicines/${medicine.id}`}
              className="top-2 right-2 z-10 absolute bg-white/80 hover:bg-white shadow-sm p-1.5 rounded-full hover:scale-110 transition-all duration-200"
            >
              <Eye size={16} className="text-gray-700" />
            </Link>

            {medicine.requiresPrescription && (
              <span className="top-2 left-2 absolute bg-orange-100 px-2 py-0.5 rounded-md font-medium text-orange-700 text-t-12">
                Rx
              </span>
            )}

            <Image
              src={medicine.imageUrl || "/patient/Pain Relief-X.png"}
              alt={medicine.name}
              fill
              className="p-2 object-contain"
            />
          </div>

          <div className="flex flex-col flex-1">
            {/* Title */}
            <h2 className="font-semibold text-gray-800 text-t-14 line-clamp-2">
              {medicine.name}
            </h2>

            {/* Meta */}
            <p className="mt-1 text-gray-500 text-t-12">
              {medicine.dosageForm} · {medicine.packSize} {medicine.packUnit}
            </p>

            <div className="mt-auto">
              {/* Price Range */}
              <div className="mt-3 font-semibold text-green-600 text-t-14">
                {formatPriceRange(medicine.minPrice, medicine.maxPrice)}
              </div>

              {/* Button */}
              <button className="bg-(--color-primary) hover:bg-(--color-primary-dark) mt-3 py-2 rounded-lg w-full text-white text-t-14 transition">
                View Pharmacies
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
