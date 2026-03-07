"use client";

import { useState } from "react";

import { OrderFilter } from "@/types/pharmacyOrders";
import { useOrders } from "@/hooks/pharmacy/useOrders";

import OrdersFilters from "./OrderesFilters";
import OrdersFullTable from "./OrdersFullTable";

export default function OrdersSection() {
  const [filter, setFilter] = useState<OrderFilter>("ALL");
  const [search, setSearch] = useState("");

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const { data, isLoading, error, refetch } = useOrders({
    page,
    limit,
    filter,
    sortOrder: "desc",
    ...(search && { q: search }),
  });

  const handleStatusChange = (value: OrderFilter) => {
    setPage(1);
    setFilter(value);
  };

  const handleSearchChange = (value: string) => {
    setPage(1);
    setSearch(value);
  };

  return (
    <>
      <OrdersFilters
        status={filter}
        onStatusChange={handleStatusChange}
        search={search}
        onSearchChange={handleSearchChange}
      />

      <OrdersFullTable
        data={data?.rows ?? []}
        loading={isLoading}
        error={error ? "Failed to load orders" : null}
        refetch={refetch}
        total={data?.total ?? 0}
        page={page}
        limit={limit}
        onPageChange={setPage}
        onLimitChange={setLimit}
      />
    </>
  );
}
