"use client";

import { CheckCircle } from "lucide-react";
import { getExpiryInfo } from "@/services/pharmacy/pharmacyService";
import { InventoryItem } from "@/types/pharmacyTypes";
import { useMedicineActions } from "@/hooks/pharmacy/useMedicineActions";
import InventoryActionModal from "../InventoryActionModal";
import { useRouter } from "next/navigation";

interface PharmacyMedicineActionsProps {
  item: InventoryItem;
  refetch?: () => Promise<void>;
}

export default function PharmacyMedicineActions({
  item,
  refetch,
}: PharmacyMedicineActionsProps) {
  const router = useRouter();
  const expiry = getExpiryInfo(item.expiryDate);

  const {
    pendingAction,
    handleMedicineAction,
    handleConfirm,
    closeAction,
    isProcessing,
  } = useMedicineActions({
    refetch,
    onDeleteSuccess: () => {
      router.replace("/pharmacy/inventory");
    },
  });

  return (
    <>
      <div className="space-y-4 bg-white p-5 border rounded-xl">
        <h3 className="font-semibold text-gray-900 text-sm">Alert & Actions</h3>

        {expiry.status === "safe" ? (
          <div className="flex items-center gap-2 bg-green-50 p-3 rounded-lg text-green-700 text-sm">
            <CheckCircle className="w-4 h-4" />
            <span>No alerts</span>
          </div>
        ) : (
          <div
            className={`p-3 rounded-lg text-sm ${
              expiry.status === "expired"
                ? "bg-red-100 text-red-800"
                : "bg-yellow-100 text-yellow-800"
            }`}
          >
            <p>{expiry.label}</p>
            <p className="opacity-80 text-xs">Expiry date: {item.expiryDate}</p>
          </div>
        )}

        <button
          onClick={() => handleMedicineAction("mark_out", item)}
          className="hover:bg-gray-50 py-2 border rounded-lg w-full text-sm"
        >
          Mark as Out of stock
        </button>

        <button
          onClick={() => handleMedicineAction("delete", item)}
          className="bg-red-700 py-2 rounded-lg w-full text-white text-sm"
        >
          Delete medicine
        </button>
      </div>

      <InventoryActionModal
        pendingAction={pendingAction}
        loading={isProcessing}
        onConfirm={handleConfirm}
        onCancel={closeAction}
      />
    </>
  );
}
