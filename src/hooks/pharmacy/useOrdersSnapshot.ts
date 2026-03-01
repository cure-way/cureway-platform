"use client";

import { getOrdersSnapshot } from "@/services/pharmacyOrders";
import { Order, OrderFilter } from "@/types/pharmacyOrders";
import { useEffect, useState, useCallback } from "react";

export function useOrdersSnapshot(filter?: OrderFilter) {
  const [data, setData] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const orders = await getOrdersSnapshot(filter);
      setData(orders);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load orders.");
    } finally {
      setLoading(false);
    }
  }, [filter]);

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
