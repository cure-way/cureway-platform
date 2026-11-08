import { PharmacyStock } from "@/types/medicine.types";
import { useRouter } from "next/navigation";
import { formatCurrency } from "@/lib/format";

interface PharmacyCardProps {
  pharmacy: PharmacyStock;
}

export function PharmacyCard({ pharmacy }: PharmacyCardProps) {
  const router = useRouter();

  const handleClick = () => {
    router.push(`/pharmacies/${pharmacy.pharmacyId}`);
  };

  const formatDistance = (distance: number) =>
    `${(distance ?? 0).toFixed(1)} km`;

  const availabilityColor =
    pharmacy.availability === "in_stock"
      ? "bg-green-500"
      : pharmacy.availability === "low_stock"
        ? "bg-yellow-500"
        : "bg-red-500";

  return (
    <div
      onClick={handleClick}
      className="bg-gray-50 hover:shadow-md p-4 border border-gray-200 rounded-xl w-72 transition cursor-pointer shrink-0"
    >
      <div className="flex items-start gap-3 mb-3">
        <div className={`mt-1.5 h-2 w-2 rounded-full ${availabilityColor}`} />

        <div className="flex-1 min-w-0">
          <h2 className="mb-1 font-semibold text-gray-900 text-t-14 truncate">
            {pharmacy.pharmacyName}
          </h2>

          <p className="text-gray-600 text-t-12">{pharmacy.cityName}</p>

          <p className="text-gray-500 text-t-12">
            {formatDistance(pharmacy.distanceKm)}
          </p>
        </div>
      </div>

      <div className="mb-3 font-semibold text-gray-900 text-t-14">
        {formatCurrency(pharmacy.price ?? 0)}
      </div>

      <div className="flex justify-between items-center text-t-12">
        <span className="text-gray-600">
          {pharmacy.deliveryFee
            ? `Delivery ${formatCurrency(pharmacy.deliveryFee)}`
            : "No delivery fee"}
        </span>

        <span
          className={`font-medium ${
            pharmacy.isOpenNow ? "text-green-600" : "text-gray-400"
          }`}
        >
          {pharmacy.isOpenNow ? "Open" : "Closed"}
        </span>
      </div>
    </div>
  );
}
