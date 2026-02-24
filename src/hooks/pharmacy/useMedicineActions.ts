"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { InventoryListItem } from "@/types/pharmacyTypes";

export type MedicineActionType = "delete" | "mark_out";

export interface PendingMedicineAction {
  type: MedicineActionType;
  item: InventoryListItem;
}

export function useMedicineActions() {
  const router = useRouter();

  const [pendingAction, setPendingAction] =
    useState<PendingMedicineAction | null>(null);

  function handleMedicineAction(action: string, item: InventoryListItem) {
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

  function handleConfirm() {
    if (!pendingAction) return;

    if (pendingAction.type === "delete") {
      // TODO: delete logic here
    }

    if (pendingAction.type === "mark_out") {
      // TODO: mark out logic here
    }

    closeAction();
  }

  function closeAction() {
    setPendingAction(null);
  }

  return {
    pendingAction,
    handleMedicineAction,
    handleConfirm,
    closeAction,
  };
}
