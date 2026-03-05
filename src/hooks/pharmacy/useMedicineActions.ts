"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InventoryItem } from "@/types/pharmacyTypes";
import {
  deleteInventory,
  updateInventoryItemService,
} from "@/services/pharmacyInventory";
import toast from "react-hot-toast";

export type MedicineActionType = "delete" | "mark_out";

export interface PendingMedicineAction {
  type: MedicineActionType;
  item: InventoryItem;
}

interface UseMedicineActionsOptions {
  onDeleteSuccess?: () => void;
}

export function useMedicineActions({
  onDeleteSuccess,
}: UseMedicineActionsOptions = {}) {
  const router = useRouter();
  const queryClient = useQueryClient();

  const [pendingAction, setPendingAction] =
    useState<PendingMedicineAction | null>(null);

  const [error, setError] = useState<string | null>(null);

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteInventory(id),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["pharmacy", "inventory"],
      });

      toast.success("Inventory item deleted successfully.");
    },
  });

  const markOutMutation = useMutation({
    mutationFn: (id: string) =>
      updateInventoryItemService(id, { stockQuantity: 0 }),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["pharmacy", "inventory"],
      });

      toast.success("Item marked as out of stock.");
    },
  });

  const isProcessing = deleteMutation.isPending || markOutMutation.isPending;

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

    try {
      if (pendingAction.type === "delete") {
        await deleteMutation.mutateAsync(pendingAction.item.id);

        onDeleteSuccess?.();
      }

      if (pendingAction.type === "mark_out") {
        await markOutMutation.mutateAsync(pendingAction.item.id);
      }

      closeAction();
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to process action.";

      setError(message);
      toast.error(message);
    }
  }

  function closeAction() {
    if (isProcessing) return;
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
