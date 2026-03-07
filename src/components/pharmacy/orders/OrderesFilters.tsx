"use client";

import { Search } from "lucide-react";
import StatusDropdown from "../shared/StatusDropdown";
import { ORDER_STATUSES } from "@/utils/pharmacyConstants";
import { OrderFilter } from "@/types/pharmacyOrders";

interface OrdersFiltersProps {
  status: OrderFilter;
  onStatusChange: (value: OrderFilter) => void;

  search: string;
  onSearchChange: (value: string) => void;
}

export default function OrdersFilters({
  status,
  onStatusChange,
  search,
  onSearchChange,
}: OrdersFiltersProps) {
  return (
    <div className="flex flex-wrap justify-end items-center gap-3">
      <div className="relative flex flex-1 items-center bg-(--color-secondary-light) border rounded-lg">
        <Search className="left-3 absolute w-4 h-4 text-gray-500 pointer-events-none" />
        <input
          type="text"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search Medicine..."
          className="bg-transparent py-2 pr-3 pl-9 outline-none w-full text-sm"
        />
      </div>

      <StatusDropdown
        options={ORDER_STATUSES}
        value={status}
        onChange={onStatusChange}
      />
    </div>
  );
}
