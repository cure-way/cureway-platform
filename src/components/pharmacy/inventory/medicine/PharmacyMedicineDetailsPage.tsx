"use client";

import { useParams } from "next/navigation";
import { useInventoryDetails } from "@/hooks/pharmacy/useInventoryDetails";

import PharmacyMedicineHeader from "@/components/pharmacy/inventory/medicine/PharmacyMedicineHeader";
import PharmacyMedicineInfo from "@/components/pharmacy/inventory/medicine/PharmacyMedicineInfo";
import PharmacyMedicineActions from "@/components/pharmacy/inventory/medicine/PharmacyMedicineActions";
import PharmacyMedicineUsage from "@/components/pharmacy/inventory/medicine/PharmacyMedicineUsage";
import PharmacyMedicineDetailsSkeleton from "@/components/pharmacy/inventory/medicine/PharmacyMedicineDetailsSkeleton";
import ErrorState from "@/components/pharmacy/shared/ErrorState";
import EmptyState from "@/components/pharmacy/shared/EmptyState";

export default function PharmacyMedicineDetailsPage() {
  const params = useParams();
  const id = params.medicineId as string | null;

  const { data, loading, error, refetch } = useInventoryDetails(id);

  if (loading) {
    return <PharmacyMedicineDetailsSkeleton />;
  }
  if (error) {
    return (
      <div className="flex justify-center items-center h-full">
        <ErrorState
          message="Failed to load medicine details."
          onRetry={refetch}
        />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex justify-center items-center h-full">
        <EmptyState message="Medicine not found." />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PharmacyMedicineHeader item={data} />

      <div className="gap-6 grid grid-cols-1 lg:grid-cols-[2fr_1fr]">
        <PharmacyMedicineInfo item={data} />

        <div className="space-y-6">
          <PharmacyMedicineActions item={data} refetch={refetch} />
          <PharmacyMedicineUsage item={data} />
        </div>
      </div>
    </div>
  );
}
