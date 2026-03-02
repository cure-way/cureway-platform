"use client";

import React from "react";
import { useRouter } from "next/navigation";

import { MotionTap } from "@/components/shared/MotionTap";
import { IconBack } from "@/components/patient/history/Icons";
import {
  SavedMedicineCard,
  type SavedMedicine,
} from "@/components/patient/saved-medicine/SavedMedicineCard";
import { EmptySavedMedicine } from "@/components/patient/saved-medicine/EmptySavedMedicine";

export default function SavedMedicinePage() {
  const router = useRouter();

  // UI فقط حالياً (لاحقاً API)
  const [items, setItems] = React.useState<SavedMedicine[]>([
    {
      id: "1",
      name: "Voltaren",
      sub1: "30 Tablets",
      sub2: "400 mg",
      price: "$15.00",
      oldPrice: "$20.00",
      discountLabel: "25% Off",
      imageSrc: "/patient/profile/voltaren.png",
    },
    {
      id: "2",
      name: "Voltaren",
      sub1: "30 Tablets",
      sub2: "400 mg",
      price: "$15.00",
      oldPrice: "$20.00",
      discountLabel: "25% Off",
      imageSrc: "/patient/profile/voltaren.png",
    },
    {
      id: "3",
      name: "Voltaren",
      sub1: "30 Tablets",
      sub2: "400 mg",
      price: "$15.00",
      oldPrice: "$20.00",
      discountLabel: "25% Off",
      imageSrc: "/patient/profile/voltaren.png",
    },
    {
      id: "4",
      name: "Voltaren",
      sub1: "30 Tablets",
      sub2: "400 mg",
      price: "$15.00",
      oldPrice: "$20.00",
      discountLabel: "25% Off",
      imageSrc: "/patient/profile/voltaren.png",
    },
    {
      id: "5",
      name: "Voltaren",
      sub1: "30 Tablets",
      sub2: "400 mg",
      price: "$15.00",
      oldPrice: "$20.00",
      discountLabel: "25% Off",
      imageSrc: "/patient/profile/voltaren.png",
    },
    {
      id: "6",
      name: "Voltaren",
      sub1: "30 Tablets",
      sub2: "400 mg",
      price: "$15.00",
      oldPrice: "$20.00",
      discountLabel: "25% Off",
      imageSrc: "/patient/profile/voltaren.png",
    },
  ]);

  const hasItems = items.length > 0;

  return (
    <div className="w-full px-4 py-6">
      <div className="mx-auto w-full max-w-[1100px]">
        {/* Header */}
        <div className="mb-4 flex items-center justify-between">
          <div className="text-[48px] font-bold leading-[120%] text-black">
            Saved Medicine
          </div>

          <MotionTap
            as="button"
            onClick={() => router.push("/profile")}
            className="inline-flex items-center gap-2"
          >
            <IconBack />
            <span className="text-[24px] font-bold leading-[120%] text-black">
              Back
            </span>
          </MotionTap>
        </div>

        <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="text-[20px] font-medium leading-[120%] text-[#263B81]">
            Your Frequently used medicines
          </div>

          <div className="w-full max-w-[418px]">
            <input
              placeholder="Search"
              className="h-[64px] w-full rounded-[16px] border border-[#CAC6C4] bg-white px-4 text-[16px] outline-none"
            />
          </div>
        </div>

        {/* Body */}
        {!hasItems ? (
          <EmptySavedMedicine onBrowse={() => router.push("/medicines")} />
        ) : (
          <div className="rounded-[24px] border border-[#CAC6C4] p-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {items.slice(0, 6).map((m) => (
                <SavedMedicineCard
                  key={m.id}
                  item={m}
                  onOpen={(id) => console.log("open", id)}
                  onAddToCart={(id) => console.log("add to cart", id)}
                  onRemove={(id) =>
                    setItems((prev) => prev.filter((x) => x.id !== id))
                  }
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}