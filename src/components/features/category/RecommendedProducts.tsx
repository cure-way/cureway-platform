import Image from "next/image";
import { Product } from "./services";
import { formatCurrency } from "@/lib/format";

interface RecommendedProductsProps {
  products: Product[];
}

const badgeStyles = {
  new: "bg-primary text-white",
  sale: "bg-success text-white",
  popular: "bg-warning text-white",
};

export default function RecommendedProducts({
  products,
}: RecommendedProductsProps) {
  return (
    <div className="mb-12">
      <h2 className="text-t-25 font-bold text-neutral-darker mb-6">
        Recommended For You
      </h2>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {products.map((product) => (
          <div
            key={product.id}
            className="bg-neutral-light rounded-xl p-4 hover:shadow-md transition-shadow cursor-pointer relative"
          >
            {product.badge && (
              <div className="absolute top-2 left-2 z-10">
                <span
                  className={`text-t-12 font-medium px-2 py-1 rounded ${
                    badgeStyles[product.badge]
                  }`}
                >
                  {product.badge.toUpperCase()}
                </span>
              </div>
            )}

            <div className="relative bg-card rounded-lg mb-3 h-32 flex items-center justify-center p-2">
              <Image
                src={product.image}
                alt={product.name}
                fill
                className="object-contain p-2"
                unoptimized
              />
            </div>

            <h3 className="font-medium text-neutral-darker text-t-14 mb-1 line-clamp-2">
              {product.name}
            </h3>
            {product.price && (
              <p className="text-neutral-dark text-t-14 font-semibold">
                {formatCurrency(product.price)}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
