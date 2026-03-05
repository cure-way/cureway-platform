"use client";

import { useQuery } from "@tanstack/react-query";
import { searchOrders } from "@/services/pharmacyOrders";
import { SearchOrder } from "@/types/pharmacyOrders";
import { queryKeys } from "@/lib/queryKeys";

export function useOrdersSearch(search: string) {
  const query = useQuery<SearchOrder[]>({
    queryKey: queryKeys.pharmacy.ordersSearch(search),

    queryFn: () => searchOrders(search),

    enabled: Boolean(search.trim()),

    placeholderData: (previous) => previous,
  });

  return {
    data: search.trim() ? (query.data ?? []) : [],
    loading: query.isLoading,
    error: query.isError ? "Failed to search orders." : null,

    refetch: async () => {
      await query.refetch();
    },
  };
}
