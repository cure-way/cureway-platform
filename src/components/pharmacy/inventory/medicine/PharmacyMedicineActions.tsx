"use client";

import { CheckCircle } from "lucide-react";
import { getExpiryInfo } from "@/services/pharmacy/pharmacyService";
import { InventoryItem } from "@/types/pharmacyTypes";
import ConfirmActionModal from "../../shared/ConfirmActionModal";
import { useMedicineActions } from "@/hooks/pharmacy/useMedicineActions";

interface PharmacyMedicineActionsProps {
  item: InventoryItem;
}

export default function PharmacyMedicineActions({
  item,
}: PharmacyMedicineActionsProps) {
  const expiry = getExpiryInfo(item.expiryDate);

  const { pendingAction, handleMedicineAction, handleConfirm, closeAction } =
    useMedicineActions();

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

      <ConfirmActionModal
        open={!!pendingAction}
        title={
          pendingAction?.type === "delete"
            ? "Delete Medicine"
            : "Mark as Out of Stock"
        }
        description={
          pendingAction?.type === "delete"
            ? `Are you sure you want to delete ${item.medicineName}? This action cannot be undone.`
            : `This medicine will be marked as unavailable for orders.`
        }
        confirmLabel={
          pendingAction?.type === "delete" ? "Delete Medicine" : "Confirm"
        }
        confirmVariant={pendingAction?.type === "delete" ? "danger" : "primary"}
        onConfirm={handleConfirm}
        onCancel={closeAction}
      />
    </>
  );
}
