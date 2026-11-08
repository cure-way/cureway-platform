import Image from "next/image";
import { SaleProduct } from "./services";

interface MostSalesProps {
  products: SaleProduct[];
}

const buttonColors = {
  blue: "bg-primary hover:bg-primary-hover",
  green: "bg-success hover:bg-success-hover",
  gray: "bg-neutral-dark hover:bg-neutral-dark-hover",
  orange: "bg-warning hover:bg-warning-hover",
};

export default function MostSales({ products }: MostSalesProps) {
  return (
    <div className="mb-12">
      <div className="flex items-center gap-3 mb-6">
        <h2 className="text-t-25 font-bold text-neutral-darker">Most sales</h2>
        <span className="bg-success-light text-success-dark text-t-14 font-medium px-3 py-1 rounded-full">
          Popular
        </span>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
        {products.map((product) => (
          <div
            key={product.id}
            className="min-w-[200px] bg-gradient-to-br from-primary-light to-secondary-light rounded-2xl p-4 flex-shrink-0"
          >
            <h3 className="font-bold text-neutral-darker mb-1">
              {product.title}
            </h3>
            <p className="text-t-14 text-neutral mb-3">{product.description}</p>

            <div className="relative mb-3 h-32 flex items-center justify-center">
              <Image
                src={product.image}
                alt={product.title}
                fill
                className="object-cover rounded-lg"
                unoptimized
              />
            </div>

            <button
              className={`w-full text-white text-t-14 font-medium py-2 px-4 rounded-lg transition-colors ${
                buttonColors[product.buttonColor]
              }`}
            >
              {product.buttonText}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
