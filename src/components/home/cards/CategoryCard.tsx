import Image from "next/image";
import Link from "next/link";
import { Category } from "@/types/categories.types";

interface CategoryCardProps {
  category: Category;
}

export function CategoryCard({ category }: CategoryCardProps) {
  return (
    <Link
      href={`/categories/${category.id}`}
      className="group flex flex-col gap-4 border border-neutral hover:border-primary-light-active rounded-2xl overflow-hidden transition-colors"
    >
      {/* Image area with gradient */}
      <div className="relative flex justify-center items-center bg-linear-to-b from-[#f7f8ff] to-[#dfe5ff] p-3 rounded-2xl w-full h-36 md:h-42.75">
        <Image
          src={category.displayImage ?? "/patient/default.png"}
          alt={category.name}
          width={160}
          height={160}
          className="w-auto h-full object-contain group-hover:scale-105 transition-transform"
        />
      </div>
      {/* Text */}
      <div className="flex flex-col items-center gap-2 px-2 pb-4 text-center">
        <p className="font-bold text-primary-hover text-t-17 md:text-[20px] leading-[1.2]">
          {category.name}
        </p>
        <p className="text-black/60 text-t-14 md:text-[18px] leading-[1.2]">
          {category.description}
        </p>
      </div>
    </Link>
  );
}
