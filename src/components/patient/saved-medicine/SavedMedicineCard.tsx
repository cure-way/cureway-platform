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
    <MotionTap className="rounded-xl bg-white p-4 shadow-card md:p-6">
      <div className="flex flex-col gap-3">
        {/* Image box */}
        <div className="relative rounded-lg bg-[linear-gradient(180deg,#F7F8FF_0%,#DFE5FF_100%)] p-3">
          {/* ✅ Save icon بدل heart */}
          <div className="absolute right-3 top-3">
            <MotionTap
              as="button"
              className="grid h-8 w-8 place-items-center rounded-full bg-primary-light active:bg-primary-light-active"
              onClick={() => console.log("toggle saved", item.id)}
            >
              <IconSave />
            </MotionTap>
          </div>

          {/* Discount تحت يمين */}
          {item.discountLabel ? (
            <div className="absolute bottom-3 right-3 rounded-sm bg-success px-2 py-1">
              <span className="text-t-12-semibold text-white">
                {item.discountLabel}
              </span>
            </div>
          ) : null}

          {/* صورة الدواء */}
          <div className="mx-auto grid aspect-square w-full max-w-[160px] place-items-center overflow-hidden rounded-lg bg-white/60">
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
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="truncate text-t-17-semibold text-primary-darker">
              {item.name}
            </div>
            <div className="mt-1 text-t-14 text-neutral-dark">
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
        <div className="flex items-center gap-2">
          <span className="text-t-17-semibold text-success">{item.price}</span>

          {item.oldPrice ? (
            <span className="text-t-12 text-neutral line-through">
              {item.oldPrice}
            </span>
          ) : null}
        </div>

        {/* Buttons */}
        <div className="flex items-center gap-3">
          <MotionTap
            as="button"
            onClick={() => onAddToCart?.(item.id)}
            className="flex h-11 flex-1 items-center justify-center rounded-lg bg-primary transition-colors hover:bg-primary-hover"
          >
            <span className="whitespace-nowrap text-t-14-semibold leading-none text-white">
              Add to cart
            </span>
          </MotionTap>

          <MotionTap
            as="button"
            onClick={() => onRemove?.(item.id)}
            className="flex h-11 flex-1 items-center justify-center rounded-lg border border-primary bg-white transition-colors hover:bg-primary-light"
          >
            <span className="whitespace-nowrap text-t-14-semibold leading-none text-primary">
              Remove
            </span>
          </MotionTap>
        </div>
      </div>
    </MotionTap>
  );
}
