import SectionTitle from "../shared/SectionTitle";
import { Category } from "@/types/categories.types";
import Link from "next/link";
import { FaPills } from "react-icons/fa6";
import { SectionError } from "../shared/SectionError";

interface Props {
  categories: Category[];
  loading?: boolean;
  error?: string | null;
}

export default function CategoryGrid({ categories, loading, error }: Props) {
  return (
    <div className="space-y-6">
      <SectionTitle title="All Categories" />
      {loading && (
        <div className="gap-4 grid sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: categories.length }).map((_, i) => (
            <div
              key={i}
              className="flex items-center gap-4 bg-white shadow-sm p-4 border border-gray-100 rounded-xl"
            >
              {/* Icon placeholder */}
              <div className="bg-gray-200 rounded-lg w-12 h-12 animate-pulse" />

              {/* Text placeholders */}
              <div className="flex-1 space-y-2">
                <div className="bg-gray-200 rounded w-3/4 h-3 animate-pulse" />
                <div className="bg-gray-200 rounded w-full h-3 animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      )}
      {!loading && error && <SectionError message={error} />}
      {!loading && !error && (
        <div className="gap-4 grid sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/categories/${category.id}`}
              className="flex items-center gap-4 bg-white shadow-sm hover:shadow-md p-4 border border-gray-100 rounded-xl transition cursor-pointer"
            >
              <div className="relative flex justify-center items-center bg-gray-100 rounded-lg w-12 h-12 overflow-hidden">
                <FaPills className="text-2xl text-(--color-primary)" />
              </div>

              <div>
                <h4 className="font-semibold text-gray-800 text-sm">
                  {category.name}
                </h4>

                <p className="text-gray-500 text-xs">
                  {category.description ?? "Explore medicines in this category"}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
