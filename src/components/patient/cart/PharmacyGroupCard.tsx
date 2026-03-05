"use client";


import Image from "next/image";
import type { PharmacyGroupProps } from "@/types/cart";

export default function PharmacyGroupCard({ group }: PharmacyGroupProps) {
  const itemCount = group.items.reduce((s, i) => s + i.quantity, 0);
  const displayItems = group.items.slice(0, 4);

  return (
    <div className="rounded-3xl border border-border p-3 mb-4 font-[var(--font-montserrat)]">
      <div className="flex items-center gap-4">
        <div className="relative bg-accent rounded-2xl flex items-center justify-center flex-shrink-0 w-[140px] h-[140px]">
          <div className="flex items-center relative">
            {displayItems.map((item, idx) => (
              <div
                key={item.id}
                className={`relative w-[60px] h-[60px] bg-card rounded-xl flex items-center justify-center overflow-hidden rotate-[8deg] ${
                  idx > 0 ? "-ml-8" : ""
                }`}
                style={{ zIndex: idx }}
              >
                {item.image ? (
                  <Image
                    src={item.image}
                    alt={item.name}
                    width={50}
                    height={50}
                    className="object-contain"
                  />
                ) : (
                  <span className="text-2xl">💊</span>
                )}
              </div>
            ))}
          </div>

          {itemCount > 0 && (
            <div className="absolute bottom-2 right-2 bg-primary-light text-primary text-t-14-bold rounded-xl px-2.5 py-1 z-20 border border-card shadow-sm font-[var(--font-montserrat)]">
              +{itemCount}
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="text-t-25-semibold text-primary-dark mb-3 truncate font-[var(--font-montserrat)]">
            {group.pharmacy.name}
          </h3>
          <p className="text-t-21 text-foreground mb-3 font-[var(--font-montserrat)]">
            {group.pharmacy.address ?? "Gaza City"}
          </p>
          <p className="text-t-17 text-muted-foreground font-[var(--font-montserrat)]">
            {itemCount} items | ${group.subtotal.toFixed(2)}
          </p>
        </div>
      </div>
    </div>
  );
}
