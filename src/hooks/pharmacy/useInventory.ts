"use client";

import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { InventoryFilterStatus } from "@/types/pharmacyTypes";
import { fetchInventoryList } from "@/services/pharmacyInventory";
import { queryKeys } from "@/lib/queryKeys";

type UseInventoryParams = {
  status: InventoryFilterStatus;
  search: string;
  page: number;
  limit: number;
};

export function useInventory({
  status,
  search,
  page,
  limit,
}: UseInventoryParams) {
  const query = useQuery({
    queryKey: queryKeys.pharmacy.inventory(status, search, page, limit),

    queryFn: async () => {
      return fetchInventoryList({
        page,
        limit,
        q: search || undefined,
        stockStatus: status === "all" ? undefined : status,
      });
    },

    placeholderData: keepPreviousData,
  });

  return {
    data: query.data?.items ?? [],
    total: query.data?.total ?? 0,
    loading: query.isLoading,
    error: query.isError ? "Failed to load inventory. Please try again." : null,
    refetch: async () => {
      await query.refetch();
    },
  };
}
