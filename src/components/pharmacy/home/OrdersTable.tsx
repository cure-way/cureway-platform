"use client";

import { useRouter } from "next/navigation";
import { orderColumns } from "@/utils/pharmacyConstants";
import SimpleTable from "../shared/SimpleTable";
import StatusBadge from "../shared/StatusBadge";
import type { OrderRow } from "@/types/pharmacyOrders";

export default function OrdersTable({ data }: { data: OrderRow[] }) {
  const router = useRouter();

  return (
    <SimpleTable<OrderRow>
      data={data}
      columns={orderColumns}
      onRowClick={(row) => router.push(`/pharmacy/orders/${row.id}`)}
      renderCell={(row, col) => {
        if (col.key === "status") {
          return <StatusBadge value={row.status} type="order" />;
        }
        if (col.key === "action") {
          return null;
        }
        if (col.key === "preview") {
          return (
            <span>
              {row.preview.firstItemName}
              {row.preview.remainingCount > 0 && (
                <span className="ml-1 text-gray-500 text-xs">
                  +{row.preview.remainingCount}
                </span>
              )}
            </span>
          );
        }

        if (col.key === "totalAmount") {
          return `${row.totalAmount.toFixed(2)} ILS`;
        }

        return String(row[col.key as keyof OrderRow]);
      }}
    />
  );
}
