"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { NEARBY_PHARMACIES } from "@/services/nearbypharmacies.data";
import { InventoryItem, Pharmacy } from "@/types/pharmacyTypes";

type TabType = "All" | "Most sells" | "Offers" | "Rare";

export default function PharmacyDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const pharmacyId = params?.id as string;

  const [activeTab, setActiveTab] = useState<TabType>("All");
  const [medicines] = useState<InventoryItem[]>([]);

  const pharmacy = NEARBY_PHARMACIES.find((p) => p.id === pharmacyId);

  if (!pharmacy) {
    return (
      <div className="flex justify-center items-center bg-gray-50 min-h-screen">
        <div className="text-center">
          <h2 className="mb-2 font-bold text-gray-900 text-2xl">
            Pharmacy not found
          </h2>
          <button
            onClick={() => router.back()}
            className="font-medium text-blue-600 hover:text-blue-700"
          >
            Go back
          </button>
        </div>
      </div>
    );
  }

  const filteredMedicines = medicines.filter((medicine) => {
    if (activeTab === "All") return true;
    if (activeTab === "Most sells") return medicine.stock < 15;
    if (activeTab === "Offers") return medicine.stock > 20;
    if (activeTab === "Rare") return medicine.prescriptionRequired;
    return true;
  });

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="top-0 z-10 sticky bg-white border-gray-200 border-b">
        <div className="flex justify-between items-center mx-auto px-6 py-6 max-w-6xl">
          <div>
            <h1 className="font-bold text-gray-900 text-2xl">
              {pharmacy.name}
            </h1>
          </div>
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-700 hover:text-gray-900 transition-colors"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            <span className="font-medium">Back</span>
          </button>
        </div>
      </div>

      <div className="mx-auto px-6 py-8 max-w-6xl">
        <div className="bg-white shadow-sm mb-8 p-8 border border-gray-200 rounded-2xl">
          <div className="flex items-start gap-2 mb-6">
            <div className="bg-blue-600 mt-2 rounded-full w-2 h-2"></div>
            <h2 className="font-semibold text-blue-600 text-xl">
              Pharmacy Information
            </h2>
          </div>

          <div className="gap-8 grid grid-cols-1 lg:grid-cols-2">
            <div className="space-y-4">
              <div className="relative bg-gray-100 rounded-xl w-full aspect-[4/3] overflow-hidden">
                {pharmacy.imageUrl ? (
                  <Image
                    src={pharmacy.imageUrl}
                    alt={pharmacy.name}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="flex justify-center items-center w-full h-full">
                    <svg
                      className="w-24 h-24 text-gray-300"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                      />
                    </svg>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-2 text-gray-700">
                  <svg
                    className="w-5 h-5 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span className="font-medium">Delivery: 30 minutes</span>
                </div>
                <div className="text-gray-500">|</div>
                <div className="text-gray-600">{pharmacy.distance}</div>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="mb-2 font-semibold text-blue-600 text-sm">
                  Address
                </h3>
                <p className="text-gray-700 text-sm leading-relaxed">
                  {pharmacy.address}
                </p>
              </div>

              <div>
                <h3 className="mb-2 font-semibold text-blue-600 text-sm">
                  Nearest landmark
                </h3>
                <p className="text-gray-700 text-sm">
                  Avenue Habib Bourguiba, 0.14 mi / 220m
                </p>
              </div>

              <div>
                <h3 className="mb-2 font-semibold text-blue-600 text-sm">
                  Working hours
                </h3>
                <p className="text-gray-700 text-sm">
                  {pharmacy.openingHours ||
                    "Open Now - 24/7 | Friday 14:00 - 23:00"}
                </p>
              </div>

              <div>
                <h3 className="mb-2 font-semibold text-blue-600 text-sm">
                  Phone number
                </h3>
                <p className="text-gray-700 text-sm">99922991</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white shadow-sm p-8 border border-gray-200 rounded-2xl">
          <div className="flex items-start gap-2 mb-6">
            <div className="bg-blue-600 mt-2 rounded-full w-2 h-2"></div>
            <h2 className="font-semibold text-gray-900 text-xl">Available</h2>
          </div>

          <div className="flex items-center gap-3 mb-8 pb-2 overflow-x-auto">
            {(["All", "Most sells", "Offers", "Rare"] as TabType[]).map(
              (tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-6 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                    activeTab === tab
                      ? "bg-blue-600 text-white shadow-sm"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {tab}
                </button>
              ),
            )}
          </div>

          <div className="gap-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {filteredMedicines.map((medicine) => (
              <MedicineCard key={medicine.id} medicine={medicine} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

interface MedicineCardProps {
  medicine: InventoryItem;
}

function MedicineCard({ medicine }: MedicineCardProps) {
  const hasDiscount = medicine.stock > 20;

  return (
    <div className="group relative bg-gray-50 hover:shadow-md p-4 rounded-xl transition-shadow duration-200 cursor-pointer">
      {hasDiscount && (
        <div className="top-2 left-2 z-10 absolute bg-green-500 px-2 py-1 rounded-md font-bold text-white text-xs">
          -25%
        </div>
      )}

      <button className="top-2 right-2 z-10 absolute flex justify-center items-center bg-white hover:bg-blue-50 shadow-sm rounded-full w-6 h-6 transition-colors">
        <svg
          className="w-4 h-4 text-blue-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </button>

      <div className="relative flex justify-center items-center bg-white mb-3 rounded-lg w-full aspect-square">
        {medicine.imageUrl ? (
          <Image
            src={medicine.imageUrl}
            alt={medicine.medicineName}
            fill
            className="p-2 object-contain"
          />
        ) : (
          <div className="flex justify-center items-center bg-gray-200 rounded-lg w-16 h-16">
            <svg
              className="w-8 h-8 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
              />
            </svg>
          </div>
        )}
      </div>

      <h3 className="mb-1 min-h-[2.5rem] font-medium text-gray-900 text-sm line-clamp-2">
        {medicine.medicineName}
      </h3>
    </div>
  );
}
