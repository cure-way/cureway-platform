"use client";

import { useQuery } from "@tanstack/react-query";
import type { InventoryItem } from "@/types/pharmacyTypes";
import { getCriticalStockItems } from "@/services/pharmacyInventory";
import { queryKeys } from "@/lib/queryKeys";

export function useCriticalStock() {
  const query = useQuery<InventoryItem[]>({
    queryKey: queryKeys.pharmacy.criticalStock(),
    queryFn: getCriticalStockItems,
  });

  return {
    data: query.data ?? [],
    loading: query.isLoading,
    error: query.isError ? "Failed to load stock alerts." : null,

    refetch: async () => {
      await query.refetch();
    },
  };
}
