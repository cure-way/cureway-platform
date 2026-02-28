"use client";
import React, { memo } from "react";
import { MoreHorizontal } from "lucide-react";
import type { DeliveryOption } from "@/types/cart";
import Image from "next/image";

interface Props {
  options: DeliveryOption[];
  selected: DeliveryOption | null;
  frozen?: boolean;
  onSelect: (o: DeliveryOption) => void;
}

const DeliveryOptions = memo(function DeliveryOptions({
  options,
  selected,
  frozen,
  onSelect,
}: Props) {
  return (
    <div className="font-[var(--font-montserrat)]">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-t-30-semibold text-foreground leading-tight m-0">
          Delivery Options
        </h2>

        <button className="bg-transparent border-none cursor-pointer p-1 text-neutral-dark hover:text-primary transition-colors">
          <MoreHorizontal size={20} />
        </button>
      </div>

      <div className="bg-accent rounded-2xl p-3 flex flex-col gap-2">
        {(frozen ? options.filter((o) => o.id === selected?.id) : options).map(
          (option) => {
            const sel = selected?.id === option.id;

            const iconSrc =
              option.icon === "express"
                ? "/icons/expressDelivery.png"
                : "/icons/standardDelivery.png";

            return (
              <button
                key={option.id}
                onClick={() => onSelect(option)}
                className={`w-full min-h-[120px] rounded-xl p-3 sm:p-4 flex flex-col gap-4 bg-card text-left transition-all ${
                  sel
                    ? "border-[1.5px] border-primary"
                    : "border-[1.5px] border-transparent"
                }`}
              >
                <div className="flex items-center justify-between w-full gap-2">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 flex items-center justify-center flex-shrink-0">
                      <Image
                        src={iconSrc}
                        alt={option.name}
                        width={20}
                        height={20}
                      />
                    </div>

                    <span
                      className={`text-t-17-semibold transition-colors ${
                        sel ? "text-primary" : "text-foreground"
                      }`}
                    >
                      {option.name}
                    </span>
                  </div>

                  <span className="text-t-17-semibold flex-shrink-0 text-success">
                    {option.price.toFixed(2)}$
                  </span>
                </div>

                <div className="w-full min-h-[56px] rounded-lg px-4 py-3 border border-border bg-card flex items-center">
                  <span className="text-t-14 text-neutral-dark">
                    {option.duration}
                    {option.description ? ` · ${option.description}` : ""}
                  </span>
                </div>
              </button>
            );
          },
        )}
      </div>
    </div>
  );
});

export default DeliveryOptions;
