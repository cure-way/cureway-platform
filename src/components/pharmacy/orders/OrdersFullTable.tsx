"use client";

import DataTable from "../shared/DataTable";
import ActionsDropdown from "../shared/ActionsDropdown";

import { orderColumns, ORDERS_ACTIONS } from "@/utils/pharmacyConstants";
import StatusBadge from "../shared/StatusBadge";
import TableSkeleton from "../shared/TableSkeleton";
import EmptyState from "../shared/EmptyState";
import ErrorState from "../shared/ErrorState";
import NullableText from "../shared/NullableText";
import { OrderRow } from "@/types/pharmacyOrders";

type Props = {
  data: OrderRow[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<unknown>;

  total: number;
  page: number;
  limit: number;
  onPageChange: (page: number) => void;
  onLimitChange: (limit: number) => void;
};

export default function OrdersFullTable({
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
  if (loading) {
    return <TableSkeleton columns={orderColumns.length} rows={5} />;
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
        <EmptyState message="No orders found matching your filters." />
      </div>
    );
  }

  return (
    <>
      <DataTable
        data={data}
        columns={orderColumns}
        totalItems={total}
        currentPage={page}
        rowsPerPage={limit}
        onPageChange={onPageChange}
        onRowsPerPageChange={onLimitChange}
        renderCell={(row, col) => {
          if (col.key === "action") {
            return (
              <ActionsDropdown
                actions={ORDERS_ACTIONS}
                onAction={(actionId) =>
                  console.log("Perform action", actionId, "on item", row.id)
                }
              />
            );
          }

          if (col.key === "status") {
            return <StatusBadge value={row.status} type="order" />;
          }

          const value = row[col.key as keyof OrderRow];

          if (value === null || value === undefined) {
            return <NullableText value={value} />;
          }

          return String(value);
        }}
      />
    </>
  );
}
