"use client";

import { searchOrders } from "@/services/pharmacyOrders";
import { SearchOrder } from "@/types/pharmacyOrders";
import { useEffect, useState, useCallback } from "react";

export function useOrdersSearch(search: string) {
  const [data, setData] = useState<SearchOrder[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchOrders = useCallback(async () => {
    if (!search.trim()) {
      setData([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await searchOrders(search);
      setData(result);
    } catch {
      setError("Failed to search orders.");
    } finally {
      setLoading(false);
    }
  }, [search]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  return {
    data,
    loading,
    error,
    refetch: fetchOrders,
  };
}
