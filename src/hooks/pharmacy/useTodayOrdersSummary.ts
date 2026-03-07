"use client";

import { useQuery } from "@tanstack/react-query";
import { getTodayDashboardAnalytics } from "@/services/pharmacyOrders";
import { TodayDashboardAnalytics } from "@/types/pharmacyOrders";
import { queryKeys } from "@/lib/queryKeys";

export function useTodayDashboardAnalytics() {
  const query = useQuery<TodayDashboardAnalytics>({
    queryKey: queryKeys.pharmacy.todayAnalytics(),

    queryFn: getTodayDashboardAnalytics,
  });

  return {
    data: query.data ?? null,
    loading: query.isLoading,
    error: query.isError ? "Failed to load dashboard analytics." : null,

    refetch: async () => {
      await query.refetch();
    },
  };
}
