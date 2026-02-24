"use client";

import DataTable from "../shared/DataTable";
import ActionsDropdown from "../shared/ActionsDropdown";

import { INVENTORY_ACTIONS, inventoryColumns } from "@/utils/pharmacyConstants";
import StatusBadge from "../shared/StatusBadge";
import ConfirmActionModal from "../shared/ConfirmActionModal";
import { useMedicineActions } from "@/hooks/pharmacy/useMedicineActions";
import { InventoryListItem } from "@/types/pharmacyTypes";
import TableSkeleton from "../shared/TableSkeleton";
import EmptyState from "../shared/EmptyState";
import ErrorState from "../shared/ErrorState";

export default function InventoryTable({
  data,
  loading,
  error,
  onRetry,
}: {
  data: InventoryListItem[];
  loading: boolean;
  error: string | null;
  onRetry?: () => void;
}) {
  const { pendingAction, handleMedicineAction, handleConfirm, closeAction } =
    useMedicineActions();

  if (loading) {
    return <TableSkeleton columns={inventoryColumns.length} rows={5} />;
  }

  if (error) {
    return <ErrorState message={error} onRetry={onRetry} />;
  }

  if (!data.length) {
    return <EmptyState message="No medicines found matching your filters." />;
  }

  return (
    <>
      <DataTable
        data={data}
        columns={inventoryColumns}
        renderCell={(row, col) => {
          if (col.key === "action") {
            return (
              <ActionsDropdown
                actions={INVENTORY_ACTIONS}
                onAction={(actionId) => handleMedicineAction(actionId, row)}
              />
            );
          }

          if (col.key === "stockStatus") {
            return <StatusBadge value={row.stockStatus} type="inventory" />;
          }

          const value = row[col.key as keyof InventoryListItem];

          if (value === null || value === undefined) {
            return <span className="text-gray-400">—</span>;
          }

          return String(value);
        }}
      />

      <ConfirmActionModal
        open={!!pendingAction}
        title={
          pendingAction?.type === "delete"
            ? "Delete Medicine"
            : "Mark as Out of Stock"
        }
        description={
          pendingAction?.type === "delete"
            ? `Are you sure you want to delete ${pendingAction.item.medicineName}?`
            : `Mark ${pendingAction?.item.medicineName} as out of stock?`
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
