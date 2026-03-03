"use client";

import InfoSection from "@/components/patient/medicine/InfoSection";
import { Medicine } from "@/types/medicine.types";

interface Props {
  medicine: Medicine;
}

export default function MedicineInfoCard({ medicine }: Props) {
  const sections = [
    {
      title: "Generic Name",
      content: medicine.genericName,
    },
    {
      title: "Manufacturer",
      content: medicine.manufacturer,
    },
    {
      title: "Dosage Form",
      content: medicine.dosageForm,
    },
    {
      title: "Pack Size",
      content: medicine.packSize + " " + medicine.packUnit,
    },
    {
      title: "Category",
      content: medicine.categoryName,
    },
  ].filter((section) => Boolean(section.content));

  if (sections.length === 0) return null;

  return (
    <div className="bg-white shadow-sm mb-6 p-6 sm:p-8 border border-gray-200 rounded-2xl">
      {sections.map((section, index) => (
        <InfoSection
          key={section.title}
          title={section.title}
          content={section.content}
          isLast={index === sections.length - 1}
        />
      ))}
    </div>
  );
}
