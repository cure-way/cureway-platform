"use client";
import { memo, useState } from "react";
import { ChevronUp, ChevronDown, CreditCard } from "lucide-react";
import type { PaymentMethod } from "@/types/cart";
import Image from "next/image";

interface Props {
  methods: PaymentMethod[];
  selected: PaymentMethod | null;
  frozen?: boolean;
  onSelect: (m: PaymentMethod) => void;
}

const PaymentMethods = memo(function PaymentMethods({
  methods,
  selected,
  frozen,
  onSelect,
}: Props) {
  const [collapsed, setCollapsed] = useState(false);

  if (!methods) return null;

  if (frozen && selected)
    return (
      <div className="font-[var(--font-montserrat)]">
        <h2 className="text-t-30-semibold text-foreground leading-tight mb-3 m-0">
          Payment method
        </h2>
        <div className="w-full min-h-[80px] rounded-xl px-4 py-3 bg-accent flex items-center gap-3">
          <div className="w-6 h-6 flex items-center justify-center flex-shrink-0">
            {selected.icon === "cash" ? (
              <Image src="/icons/cash.png" alt="Cash" width={24} height={24} />
            ) : (
              <CreditCard
                size={24}
                className="text-primary"
                strokeWidth={1.8}
              />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <span className="text-t-17-semibold text-foreground block mb-0.5">
              {selected.name}
            </span>
            {selected.description && (
              <span className="text-t-12 text-neutral-dark">
                {selected.description}
              </span>
            )}
          </div>
          <div className="w-7 h-7 rounded-full bg-success flex items-center justify-center flex-shrink-0">
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M20 6 9 17l-5-5" />
            </svg>
          </div>
        </div>
      </div>
    );

  return (
    <div className="font-[var(--font-montserrat)]">
      <div
        className={`flex items-center justify-between ${collapsed ? "" : "mb-3"}`}
      >
        <h2 className="text-t-30-semibold text-foreground leading-tight m-0">
          Payment method
        </h2>
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="bg-transparent border-none cursor-pointer p-1 text-neutral-dark hover:text-primary transition-colors"
        >
          {collapsed ? <ChevronDown size={20} /> : <ChevronUp size={20} />}
        </button>
      </div>
      <div
        className={`overflow-hidden transition-all duration-300 ${
          collapsed ? "max-h-0" : "max-h-[400px]"
        }`}
      >
        <div className="bg-accent rounded-2xl p-3 flex flex-col gap-2">
          {methods.map((method) => {
            const sel = selected?.id === method.id;
          
            const isCard = method.icon === "credit";
            return (
              <button
                key={method.id}
                onClick={() => !isCard && onSelect(method)}
                className={`w-full min-h-[90px] flex items-center gap-3 px-4 py-3 rounded-xl bg-card text-left transition-all ${
                  sel
                    ? "border-[1.5px] border-primary"
                    : "border-[1.5px] border-transparent"
                } ${isCard ? "cursor-default opacity-60" : "cursor-pointer"}`}
              >
                <div className="w-6 h-6 flex items-center justify-center flex-shrink-0">
                  {method.icon === "cash" ? (
                    <Image
                      src="/icons/cash.png"
                      alt="Cash"
                      width={24}
                      height={24}
                    />
                  ) : (
                    <Image
                      src="/icons/credit.png"
                      alt="Credit"
                      width={24}
                      height={24}
                    />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-t-17-semibold text-foreground block mb-1">
                    {method.name}
                  </span>
                  {method.description && (
                    <span className="text-t-12 text-neutral-dark">
                      {method.description}
                    </span>
                  )}
                </div>
                {method.recommended && !isCard && (
                  <span className="ml-auto bg-success-light rounded-xl px-2.5 py-0.5 text-t-10 text-success-darker font-medium whitespace-nowrap flex-shrink-0">
                    Recommended
                  </span>
                )}
                {isCard && (
                  <span className="ml-auto bg-warning-light rounded-xl px-2.5 py-0.5 text-t-10 text-warning-darker font-medium whitespace-nowrap flex-shrink-0">
                    Coming Soon
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
});

export default PaymentMethods;