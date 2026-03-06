import StatusDropdown from "../shared/StatusDropdown";
import OrdersTable from "./OrdersTable";
import { ORDER_STATUSES } from "@/utils/pharmacyConstants";
import { Order, OrderFilter } from "@/types/pharmacyOrders";
import ErrorState from "../shared/ErrorState";
import EmptyState from "../shared/EmptyState";
import { mapOrderToRow } from "@/adapters/pharmacyOrders";
import Link from "next/link";

export default function OrdersCard({
  data,
  loading,
  error,
  status,
  setStatus,
}: {
  data: Order[];
  loading: boolean;
  error: string | null;
  status: string | undefined;
  setStatus: (status: OrderFilter) => void;
}) {
  const rows = data.map(mapOrderToRow);

  return (
    <div className="flex flex-col bg-white mb-4 p-4 border rounded-xl h-74">
      <div className="flex justify-between items-center mb-2">
        <h2 className="font-semibold text-gray-900 text-sm">Orders</h2>
        <StatusDropdown
          options={ORDER_STATUSES}
          value={status}
          onChange={(value) => setStatus(value as OrderFilter)}
        />
      </div>

      <div className="flex justify-center items-center">
        {loading && <OrdersTableSkeleton />}

        {!loading && error && <ErrorState message={error} />}

        {!loading && !error && data.length === 0 && (
          <EmptyState message="No orders found." />
        )}
      </div>
      {!loading && !error && data.length > 0 && <OrdersTable data={rows} />}

      {!loading && !error && data.length > 0 && (
        <div className="flex justify-end mt-3">
          <Link
            href="/pharmacy/orders"
            className="font-medium text-(--color-primary) text-xs"
          >
            View All Orders →
          </Link>
        </div>
      )}
    </div>
  );
}

function OrdersTableSkeleton() {
  return (
    <div className="space-y-3 w-full animate-pulse">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="flex justify-between items-center p-3">
          <div className="space-y-2">
            <div className="bg-gray-200 rounded w-32 h-3" />
            <div className="bg-gray-200 rounded w-20 h-3" />
          </div>

          <div className="bg-gray-200 rounded w-16 h-3" />

          <div className="bg-gray-200 rounded w-20 h-3" />
        </div>
      ))}
    </div>
  );
}
