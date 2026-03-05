"use client";

import { PendingMedicineAction } from "@/hooks/pharmacy/useMedicineActions";
import ConfirmActionModal from "../shared/ConfirmActionModal";

interface InventoryActionModalProps {
  pendingAction: PendingMedicineAction | null;
  loading: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function InventoryActionModal({
  pendingAction,
  loading,
  onConfirm,
  onCancel,
}: InventoryActionModalProps) {
  if (!pendingAction) return null;

  const { type, item } = pendingAction;

  const isDelete = type === "delete";

  return (
    <ConfirmActionModal
      open={true}
      title={isDelete ? "Delete Medicine" : "Mark as Out of Stock"}
      description={
        isDelete
          ? `Are you sure you want to delete ${item.medicineName}? This action cannot be undone.`
          : `This medicine will be marked as unavailable for orders.`
      }
      confirmLabel={isDelete ? "Delete Medicine" : "Confirm"}
      confirmVariant={isDelete ? "danger" : "primary"}
      onConfirm={onConfirm}
      onCancel={onCancel}
      loading={loading}
    />
  );
}
