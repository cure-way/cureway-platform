"use client";

import { useRouter } from "next/navigation";
import { orderColumns } from "@/utils/pharmacyConstants";
import SimpleTable from "../shared/SimpleTable";
import StatusBadge from "../shared/StatusBadge";
import type { Order, OrderRow } from "@/types/pharmacyOrders";

export default function OrdersTable({ data }: { data: Order[] }) {
  const router = useRouter();

  const rows: OrderRow[] = data.map((order) => ({
    id: order.id,
    customer: order.customerName,
    items: {
      firstItemName: order.preview.firstItemName,
      remainingCount: order.preview.remainingCount,
    },
    total: order.totalAmount,
    date: order.createdAt.toLocaleDateString(),
    status: order.status,
  }));

  return (
    <div>
      <SimpleTable<OrderRow>
        data={rows}
        columns={orderColumns}
        onRowClick={(row) => router.push(`/pharmacy/orders/${row.id}`)}
        renderCell={(row, col) => {
          if (col.key === "status") {
            return <StatusBadge value={row.status} type="order" />;
          }

          if (col.key === "items") {
            return (
              <span>
                {row.items.firstItemName}
                {row.items.remainingCount > 0 && (
                  <span className="ml-1 text-gray-500 text-xs">
                    +{row.items.remainingCount}
                  </span>
                )}
              </span>
            );
          }

          if (col.key === "total") {
            return `${row.total.toFixed(2)} ${"ILS"}`;
          }

          return String(row[col.key as keyof OrderRow]);
        }}
      />

      <div className="mt-3 text-right">
        <button
          onClick={() => router.push("/pharmacy/orders")}
          className="font-medium text-(--color-primary) text-xs"
        >
          View All Orders →
        </button>
      </div>
    </div>
  );
}
