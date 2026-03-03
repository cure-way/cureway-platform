"use client";

import { useRouter } from "next/navigation";
import { orderColumns } from "@/utils/pharmacyConstants";
import SimpleTable from "../shared/SimpleTable";
import StatusBadge from "../shared/StatusBadge";
import type { Order, OrderRow } from "@/types/pharmacyOrders";

export default function OrdersTable({ data }: { data: Order[] }) {
  const router = useRouter();

  const rows: OrderRow[] = data.map((order) => {
    const firstItem = order.items[0];

    return {
      id: order.id,
      customerName: order.patient.name,
      preview: {
        firstItemName: firstItem?.medicineName ?? "—",
        remainingCount: order.items.length > 1 ? order.items.length - 1 : 0,
      },
      totalAmount: order.totalAmount,
      formattedDate: order.createdAt.toLocaleDateString(),
      status: order.status,
    };
  });

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
