import Image from "next/image";
import Link from "next/link";
import { IoStar } from "react-icons/io5";
import { TbTruckDelivery } from "react-icons/tb";
import type { PharmacyItem } from "@/lib/mock/home";
import { formatCurrency } from "@/lib/format";

interface PharmacyCardProps {
  pharmacy: PharmacyItem;
}

export function PharmacyCard({ pharmacy }: PharmacyCardProps) {
  return (
    <Link
      href={`/pharmacies/${pharmacy.id}`}
      className="group flex flex-col bg-white border border-primary-light rounded-t-3xl rounded-b-2xl overflow-hidden hover:shadow-md transition-shadow"
    >
      {/* Image */}
      <div className="relative h-48 md:h-64 lg:h-[330px] w-full rounded-2xl overflow-hidden">
        <Image
          src={pharmacy.image}
          alt={pharmacy.name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover group-hover:scale-105 transition-transform"
        />
        <div className="absolute inset-0 shadow-[inset_0px_4px_4px_rgba(0,0,0,0.25)] rounded-2xl" />
      </div>

      {/* Info */}
      <div className="flex flex-col gap-3 md:gap-4 px-4 py-3">
        {/* Name row */}
        <div className="flex items-center gap-3 md:gap-4">
          <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg bg-primary-light flex items-center justify-center shrink-0">
            <span className="text-t-14 font-bold text-primary">Rx</span>
          </div>
          <p className="text-t-17 md:text-t-21 lg:text-t-25 font-bold text-primary-hover leading-[1.2]">
            {pharmacy.name}
          </p>
        </div>
        {/* Meta */}
        <p className="text-t-14 md:text-t-17 lg:text-t-17 text-black/50 leading-[1.2]">
          Deliver · {pharmacy.deliveryTime} | {pharmacy.distance}
        </p>
        {/* Rating + delivery */}
        <div className="flex items-center gap-3 flex-wrap">
          <IoStar className="w-5 h-5 text-yellow-400" />
          <span className="text-t-12 md:text-t-14">
            <span className="font-semibold text-black/60">
              {pharmacy.rating}
            </span>
            <span className="text-black/60">
              ({pharmacy.ratingCount} Rating)
            </span>
          </span>
          <span className="ml-auto bg-success-light text-success-dark rounded-full px-3 md:px-4 py-1 md:h-10 flex items-center gap-1 text-t-12 md:text-t-14 font-semibold">
            <TbTruckDelivery className="w-4 h-4" />
            Delivery fees {formatCurrency(pharmacy.deliveryFee)}
          </span>
        </div>
      </div>
    </Link>
  );
}
