import { useEffect, useState, useCallback } from "react";
import { InventoryFilterStatus, InventoryItem } from "@/types/pharmacyTypes";
import { fetchInventoryList } from "@/services/pharmacy/getInventoryList";

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
  const [data, setData] = useState<InventoryItem[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchInventory = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetchInventoryList({
        page,
        limit,
        q: search || undefined,
        stockStatus: status === "all" ? undefined : status,
      });

      setData(res.items);
      setTotal(res.total);
    } catch (err) {
      setError("Failed to load inventory. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [search, status, page, limit]);

  useEffect(() => {
    fetchInventory();
  }, [fetchInventory]);

  return {
    data,
    total,
    loading,
    error,
    refetch: fetchInventory,
  };
}
