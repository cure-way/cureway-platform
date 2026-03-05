"use client";

import Image from "next/image";
import React from "react";
import { MotionTap } from "@/components/shared/MotionTap";
import { IconSave } from "@/components/patient/settings/Icons"; // ✅ نفس أيقونة Saved items

export type SavedMedicine = {
  id: string;
  name: string;
  sub1: string;
  sub2: string;
  price: string;
  oldPrice?: string;
  discountLabel?: string;
  imageSrc?: string;
};

export function SavedMedicineCard({
  item,
  onAddToCart,
  onRemove,
  onOpen,
}: {
  item: SavedMedicine;
  onAddToCart?: (id: string) => void;
  onRemove?: (id: string) => void;
  onOpen?: (id: string) => void;
}) {
  return (
    <MotionTap className="rounded-[24px] border border-[#EBEDF7] bg-white p-6 shadow-card">
      <div className="flex flex-col gap-4">
        {/* Image box */}
        <div className="relative rounded-[20px] bg-[linear-gradient(180deg,#F7F8FF_0%,#DFE5FF_100%)] p-3 shadow-[0px_2px_2px_0px_#00000026]">
          
          {/* ✅ Save icon بدل heart */}
          <div className="absolute right-3 top-3">
            <MotionTap
              as="button"
              className="grid h-8 w-8 place-items-center rounded-full bg-[#EBEDF7] active:bg-[#C0C8E5]"
              onClick={() => console.log("toggle saved", item.id)}
            >
              <IconSave />
            </MotionTap>
          </div>

          {/* Discount تحت يمين */}
          {item.discountLabel ? (
            <div className="absolute bottom-3 right-3 rounded-[8px] bg-[#279543] px-2 py-1">
              <span className="text-[12px] font-semibold text-[#EBF9EE]">
                {item.discountLabel}
              </span>
            </div>
          ) : null}

          {/* صورة الدواء */}
          <div className="mx-auto grid h-[182px] w-[182px] place-items-center overflow-hidden rounded-[16px] bg-white/60">
            <Image
              src={item.imageSrc ?? "/images/medicines/placeholder.png"}
              alt={item.name}
              width={182}
              height={182}
              className="h-full w-full object-contain"
            />
          </div>
        </div>

        {/* Content */}
        <div className="flex items-start justify-between gap-3 px-2">
          <div className="min-w-0">
            <div className="truncate text-[18px] font-bold text-[#17234D]">
              {item.name}
            </div>
            <div className="mt-1 text-[16px] text-[#00000099]">
              {item.sub1}
              <br />
              {item.sub2}
            </div>
          </div>

          {/* ✅ external.png من public */}
          <MotionTap
            as="button"
            onClick={() => onOpen?.(item.id)}
            className="shrink-0"
          >
            <Image
              src="/patient/profile/external.png"
              alt="Open"
              width={24}
              height={24}
            />
          </MotionTap>
        </div>

        {/* Price row */}
        <div className="flex items-center gap-4 px-2">
          <span className="text-[20px] font-bold text-[#279543]">
            {item.price}
          </span>

          {item.oldPrice ? (
            <span className="text-[14px] text-[#00000066]">
              {item.oldPrice}
            </span>
          ) : null}
        </div>

        {/* Buttons */}
        <div className="flex items-center gap-4">
          <MotionTap
            as="button"
            onClick={() => onAddToCart?.(item.id)}
            className="flex h-[40px] flex-1 items-center justify-center rounded-[12px] bg-[#334EAC]"
          >
            <span className="whitespace-nowrap text-[18px] font-bold leading-none text-[#EBEDF7]">
              Add to cart
            </span>
          </MotionTap>

          <MotionTap
            as="button"
            onClick={() => onRemove?.(item.id)}
            className="flex h-[40px] flex-1 items-center justify-center rounded-[12px] border border-[#334EAC] bg-white"
          >
            <span className="whitespace-nowrap text-[18px] font-bold leading-none text-[#334EAC]">
              Remove
            </span>
          </MotionTap>
        </div>
      </div>
    </MotionTap>
  );
}