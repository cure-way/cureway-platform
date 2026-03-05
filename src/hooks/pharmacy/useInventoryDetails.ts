"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchInventoryItem } from "@/services/pharmacyInventory";
import { InventoryItem } from "@/types/pharmacyTypes";
import { queryKeys } from "@/lib/queryKeys";

export function useInventoryDetails(id: string | null) {
  const queryClient = useQueryClient();

  const query = useQuery<InventoryItem>({
    queryKey: id
      ? queryKeys.pharmacy.inventoryDetail(Number(id))
      : ["pharmacy", "inventory", "detail", "null"],

    queryFn: () => fetchInventoryItem(id as string),

    enabled: !!id,
  });

  return {
    data: query.data ?? null,
    loading: query.isLoading,
    error: query.isError ? "Failed to load medicine details." : null,

    refetch: async () => {
      await query.refetch();
    },

    setData: (item: InventoryItem) => {
      if (!id) return;

      queryClient.setQueryData(
        queryKeys.pharmacy.inventoryDetail(Number(id)),
        item,
      );
    },
  };
}
