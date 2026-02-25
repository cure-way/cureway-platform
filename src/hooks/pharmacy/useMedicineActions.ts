"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { InventoryItem } from "@/types/pharmacyTypes";
import { deleteInventory } from "@/services/pharmacy/pharmacyService";
import toast from "react-hot-toast";

export type MedicineActionType = "delete" | "mark_out";

export interface PendingMedicineAction {
  type: MedicineActionType;
  item: InventoryItem;
}

interface UseMedicineActionsOptions {
  refetch?: () => Promise<void>;
  onDeleteSuccess?: () => void;
}

export function useMedicineActions({
  refetch,
  onDeleteSuccess,
}: UseMedicineActionsOptions) {
  const router = useRouter();

  const [pendingAction, setPendingAction] =
    useState<PendingMedicineAction | null>(null);

  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function handleMedicineAction(action: string, item: InventoryItem) {
    switch (action) {
      case "view":
        router.push(`/pharmacy/inventory/${item.id}`);
        break;

      case "delete":
        setPendingAction({ type: "delete", item });
        break;

      case "mark_out":
        setPendingAction({ type: "mark_out", item });
        break;
    }
  }

  async function handleConfirm() {
    if (!pendingAction) return;

    setIsProcessing(true);
    setError(null);

    try {
      if (pendingAction.type === "delete") {
        await deleteInventory(pendingAction.item.id);

        if (onDeleteSuccess) {
          onDeleteSuccess();
        } else if (refetch) {
          await refetch();
        }

        toast.success("Inventory item deleted successfully.");
      }

      if (pendingAction.type === "mark_out") {
        // TODO: implement mark_out service
      }

      closeAction();
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to process action.";
      setError(message);
      toast.error(message);
    } finally {
      setIsProcessing(false);
    }
  }

  function closeAction() {
    if (isProcessing) return; // prevent closing while processing
    setPendingAction(null);
    setError(null);
  }

  return {
    pendingAction,
    isProcessing,
    error,
    handleMedicineAction,
    handleConfirm,
    closeAction,
  };
}
