import Image from "next/image";
import SectionTitle from "../shared/SectionTitle";
import { Category } from "@/types/categories.types";
import Link from "next/link";
import { SectionError } from "../shared/SectionError";

interface Props {
  categories: Category[];
  loading?: boolean;
  error?: string | null;
}

export default function MostSalesSection({
  categories,
  loading,
  error,
}: Props) {
  return (
    <div className="space-y-6">
      <SectionTitle title="Most sales" badge="Popular" />
      {loading && (
        <div className="flex gap-4 pb-2 overflow-x-auto animate-pulse snap-mandatory snap-x">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="flex flex-col bg-white p-4 border border-gray-100 rounded-2xl w-45 sm:w-50 md:w-55 snap-start shrink-0"
            >
              {/* Image Skeleton */}
              <div className="bg-gray-300 rounded-xl w-full aspect-4/3" />

              {/* Content Skeleton */}
              <div className="flex flex-col flex-1 gap-2 mt-4">
                <div className="bg-gray-300 rounded w-3/4 h-4" />
                <div className="bg-gray-200 rounded w-full h-3" />
              </div>
            </div>
          ))}
        </div>
      )}
      {!loading && error && <SectionError message={error} />}
      {!loading && !error && (
        <div className="flex gap-4 pb-2 overflow-x-auto snap-mandatory snap-x">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/categories/${category.id}`}
              className="group flex flex-col bg-white shadow-sm hover:shadow-md p-4 border border-gray-100 rounded-2xl w-45 sm:w--50 md:w-55 transition-all hover:-translate-y-1 duration-200 ease-out snap-start grow shrink-0"
            >
              {/* Image */}
              <div className="relative bg-gray-100 rounded-xl w-full aspect-4/3 overflow-hidden shrink-0">
                <Image
                  src={category.displayImage ?? "/patient/default.png"}
                  alt={category.name}
                  fill
                  className="object-contain group-hover:scale-105 transition-transform duration-300 ease-out"
                />
              </div>

              {/* Content */}
              <div className="flex flex-col flex-1 mt-4">
                <h3 className="min-h-10 font-semibold text-gray-800 group-hover:text-(--color-primary) text-sm line-clamp-2 transition-colors duration-200">
                  {category.name}
                </h3>

                <p className="mt-1 min-h-8 text-gray-500 text-xs line-clamp-2">
                  {category.description ?? category.name}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
