"use client";

import type { Pharmacy } from "@/types/cart";
import PrescriptionUpload from "./PrescriptionUpload";
import Image from "next/image";

interface PharmacyInfoProps {
  pharmacy: Pharmacy;
  requiresPrescription: boolean;
  prescriptionUploaded?: boolean;
  onUploadPrescription?: () => void;
  highlightPrescription?: boolean;
}

export default function PharmacyInfo({
  pharmacy,
  requiresPrescription,
  prescriptionUploaded,
  onUploadPrescription,
  highlightPrescription = false,
}: PharmacyInfoProps) {
  return (
    <div className="bg-neutral-light-hover border border-neutral-light-active rounded-2xl p-3 mb-3 font-[var(--font-montserrat)]">
      {/* Pharmacy header */}
      <div
        className={`flex items-center gap-6 px-4 ${
          requiresPrescription && !prescriptionUploaded ? "mb-3" : ""
        }`}
      >
        <Image
          src="/icons/hospital.png"
          alt="Hospital"
          width={32}
          height={32}
        />

        <div className="flex-1 min-w-0">
          <p className="text-t-21-semibold text-foreground m-0">
            {pharmacy.name}
          </p>
          <p className="text-t-17 text-foreground/50 m-0 mt-2">
            Deliver · {pharmacy.deliveryTime ?? "—"} |{" "}
            {pharmacy.distance ?? "—"}
          </p>
        </div>
        {pharmacy.isAvailable && (
          <div className="flex items-center gap-2 bg-success-light-active px-3 h-10 rounded-xl flex-shrink-0">
            <span className="text-t-14-semibold text-success-darker">
              Available
            </span>
            <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
              <path
                d="M16.6667 5L7.50004 14.1667L3.33337 10"
                stroke="hsl(var(--success-darker))"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        )}
      </div>

      {requiresPrescription && !prescriptionUploaded && (
        <PrescriptionUpload
          onUpload={onUploadPrescription}
          highlighted={highlightPrescription}
        />
      )}
    </div>
  );
}
