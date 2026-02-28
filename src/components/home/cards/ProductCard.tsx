import Image from "next/image";
import { IoHeartOutline } from "react-icons/io5";
import type { Medicine } from "@/types/medicine.types";
import Link from "next/link";

interface ProductCardProps {
  product: Medicine;
}

export function ProductCard({ product }: ProductCardProps) {
  const hasRange = product.minPrice !== product.maxPrice;

  return (
    <Link
      href={`/medicines/${product.id}`}
      className="relative flex flex-col bg-white hover:shadow-md border border-primary-light-active rounded-[20px] w-full min-w-40 h-70 md:h-80 overflow-hidden transition-shadow"
    >
      {/* Image area */}
      <div className="relative flex justify-center items-center bg-linear-to-b from-[#f7f8ff] to-[#dfe5ff] mx-2 mt-2 rounded-[20px] h-32 md:h-37.25">
        <Image
          src={product.imageUrl || "/placeholder-medicine.png"}
          alt={product.name}
          width={122}
          height={122}
          className="w-auto h-full object-contain"
        />

        {/* Favourite */}
        <button
          className="top-1 right-1 absolute hover:bg-white/60 p-1 rounded-full transition-colors"
          aria-label="Add to favourites"
        >
          <IoHeartOutline className="w-5 h-5 text-black/40" />
        </button>
      </div>

      {/* Details */}
      <div className="flex flex-col flex-1 gap-2 px-3 md:px-4 pt-3 pb-1 min-h-0">
        <div className="flex-1 min-w-0">
          <p className="font-bold text-primary-darker text-t-14 md:text-[18px] truncate leading-[1.2]">
            {product.name}
          </p>

          <p className="text-black/60 text-t-12 md:text-[16px] truncate">
            {product.categoryName}
          </p>

          <p className="text-black/50 text-t-12 md:text-[16px] truncate">
            {product.dosageForm}
          </p>
        </div>

        {/* Price */}
        <div className="flex items-center gap-2">
          <span className="font-bold text-success-dark text-t-17 md:text-[20px] leading-[1.2]">
            ${product.minPrice.toFixed(2)}
          </span>

          {hasRange && (
            <span className="text-black/40 text-t-12 md:text-t-14 line-through leading-[1.2]">
              ${product.maxPrice.toFixed(2)}
            </span>
          )}
        </div>
      </div>

      {/* Add to cart */}
      <button
        className="bg-primary-light hover:bg-primary-light-hover py-2.5 rounded-xl w-full font-normal text-primary text-t-14 md:text-t-17 lg:text-[24px] transition-colors"
        type="button"
      >
        Add to cart
      </button>
    </Link>
  );
}
