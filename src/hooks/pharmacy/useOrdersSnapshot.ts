"use client";

import { useQuery } from "@tanstack/react-query";
import { getOrdersSnapshot } from "@/services/pharmacyOrders";
import { Order, OrderFilter } from "@/types/pharmacyOrders";
import { queryKeys } from "@/lib/queryKeys";

export function useOrdersSnapshot(filter?: OrderFilter) {
  const query = useQuery<Order[]>({
    queryKey: queryKeys.pharmacy.ordersSnapshot(filter),

    queryFn: () => getOrdersSnapshot(filter),

    placeholderData: (previous) => previous,
  });

  return {
    data: query.data ?? [],
    loading: query.isLoading,
    error: query.isError ? "Failed to load orders." : null,

    refetch: async () => {
      await query.refetch();
    },
  };
}
