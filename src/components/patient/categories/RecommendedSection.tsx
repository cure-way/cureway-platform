import Image from "next/image";
import SectionTitle from "../shared/SectionTitle";
import { Medicine } from "@/types/categories.types";
import Link from "next/link";
import { SectionError } from "../shared/SectionError";

interface Props {
  medicines: Medicine[];
  loading?: boolean;
  error?: string | null;
}

export default function RecommendedSection({
  medicines,
  loading,
  error,
}: Props) {
  return (
    <div className="space-y-6">
      <SectionTitle title="Recommended For You" />
      {loading && (
        <div className="flex gap-4 pb-2 overflow-x-auto">
          {Array.from({ length: medicines.length }).map((_, i) => (
            <div
              key={i}
              className="flex flex-col bg-white shadow-sm p-3 border border-gray-100 rounded-2xl w-35 sm:w-40 md:w-45 shrink-0"
            >
              {/* Image placeholder */}
              <div className="bg-gray-200 rounded-xl w-full aspect-square animate-pulse" />

              {/* Text placeholders */}
              <div className="flex flex-col flex-1 space-y-2 mt-4">
                <div className="bg-gray-200 rounded w-full h-4 animate-pulse" />
                <div className="bg-gray-200 rounded w-3/4 h-3 animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      )}
      {!loading && error && <SectionError message={error} />}
      {!loading && !error && (
        <div className="flex gap-4 pb-2 overflow-x-auto">
          {medicines.map((medicine) => (
            <Link
              key={medicine.id}
              href={`/medicines/${medicine.id}`}
              className="group flex flex-col bg-white shadow-sm hover:shadow-md p-3 border border-gray-100 rounded-2xl w-35 sm:w-40 md:w-45 transition-all duration-200 grow shrink-0"
            >
              <div className="relative bg-gray-100 rounded-xl w-full aspect-square overflow-hidden shrink-0">
                <Image
                  src="/patient/Pain Relief-X.png"
                  alt={medicine.name}
                  fill
                  className="object-contain group-hover:scale-105 transition-transform duration-300"
                />
              </div>

              <div className="flex flex-col flex-1 mt-4">
                <p className="min-h-8 font-bold text-gray-800 text-sm line-clamp-2">
                  {medicine.name}
                </p>
                <p className="min-h-8 font-medium text-gray-500 text-xs line-clamp-2">
                  {medicine.categoryName}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
