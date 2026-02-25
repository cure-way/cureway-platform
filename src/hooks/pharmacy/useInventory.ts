import { useEffect, useState, useCallback } from "react";
import { InventoryFilterStatus, InventoryItem } from "@/types/pharmacyTypes";
import { fetchInventoryList } from "@/services/pharmacy/getInventoryList";

type UseInventoryParams = {
  status: InventoryFilterStatus;
  search: string;
};

export function useInventory({ status, search }: UseInventoryParams) {
  const [data, setData] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchInventory = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetchInventoryList({
        page: 1,
        limit: 10,
        q: search || undefined,
        stockStatus: status === "all" ? undefined : status,
      });

      setData(res.items);
    } catch (err) {
      setError("Failed to load inventory. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [search, status]);

  useEffect(() => {
    fetchInventory();
  }, [fetchInventory]);

  return {
    data,
    loading,
    error,
    refetch: fetchInventory,
  };
}
