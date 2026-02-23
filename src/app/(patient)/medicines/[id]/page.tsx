import { notFound } from "next/navigation";
import { medicines } from "@/services/categories.mock";
import SimilarProductsSection from "@/components/patient/medicine/SimilarProductsSection";
import NearbyPharmaciesSection from "@/components/patient/medicine/NearbyPharmaciesSection";
import MedicineOverviewCard from "@/components/patient/medicine/MedicineOverviewCard";
import MedicineInfoCard from "@/components/patient/medicine/MedicineInfoCard";

export default async function MedicineDetailsPage({
  params,
}: {
  params: { id: string };
}) {
  const { id: medicineId } = await params;

  const medicine = medicines.find((m) => m.id === medicineId);

  if (!medicine) {
    return notFound();
  }

  const similarMedicines = medicines
    .filter((m) => m.categoryId === medicine.categoryId && m.id !== medicine.id)
    .slice(0, 4);

  const infoSections = [
    { title: "Description", content: medicine.longDescription },
    { title: "Ingredients", content: medicine.ingredients },
    { title: "Directions", content: medicine.directions },
    { title: "Warnings", content: medicine.warnings },
    { title: "Storage", content: medicine.storage },
  ].filter((section): section is { title: string; content: string } =>
    Boolean(section.content),
  );

  return (
    <div className="bg-gray-50 pb-12 min-h-screen">
      <div className="mx-auto px-4 sm:px-6 py-8 max-w-5xl">
        <MedicineOverviewCard medicine={medicine} />

        <NearbyPharmaciesSection />
        <MedicineInfoCard sections={infoSections} />

        {similarMedicines.length > 0 && (
          <SimilarProductsSection medicines={similarMedicines} />
        )}
      </div>
    </div>
  );
}
