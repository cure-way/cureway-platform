"use client";

import clsx from "clsx";
import { X } from "lucide-react";
import { UpdateInventoryInput, InventoryItem } from "@/types/pharmacyTypes";
import EditMedicineForm from "./EditMedicineForm";
import { useUpdateInventory } from "@/hooks/pharmacy/useUpdateInventory";
import toast from "react-hot-toast";

interface Props {
  open: boolean;
  onClose: () => void;
  item: InventoryItem;
}

export default function EditMedicineDrawer({ open, onClose, item }: Props) {
  const { update, loading } = useUpdateInventory();
  async function handleSave(data: UpdateInventoryInput) {
    try {
      await update(item.id, data);
      onClose();

      toast.success("Medicine updated successfully");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to update medicine",
      );
    }
  }

  return (
    <>
      {/* Overlay */}
      <div
        onClick={onClose}
        className={clsx(
          "z-50 fixed inset-0 bg-black/40 w-screen h-screen transition-opacity",
          open ? "opacity-100" : "pointer-events-none opacity-0",
        )}
      />

      <aside
        className={clsx(
          "top-0 right-0 z-999 fixed bg-white shadow-xl w-full sm:max-w-sm h-full",
          "flex flex-col",
          "transform transition-transform duration-300 ease-out",
          open ? "translate-x-0" : "translate-x-full",
        )}
      >
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="font-semibold text-gray-900 text-sm">
            Edit medicine details
          </h2>

          <button
            onClick={onClose}
            className="hover:bg-gray-100 p-2 rounded-lg"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex-1 p-4 overflow-y-auto">
          <EditMedicineForm item={item} onSubmit={handleSave} />
        </div>

        <div className="space-y-2 p-4 border-t">
          <button
            disabled={loading}
            onClick={() => {
              document.querySelector("form")?.requestSubmit();
            }}
            className="w-full bg-(--color-primary) text-white py-2 rounded-lg text-sm disabled:opacity-50"
          >
            {loading ? "Saving..." : "Save changes"}
          </button>

          <button
            onClick={onClose}
            className="py-2 border rounded-lg w-full text-gray-600 text-sm"
          >
            Cancel
          </button>
        </div>
      </aside>
    </>
  );
}
