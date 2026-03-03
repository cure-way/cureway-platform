import { SearchFilter } from "@/types/search";

export const DEFAULT_FILTERS: SearchFilter[] = [
  {
    key: "availability",
    label: "Availability",
    description: "Available now",
  },
  {
    key: "delivery",
    label: "Delivery",
    description: "Fast delivery",
  },
  {
    key: "pharmacy",
    label: "Pharmacy",
    description: "Nearby only",
  },
  {
    key: "prescription",
    label: "Prescription",
    description: "Required",
  },
];

export const categoryImages = [
  "/patient/pills.png",
  "/patient/Cold & Flu medicine.png",
  "/patient/Daily Essentials.png",
  "/patient/Vitamins & Supplements.png",
  "/patient/Discount on First Aid.png",
  "/patient/Pharnacy-shelves.png",
];

export const categoryMedicinesFilters = [
  { label: "All", value: undefined },
  { label: "Price: Low to High", value: "price-asc" },
  { label: "Price: High to Low", value: "price-desc" },
];
