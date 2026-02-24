"use client";

import { useState } from "react";
import InventoryFilters from "./InventoryFilters";
import InventoryTable from "./InventoryTable";
import { InventoryFilterStatus } from "@/types/pharmacyTypes";
import { useInventory } from "@/hooks/pharmacy/useInventory";
import AlertBanner from "./AlertBanner";
import { getInventoryAlerts } from "@/services/pharmacyService";

export default function InventorySection() {
  const [status, setStatus] = useState<InventoryFilterStatus>("all");
  const [search, setSearch] = useState("");

  const { data, loading, error, refetch } = useInventory({
    status,
    search,
  });

  const alert = getInventoryAlerts(data);

  return (
    <>
      {alert && (
        <AlertBanner title={alert.title} description={alert.description} />
      )}
      <InventoryFilters
        status={status}
        onStatusChange={setStatus}
        search={search}
        onSearchChange={setSearch}
      />

      <InventoryTable
        data={data}
        loading={loading}
        error={error}
        onRetry={refetch}
      />
    </>
  );
}
