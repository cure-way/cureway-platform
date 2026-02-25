"use client";

import { useState } from "react";
import InventoryFilters from "./InventoryFilters";
import InventoryTable from "./InventoryTable";
import { InventoryFilterStatus } from "@/types/pharmacyTypes";
import { useInventory } from "@/hooks/pharmacy/useInventory";
import AlertBanner from "./AlertBanner";
import { getInventoryAlerts } from "@/services/pharmacy/pharmacyService";

export default function InventorySection() {
  const [status, setStatus] = useState<InventoryFilterStatus>("all");
  const [search, setSearch] = useState("");

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);

  const { data, total, loading, error, refetch } = useInventory({
    status,
    search,
    page,
    limit,
  });

  const handleStatusChange = (value: InventoryFilterStatus) => {
    setPage(1);
    setStatus(value);
  };

  const handleSearchChange = (value: string) => {
    setPage(1);
    setSearch(value);
  };
  const alert = getInventoryAlerts(data);

  return (
    <>
      {alert && (
        <AlertBanner title={alert.title} description={alert.description} />
      )}
      <InventoryFilters
        status={status}
        onStatusChange={handleStatusChange}
        search={search}
        onSearchChange={handleSearchChange}
      />

      <InventoryTable
        data={data}
        loading={loading}
        error={error}
        refetch={refetch}
        total={total}
        page={page}
        limit={limit}
        onPageChange={setPage}
        onLimitChange={setLimit}
      />
    </>
  );
}
