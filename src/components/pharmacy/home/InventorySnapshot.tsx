"use client";

import { useRouter } from "next/navigation";
import InventoryItemCard from "./InventoryItemCard";
import { useInventorySnapshot } from "@/hooks/pharmacy/useInventorySnapshot";
import ErrorState from "../shared/ErrorState";
import EmptyState from "../shared/EmptyState";

export default function InventorySnapshot() {
  const router = useRouter();
  const { data, loading, error } = useInventorySnapshot();

  return (
    <div className="bg-white p-4 border rounded-xl">
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-semibold text-gray-900 text-sm">
          Inventory Snapshot
        </h2>

        <button
          onClick={() => router.push("/pharmacy/inventory")}
          className="font-medium text-(--color-primary) text-xs"
        >
          View All →
        </button>
      </div>

      {/* Loading */}
      {loading && <InventorySnapshotSkeleton />}

      {/* Error */}
      {!loading && error && <ErrorState message={error} />}

      {/* Empty */}
      {!loading && !error && data.length === 0 && (
        <EmptyState message="No inventory items found." />
      )}

      {/* Data */}
      {!loading && !error && data.length > 0 && (
        <div className="gap-4 grid sm:grid-cols-2 lg:grid-cols-3">
          {data.map((item) => (
            <InventoryItemCard
              key={item.id}
              id={item.id}
              title={item.medicineName}
              extra={item.batchNumber}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function InventorySnapshotSkeleton() {
  return (
    <div className="gap-4 grid sm:grid-cols-2 lg:grid-cols-3 animate-pulse">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="space-y-3 p-4 border rounded-xl">
          <div className="bg-gray-200 rounded w-24 h-4" />
          <div className="bg-gray-200 rounded w-16 h-3" />
        </div>
      ))}
    </div>
  );
}
