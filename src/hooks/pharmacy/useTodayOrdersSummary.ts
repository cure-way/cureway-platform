"use client";

import { getTodayDashboardAnalytics } from "@/services/pharmacyOrders";
import { TodayDashboardAnalytics } from "@/types/pharmacyOrders";
import { useEffect, useState, useCallback } from "react";

export function useTodayDashboardAnalytics() {
  const [data, setData] = useState<TodayDashboardAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAnalytics = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const analytics = await getTodayDashboardAnalytics();
      setData(analytics);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to load dashboard analytics.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  return {
    data,
    loading,
    error,
    refetch: fetchAnalytics,
  };
}
