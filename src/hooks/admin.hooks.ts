import { useCallback, useEffect, useState } from "react";
import { useAuth } from "@/features/auth";
import type { PaginationMeta } from "@/services/admin.service";
import {
  getAdminPatients,
  getAdminPharmacies,
  getAdminOrders,
  getAdminMedicines,
  getAdminDrivers,
  getAdminDeliveries,
  getAdminInventory,
  type AdminPatient,
  type AdminPharmacy,
  type AdminOrder,
  type AdminMedicine,
  type AdminDriver,
  type AdminDelivery,
  type AdminInventoryItem,
} from "@/services/admin.service";

/* ===================================================================
   Generic paginated-list hook
   =================================================================== */

interface UseAdminListReturn<T> {
  data: T[];
  meta: PaginationMeta;
  loading: boolean;
  error: string | null;
  page: number;
  limit: number;
  search: string;
  setPage: (p: number) => void;
  setLimit: (l: number) => void;
  setSearch: (q: string) => void;
  refetch: () => void;
}

function useAdminList<T>(
  fetcher: (params: Record<string, unknown>) => Promise<{ data: T[]; meta: PaginationMeta }>,
  extraParams: Record<string, unknown> = {},
): UseAdminListReturn<T> {
  const { isLoading: authLoading } = useAuth();
  const [data, setData] = useState<T[]>([]);
  const [meta, setMeta] = useState<PaginationMeta>({ total: 0, limit: 10, page: 1, totalPages: 1 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState("");

  const fetchData = useCallback(async () => {
    if (authLoading) return;
    setLoading(true);
    setError(null);
    try {
      const params: Record<string, unknown> = { page, limit, ...extraParams };
      if (search.trim()) params.q = search.trim();
      const res = await fetcher(params);
      setData(res.data);
      setMeta(res.meta);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch data");
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authLoading, page, limit, search, JSON.stringify(extraParams)]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleSetSearch = useCallback((q: string) => {
    setSearch(q);
    setPage(1);
  }, []);

  const handleSetLimit = useCallback((l: number) => {
    setLimit(l);
    setPage(1);
  }, []);

  return {
    data,
    meta,
    loading,
    error,
    page,
    limit,
    search,
    setPage,
    setLimit: handleSetLimit,
    setSearch: handleSetSearch,
    refetch: fetchData,
  };
}

/* ===================================================================
   Concrete hooks
   =================================================================== */

export function useAdminPatients(params: { status?: string } = {}) {
  return useAdminList<AdminPatient>(
    (p) => getAdminPatients(p as Parameters<typeof getAdminPatients>[0]),
    params,
  );
}

export function useAdminPharmacies(params: { verificationStatus?: string; userStatus?: string } = {}) {
  return useAdminList<AdminPharmacy>(
    (p) => getAdminPharmacies(p as Parameters<typeof getAdminPharmacies>[0]),
    params,
  );
}

export function useAdminOrders(params: { status?: string } = {}) {
  return useAdminList<AdminOrder>(
    (p) => getAdminOrders(p as Parameters<typeof getAdminOrders>[0]),
    params,
  );
}

export function useAdminMedicines(params: { categoryId?: number; status?: string; isActive?: boolean } = {}) {
  return useAdminList<AdminMedicine>(
    (p) => getAdminMedicines(p as Parameters<typeof getAdminMedicines>[0]),
    params,
  );
}

export function useAdminDrivers(params: { verificationStatus?: string; userStatus?: string; availabilityStatus?: string } = {}) {
  return useAdminList<AdminDriver>(
    (p) => getAdminDrivers(p as Parameters<typeof getAdminDrivers>[0]),
    params,
  );
}

export function useAdminDeliveries(params: { status?: string; driverId?: number } = {}) {
  return useAdminList<AdminDelivery>(
    (p) => getAdminDeliveries(p as Parameters<typeof getAdminDeliveries>[0]),
    params,
  );
}

export function useAdminInventory(params: { pharmacyId?: number; medicineId?: number; isAvailable?: boolean } = {}) {
  return useAdminList<AdminInventoryItem>(
    (p) => getAdminInventory(p as Parameters<typeof getAdminInventory>[0]),
    params,
  );
}
