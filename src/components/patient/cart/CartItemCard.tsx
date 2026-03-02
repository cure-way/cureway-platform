"use client";

import Image from "next/image";
import type { CartItem } from "@/types/cart";
import QuantityControl from "./QuantityControl";
import PharmacyInfo from "./PharmacyInfo";

interface Props {
  item: CartItem;
  onQuantityChange: (id: string, delta: number) => void;
  onRemove: (id: string) => void;
  onUploadPrescription?: (id: string) => void;
  highlightPrescription?: boolean;
}

export default function CartItemCard({
  item,
  onQuantityChange,
  onRemove,
  onUploadPrescription,
  highlightPrescription = false,
}: Props) {
  const prescriptionInfo = item.prescriptionInfo as any;

  return (
    <div className="pb-6 border-b border-border mb-6 font-[var(--font-montserrat)]">
      <div className="flex items-center gap-2 sm:gap-4 pb-4 flex-wrap sm:flex-nowrap">
        <div className="flex-1 flex items-center gap-3 sm:gap-4 min-w-0">
          <div className="w-14 h-14 sm:w-20 sm:h-20 bg-accent rounded-xl flex items-center justify-center flex-shrink-0 overflow-hidden">
            {item.image ? (
              <Image
                src={item.image}
                alt={item.name}
                width={72}
                height={72}
                className="object-contain"
                unoptimized 
              />
            ) : (
              <span className="text-3xl">💊</span>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <p className="text-t-21-semibold text-foreground mb-1 truncate">
              {item.name}
            </p>

    
            {prescriptionInfo?.genericName && (
              <p className="text-t-14 text-muted-foreground mb-2">
                {prescriptionInfo.genericName}
              </p>
            )}

            <div className="flex flex-wrap gap-2">
              {item.requiresPrescription && (
                <span className="text-t-12 border border-border rounded-lg px-2.5 py-1.5">
                  Prescription
                </span>
              )}

              {prescriptionInfo?.dosage && (
                <span className="text-t-12 border border-border rounded-lg px-2.5 py-1.5">
                  {prescriptionInfo.dosage}
                </span>
              )}

              {prescriptionInfo?.form && (
                <span className="text-t-12 border border-border rounded-lg px-2.5 py-1.5">
                  {prescriptionInfo.form}
                </span>
              )}
            </div>
          </div>
        </div>

        <QuantityControl
          quantity={item.quantity}
          onIncrease={() => onQuantityChange(item.id, 1)}
          onDecrease={() => onQuantityChange(item.id, -1)}
        />

        <div className="hidden md:block w-36 text-center flex-shrink-0">
          <span className="text-t-21-bold text-foreground">
            ${item.price.toFixed(2)}
          </span>
        </div>

        <div className="hidden md:block w-36 text-center flex-shrink-0">
          <span className="text-t-21-bold text-foreground">
            ${(item.price * item.quantity).toFixed(2)}
          </span>
        </div>
      </div>

      <PharmacyInfo
        pharmacy={item.pharmacy}
        requiresPrescription={item.requiresPrescription}
        prescriptionUploaded={item.prescriptionUploaded}
        onUploadPrescription={
          onUploadPrescription
            ? () => onUploadPrescription(item.id)
            : undefined
        }
        highlightPrescription={highlightPrescription}
      />

      <div className="w-full h-11 rounded-xl border border-border bg-card flex items-center gap-3 px-4 mt-2">
        <button
          onClick={() => onRemove(item.id)}
          className="flex items-center gap-2 text-t-14 text-muted-foreground hover:text-primary transition-colors bg-transparent border-none cursor-pointer p-0 font-[var(--font-montserrat)]"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M2 4h12M5.333 4V2.667a1.333 1.333 0 0 1 1.334-1.334h2.666a1.333 1.333 0 0 1 1.334 1.334V4m2 0v9.333a1.333 1.333 0 0 1-1.334 1.334H4.667a1.333 1.333 0 0 1-1.334-1.334V4h9.334Z" />
          </svg>
          Remove
        </button>
      </div>
    </div>
  );
}