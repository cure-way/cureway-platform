import { PharmacyStock } from "@/types/medicine.types";
import { useRouter } from "next/navigation";
import { PharmacyCard } from "./PharmacyCard";

interface Props {
  pharmacies: PharmacyStock[];
}

export default function NearbyPharmaciesSection({ pharmacies }: Props) {
  const router = useRouter();

  const handleSeeAll = () => {
    router.push("/pharmacies");
  };

  if (pharmacies.length === 0) return null;
  return (
    <div className="bg-white shadow-sm mb-6 p-6 sm:p-8 border border-gray-200 rounded-2xl">
      <div className="flex justify-between items-center mb-6">
        <h2 className="font-bold text-gray-900 text-xl">Nearby Pharmacies</h2>

        <button
          onClick={handleSeeAll}
          className="font-medium text-blue-600 hover:text-blue-700 text-sm"
        >
          See all →
        </button>
      </div>

      <div className="-mx-2 px-2 overflow-x-auto">
        <div className="flex gap-4 pb-2">
          {pharmacies.map((pharmacy) => (
            <PharmacyCard key={pharmacy.pharmacyId} pharmacy={pharmacy} />
          ))}
        </div>
      </div>
    </div>
  );
}
