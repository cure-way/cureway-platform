"use client";

import { useQuery } from "@tanstack/react-query";
import type { InventoryItem } from "@/types/pharmacyTypes";
import { getInventorySnapshot } from "@/services/pharmacyInventory";
import { queryKeys } from "@/lib/queryKeys";

export function useInventorySnapshot() {
  const query = useQuery<InventoryItem[]>({
    queryKey: queryKeys.pharmacy.inventorySnapshot(),
    queryFn: getInventorySnapshot,
  });

  return {
    data: query.data ?? [],
    loading: query.isLoading,
    error: query.isError ? "Failed to load inventory snapshot." : null,

    refetch: async () => {
      await query.refetch();
    },
  };
}
