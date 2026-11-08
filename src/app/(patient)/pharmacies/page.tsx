"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { NEARBY_PHARMACIES } from "@/services/nearbypharmacies.data";
import { formatCurrency } from "@/lib/format";
import { PageContainer, PageHeader } from "@/components/shared";

export default function NearbyPharmaciesPage() {
  const [pharmacies] = useState(NEARBY_PHARMACIES);
  const router = useRouter();

  const handleViewPharmacy = (pharmacyId: string) => {
    router.push(`/pharmacies/${pharmacyId}`);
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <PageContainer>
        <PageHeader
          title="Nearby Pharmacies"
          subtitle="Pharmacies near your location"
          showBack
          onBack={handleBack}
        />

        <div className="space-y-4">
          {pharmacies.map((pharmacy, index) => (
            <div
              key={pharmacy.id}
              className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden border border-gray-200"
              style={{
                animation: `fadeInUp 0.4s ease-out ${index * 0.08}s both`,
              }}
            >
              <div className="flex items-center gap-4 p-5">
                <div className="relative w-24 h-24 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100">
                  {pharmacy.imageUrl ? (
                    <Image
                      src={pharmacy.imageUrl}
                      alt={pharmacy.name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <svg
                        className="w-12 h-11 text-gray-300"
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

                <div className="flex-1 min-w-0">
                  <div className="flex items-start gap-2 mb-2">
                    <div className="w-7 h-7 rounded-md bg-blue-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <svg
                        className="w-4 h-4 text-white"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M10 2a8 8 0 100 16 8 8 0 000-16zM9 5h2v2H9V5zm0 4h2v6H9V9z" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <h2 className="text-t-14 font-semibold text-gray-900 leading-tight">
                        {pharmacy.name}
                      </h2>
                      <p className="text-t-14 text-gray-500 mt-0.5 leading-snug">
                        {pharmacy.address}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 mt-2.5">
                    <div className="flex items-center gap-1.5">
                      <svg
                        className="w-4 h-4 text-yellow-400 fill-current"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      <span className="text-t-14 font-medium text-gray-700">
                        {pharmacy.rating}
                      </span>
                      <span className="text-t-12 text-gray-500">
                        ({pharmacy.reviewCount}+ Rating)
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 text-gray-600">
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                      <span className="text-t-14 text-gray-700">
                        {pharmacy.distance}
                      </span>
                    </div>
                  </div>

                  <div className="mt-3 inline-flex items-center gap-1.5 bg-green-50 text-green-700 px-3 py-1.5 rounded-md text-t-14 font-medium">
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    Delivery fee {formatCurrency(pharmacy.deliveryFee)}
                  </div>
                </div>

                <div className="flex-shrink-0">
                  <button
                    onClick={() => handleViewPharmacy(pharmacy.id)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg font-medium text-t-14 transition-colors shadow-sm"
                  >
                    View Pharmacy
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </PageContainer>

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(15px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
