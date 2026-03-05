"use client";

import { useQuery } from "@tanstack/react-query";
import { SearchMedicine } from "@/types/pharmacyTypes";
import { searchInventory } from "@/services/pharmacyInventory";
import { queryKeys } from "@/lib/queryKeys";

export function useInventorySearch(search: string) {
  const query = useQuery<SearchMedicine[]>({
    queryKey: queryKeys.pharmacy.inventorySearch(search),

    queryFn: () => searchInventory(search),

    enabled: !!search.trim(),
  });

  return {
    data: query.data ?? [],
    loading: query.isLoading,
    error: query.isError ? "Failed to search medicines." : null,

    refetch: async () => {
      await query.refetch();
    },
  };
}
