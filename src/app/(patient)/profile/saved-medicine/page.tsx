"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";

import { PageContainer, PageHeader } from "@/components/shared";
import {
  SavedMedicineCard,
  type SavedMedicine,
} from "@/components/patient/saved-medicine/SavedMedicineCard";
import { EmptySavedMedicine } from "@/components/patient/saved-medicine/EmptySavedMedicine";

/**
 * Six distinct medicines. Every entry used to be the same Voltaren item at the
 * same price, which read as a rendering bug rather than a saved list.
 */
const SAVED: SavedMedicine[] = [
  {
    id: "1",
    name: "Voltaren",
    sub1: "30 Tablets",
    sub2: "400 mg",
    price: "$15.00",
    oldPrice: "$20.00",
    discountLabel: "25% Off",
    imageSrc: "/patient/Voltaren.png",
  },
  {
    id: "2",
    name: "Vitamin C",
    sub1: "60 Effervescent",
    sub2: "1000 mg",
    price: "$8.50",
    imageSrc: "/patient/Vitamin C.png",
  },
  {
    id: "3",
    name: "Zecuf Syrup",
    sub1: "100 ml",
    sub2: "Herbal cough relief",
    price: "$6.25",
    oldPrice: "$7.50",
    discountLabel: "17% Off",
    imageSrc: "/patient/Zecuf.png",
  },
  {
    id: "4",
    name: "CH Alpha Active",
    sub1: "30 Sachets",
    sub2: "Joint support",
    price: "$32.00",
    imageSrc: "/patient/CH Alpha Active.png",
  },
  {
    id: "5",
    name: "Biogen Collagen",
    sub1: "90 Capsules",
    sub2: "Marine collagen",
    price: "$24.75",
    oldPrice: "$29.00",
    discountLabel: "15% Off",
    imageSrc: "/patient/Biogen Collagen.png",
  },
  {
    id: "6",
    name: "Cold & Flu Relief",
    sub1: "20 Tablets",
    sub2: "Day and night",
    price: "$9.90",
    imageSrc: "/patient/Cold and Flu medicine.png",
  },
];

export default function SavedMedicinePage() {
  const router = useRouter();
  const [items, setItems] = React.useState<SavedMedicine[]>(SAVED);
  const [query, setQuery] = React.useState("");

  const visible = items.filter((m) =>
    m.name.toLowerCase().includes(query.trim().toLowerCase()),
  );

  return (
    <PageContainer>
      <PageHeader
        title="Saved Medicine"
        subtitle="Your frequently used medicines"
        showBack
        backHref="/profile"
        actions={
          <div className="relative w-full sm:w-[280px]">
            <Search
              className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-neutral"
              aria-hidden="true"
            />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search saved medicine"
              aria-label="Search saved medicine"
              className="h-11 w-full rounded-lg border border-border bg-white pl-10 pr-3 text-t-14 outline-none transition-colors focus:border-primary"
            />
          </div>
        }
      />

      {items.length === 0 ? (
        <EmptySavedMedicine onBrowse={() => router.push("/medicines")} />
      ) : visible.length === 0 ? (
        <p className="py-12 text-center text-t-14 text-neutral-dark">
          No saved medicine matches “{query}”.
        </p>
      ) : (
        /* No outer bordered wrapper: it double-framed every card. */
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((m) => (
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
      )}
    </PageContainer>
  );
}
