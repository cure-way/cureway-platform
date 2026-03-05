"use client";

import React from "react";
import { MotionTap } from "@/components/shared/MotionTap";
import { IconCopy, IconPin } from "./Icons";

export type HistoryOrder = {
  id: string; // "#0325"
  pharmacyName: string;
  pharmacyMeta: string; // "Gaza, (+970) 59-244-9634"
  fromLine1: string; // "1852, Alkinz St."
  fromLine2: string; // "Al Naser area, Gaza"
  deliveredText: string; // "Delivered on Dec 18, 2025 at 3:58 PM"
  productCountLabel: string; // "Product type (4items)"
  quantityLabel: string; // "Quantity"
  quantityValue: string; // "x4"
  price: string; // "21.48$"
};

export function HistoryOrderCard({
  order,
  onCopy,
  onReorder,
  onShowDetails,
}: {
  order: HistoryOrder;
  onCopy?: (id: string) => void;
  onReorder?: (id: string) => void;
  onShowDetails?: (id: string) => void;
}) {
  return (
    <div className="rounded-[14px] border border-[#E9E9E9] bg-white">
      {/* Header */}
      <div className="flex items-center justify-between px-4 pt-3">
        <div className="text-[14px] font-medium text-[#9CA3AF]">
          Order ID:{" "}
          <span className="font-semibold text-[#334EAC]">{order.id}</span>
        </div>

        <MotionTap
          as="button"
          onClick={() => onCopy?.(order.id)}
          className="inline-flex items-center gap-2 text-[12px] text-[#9CA3AF]"
        >
          <IconCopy />
          <span>Copy</span>
        </MotionTap>
      </div>

      {/* Pharmacy row */}
      <div className="flex items-start gap-4 px-4 py-3">
        <div className="h-[56px] w-[56px] rounded-[14px] bg-[#EEF1FF]" />
        <div className="min-w-0">
          <div className="text-[16px] font-semibold text-[#1E2B57]">
            {order.pharmacyName}
          </div>
          <div className="mt-1 text-[12px] text-[#9CA3AF]">
            {order.pharmacyMeta}
          </div>
        </div>
      </div>

      {/* From row */}
      <div className="mx-4 rounded-[10px] border border-[#EFEDED] bg-[#FAFAFA] px-3 py-3">
        <div className="flex items-start gap-2">
          <div className="mt-[2px]">
            <IconPin />
          </div>
          <div className="min-w-0">
            <div className="text-[12px] font-semibold text-[#6B7280]">
              From
            </div>
            <div className="text-[13px] font-medium text-[#111827]">
              {order.fromLine1}
            </div>
            <div className="text-[12px] text-[#9CA3AF]">{order.fromLine2}</div>
          </div>
        </div>
      </div>

      {/* Delivered bar */}
      <div className="mx-4 mt-3 rounded-[8px] bg-[#EAF7EE] px-3 py-2">
        <div className="text-center text-[12px] font-medium text-[#2E7D4F]">
          {order.deliveredText}
        </div>
      </div>

      {/* Product box */}
      <div className="mx-4 mt-3 rounded-[10px] border border-[#EFEDED] bg-[#FAFAFA] px-3 py-3">
        <div className="flex items-center justify-between">
          <div className="text-[12px] text-[#6B7280]">{order.productCountLabel}</div>
          <div className="text-[12px] text-[#6B7280]">{order.quantityLabel}</div>
        </div>

        <div className="mt-3 flex items-center justify-between gap-3">
          {/* thumbs */}
          <div className="flex items-center gap-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="h-[34px] w-[34px] rounded-[8px] border border-[#E5E7EB] bg-white"
              />
            ))}
          </div>

          <MotionTap
            as="button"
            onClick={() => onShowDetails?.(order.id)}
            className="text-[12px] font-semibold text-[#334EAC]"
          >
            Show details
          </MotionTap>

          <div className="text-[12px] font-semibold text-[#6B7280]">
            {order.quantityValue}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between px-4 py-4">
        <MotionTap
          as="button"
          onClick={() => onReorder?.(order.id)}
          className="h-[36px] rounded-[10px] border border-[#D6E0FF] bg-white px-6 text-[12px] font-semibold text-[#3B67FF]"
        >
          Reorder
        </MotionTap>

        <div className="text-[14px] font-bold text-[#2E7D4F]">
          {order.price}
        </div>
      </div>
    </div>
  );
}