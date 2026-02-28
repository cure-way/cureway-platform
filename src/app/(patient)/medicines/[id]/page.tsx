"use client";

import { useParams } from "next/navigation";
import { useMemo } from "react";

import MedicineOverviewCard from "@/components/patient/medicine/MedicineOverviewCard";
import MedicineInfoCard from "@/components/patient/medicine/MedicineInfoCard";
import NearbyPharmaciesSection from "@/components/patient/medicine/NearbyPharmaciesSection";
import { useMedicineDetails } from "@/hooks/medicine/useMedicineDetails";
import { usePharmaciesByMedicine } from "@/hooks/medicine/usePharmaciesByMedicine";
import { useSimilarMedicines } from "@/hooks/medicine/useSimilarMedicines";
import SimilarProductsSection from "@/components/patient/medicine/SimilarProductsSection";
import MedicineDetailsSkeleton from "@/components/patient/medicine/MedicineDetailsSkeleton";

export default function MedicineDetailsPage() {
  const params = useParams();
  const medicineId = Number(params.id);

  const { data: medicine, loading, error } = useMedicineDetails(medicineId);

  const { data: pharmacies } = usePharmaciesByMedicine(medicineId);

  const { data: similarMedicines } = useSimilarMedicines(
    medicine?.categoryId,
    medicine?.id,
  );

  const sortedPharmacies = useMemo(() => {
    if (!pharmacies) return [];
    return [...pharmacies].sort((a, b) => a.price - b.price);
  }, [pharmacies]);

  if (loading) return <MedicineDetailsSkeleton />;

  if (!loading && error)
    return (
      <div className="py-10 text-red-600 text-center">
        Failed to load medicine details.
      </div>
    );

  if (!medicine) return null;

  return (
    <div className="bg-gray-50 pb-12 min-h-screen">
      <div className="space-y-8 mx-auto px-4 sm:px-6 py-8 max-w-5xl">
        <MedicineOverviewCard medicine={medicine} />

        <NearbyPharmaciesSection pharmacies={sortedPharmacies} />

        <MedicineInfoCard medicine={medicine} />

        <SimilarProductsSection medicines={similarMedicines} />
      </div>
    </div>
  );
}
