import { getPharmacyReport } from "@/services/pharmacyOrders";
import {
  OrderStatusDonutDatum,
  TopMedicine,
  WeeklyOrdersDatum,
  WeeklyStats,
} from "@/types/pharmacyOrders";
import { useEffect, useState } from "react";

interface UsePharmacyReportResult {
  weeklyStats: WeeklyStats | null;
  orderStatusDonut: OrderStatusDonutDatum[] | null;
  weeklyOrdersStats: WeeklyOrdersDatum[] | null;
  topMedicines: TopMedicine[] | null;
  isLoading: boolean;
  error: string | null;
}

export function usePharmacyReport(): UsePharmacyReportResult {
  const [weeklyStats, setWeeklyStats] = useState<WeeklyStats | null>(null);
  const [orderStatusDonut, setOrderStatusDonut] = useState<
    OrderStatusDonutDatum[] | null
  >(null);
  const [weeklyOrdersStats, setWeeklyOrdersStats] = useState<
    WeeklyOrdersDatum[] | null
  >(null);
  const [topMedicines, setTopMedicines] = useState<TopMedicine[] | null>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const result = await getPharmacyReport();
        setWeeklyStats(result.weeklyStats);
        setOrderStatusDonut(result.orderStatusDonut);
        setWeeklyOrdersStats(result.weeklyOrdersStats);
        setTopMedicines(result.topMedicines);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load report");
      } finally {
        setIsLoading(false);
      }
    }

    load();
  }, []);

  return {
    weeklyStats,
    orderStatusDonut,
    weeklyOrdersStats,
    topMedicines,
    isLoading,
    error,
  };
}
