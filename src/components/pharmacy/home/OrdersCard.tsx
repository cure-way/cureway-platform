import StatusDropdown from "../shared/StatusDropdown";
import OrdersTable from "./OrdersTable";
import { ORDER_STATUSES } from "@/utils/pharmacyConstants";
import { Order, OrderFilter } from "@/types/pharmacyOrders";
import ErrorState from "../shared/ErrorState";
import EmptyState from "../shared/EmptyState";

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
  return (
    <div className="bg-white mb-6 p-4 border rounded-xl h-70">
      <div className="flex justify-between items-center">
        <h2 className="font-semibold text-gray-900 text-sm">Orders</h2>
        <StatusDropdown
          options={ORDER_STATUSES}
          value={status}
          onChange={(value) => setStatus(value as OrderFilter)}
        />
      </div>

      <div className="flex justify-center items-center h-full">
        {loading && <OrdersTableSkeleton />}

        {!loading && error && <ErrorState message={error} />}

        {!loading && !error && data.length === 0 && (
          <EmptyState message="No orders found." />
        )}

        {!loading && !error && data.length > 0 && <OrdersTable data={data} />}
      </div>
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
