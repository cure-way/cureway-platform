"use client";

import { useQuery } from "@tanstack/react-query";
import { getPharmacyReport } from "@/services/pharmacyOrders";
import {
  OrderStatusDonutDatum,
  TopMedicine,
  WeeklyOrdersDatum,
  WeeklyStats,
} from "@/types/pharmacyOrders";
import { queryKeys } from "@/lib/queryKeys";

interface PharmacyReportResponse {
  weeklyStats: WeeklyStats;
  orderStatusDonut: OrderStatusDonutDatum[];
  weeklyOrdersStats: WeeklyOrdersDatum[];
  topMedicines: TopMedicine[];
}

interface UsePharmacyReportResult {
  weeklyStats: WeeklyStats | null;
  orderStatusDonut: OrderStatusDonutDatum[] | null;
  weeklyOrdersStats: WeeklyOrdersDatum[] | null;
  topMedicines: TopMedicine[] | null;
  isLoading: boolean;
  error: string | null;
}

export function usePharmacyReport(): UsePharmacyReportResult {
  const query = useQuery<PharmacyReportResponse>({
    queryKey: queryKeys.pharmacy.report(),

    queryFn: getPharmacyReport,
  });

  return {
    weeklyStats: query.data?.weeklyStats ?? null,
    orderStatusDonut: query.data?.orderStatusDonut ?? null,
    weeklyOrdersStats: query.data?.weeklyOrdersStats ?? null,
    topMedicines: query.data?.topMedicines ?? null,

    isLoading: query.isLoading,
    error: query.isError ? "Failed to load report" : null,
  };
}
