"use client";

import DataTable from "../shared/DataTable";
import ActionsDropdown from "../shared/ActionsDropdown";

import { INVENTORY_ACTIONS, inventoryColumns } from "@/utils/pharmacyConstants";
import StatusBadge from "../shared/StatusBadge";
import { useMedicineActions } from "@/hooks/pharmacy/useMedicineActions";
import { InventoryItem } from "@/types/pharmacyTypes";
import TableSkeleton from "../shared/TableSkeleton";
import EmptyState from "../shared/EmptyState";
import ErrorState from "../shared/ErrorState";
import NullableText from "../shared/NullableText";
import InventoryActionModal from "./InventoryActionModal";

type Props = {
  data: InventoryItem[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;

  total: number;
  page: number;
  limit: number;
  onPageChange: (page: number) => void;
  onLimitChange: (limit: number) => void;
};

export default function InventoryTable({
  data,
  loading,
  error,
  refetch,
  total,
  page,
  limit,
  onPageChange,
  onLimitChange,
}: Props) {
  const {
    pendingAction,
    handleMedicineAction,
    handleConfirm,
    closeAction,
    isProcessing,
  } = useMedicineActions();

  if (loading) {
    return <TableSkeleton columns={inventoryColumns.length} rows={5} />;
  }

  if (error) {
    return (
      <div className="bg-red-50 p-6 rounded-xl">
        <ErrorState message={error} onRetry={refetch} />
      </div>
    );
  }

  if (!data.length) {
    return (
      <div className="bg-gray-50 p-6 rounded-xl">
        <EmptyState message="No medicines found matching your filters." />
      </div>
    );
  }

  return (
    <>
      <DataTable
        data={data}
        columns={inventoryColumns}
        totalItems={total}
        currentPage={page}
        rowsPerPage={limit}
        onPageChange={onPageChange}
        onRowsPerPageChange={onLimitChange}
        renderCell={(row, col) => {
          if (col.key === "action") {
            return (
              <ActionsDropdown
                actions={INVENTORY_ACTIONS}
                onAction={(actionId) => handleMedicineAction(actionId, row)}
              />
            );
          }

          if (col.key === "status") {
            return <StatusBadge value={row.status} type="inventory" />;
          }

          const value = row[col.key as keyof InventoryItem];

          if (value === null || value === undefined) {
            return <NullableText value={value} />;
          }

          return String(value);
        }}
      />

      <InventoryActionModal
        pendingAction={pendingAction}
        loading={isProcessing}
        onConfirm={handleConfirm}
        onCancel={closeAction}
      />
    </>
  );
}
