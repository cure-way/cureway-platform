"use client";

import { Pencil } from "lucide-react";
import { InventoryItem } from "@/types/pharmacyTypes";
import EditMedicineDrawer from "./EditMedicineDrawer";
import { useState } from "react";

export default function PharmacyMedicineHeader({
  item,
}: {
  item: InventoryItem;
}) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <div className="flex justify-between items-center">
        <div>
          <h1 className="font-semibold text-(--color-primary) text-lg">
            Medicine Details
          </h1>

          <div className="flex items-center gap-3 mt-1">
            <p className="text-gray-600 text-sm">
              {item.medicineName} {item.prescriptionRequired && "(Rx)"}
            </p>

            <span
              className={`rounded-full px-3 py-1 text-xs font-medium ${
                item.status === "in"
                  ? "bg-green-100 text-green-700"
                  : item.status === "low"
                    ? "bg-yellow-100 text-yellow-700"
                    : "bg-red-100 text-red-700"
              }`}
            >
              {item.status === "in"
                ? "In Stock"
                : item.status === "low"
                  ? "Low Stock"
                  : "Out of Stock"}
            </span>
          </div>
        </div>

        <button
          onClick={() => setOpen(true)}
          className="hover:bg-gray-50 p-2 border rounded-lg"
        >
          <Pencil className="w-4 h-4 text-(--color-primary)" />
        </button>
      </div>
      <EditMedicineDrawer
        open={open}
        onClose={() => setOpen(false)}
        item={item}
      />
    </>
  );
}
