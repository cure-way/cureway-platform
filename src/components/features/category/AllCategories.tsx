import Image from "next/image";
import { Category } from "./services";

interface AllCategoriesProps {
  categories: Category[];
}

export default function AllCategories({ categories }: AllCategoriesProps) {
  return (
    <div className="mb-12">
      <h2 className="text-t-25 font-bold text-neutral-darker mb-6">
        All Categories
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
        {categories.map((category) => (
          <div
            key={category.id}
            className="flex items-center gap-4 bg-card p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow cursor-pointer"
          >
            <div className="relative w-16 h-16 bg-gradient-to-br from-primary-light to-secondary-light rounded-full flex items-center justify-center flex-shrink-0 overflow-hidden">
              <Image
                src={category.image}
                alt={category.imageAlt || category.name}
                width={40}
                height={40}
                className="object-contain"
                unoptimized
              />
            </div>

            <div className="flex-1">
              <h3 className="font-semibold text-neutral-darker mb-1">
                {category.name}
              </h3>
              {category.description && (
                <p className="text-t-14 text-neutral">{category.description}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
