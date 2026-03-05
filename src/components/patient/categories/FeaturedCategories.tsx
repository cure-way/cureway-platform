import { Category } from "@/types/categories.types";
import Image from "next/image";
import Link from "next/link";
import SectionTitle from "../shared/SectionTitle";
import { SectionError } from "../shared/SectionError";

interface Props {
  categories: Category[];
  loading?: boolean;
  error?: string | null;
}

export default function FeaturedCategories({
  categories,
  loading,
  error,
}: Props) {
  return (
    <section className="space-y-6">
      <SectionTitle
        title="Featured Categories"
        subtitle="Handpicked categories for you"
        badge="New"
      />

      {loading && (
        <div className="flex gap-6 pb-2 overflow-x-auto">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="flex flex-col items-center gap-2 min-w-22.5"
            >
              {/* Circular Image Skeleton */}
              <div className="bg-gray-300 rounded-full w-20 h-20" />

              {/* Label Skeleton */}
              <div className="bg-gray-300 rounded w-16 h-3" />
            </div>
          ))}
        </div>
      )}
      {!loading && error && <SectionError message={error} />}
      {!loading && !error && (
        <div className="flex gap-6 pb-2 overflow-x-auto">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/categories/${category.id}`}
              className="group flex flex-col items-center gap-2 min-w-22.5"
            >
              <div className="relative bg-gray-100 group-hover:bg-gray-200 rounded-full w-20 h-20 overflow-hidden group-hover:scale-105 transition-all duration-200 ease-out">
                <Image
                  src={category.displayImage ?? "/patient/default.png"}
                  alt={category.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300 ease-out"
                />
              </div>
              <span className="font-medium text-gray-700 group-hover:text-(--color-primary) text-xs text-center transition-colors duration-200">
                {category.name}
              </span>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}
