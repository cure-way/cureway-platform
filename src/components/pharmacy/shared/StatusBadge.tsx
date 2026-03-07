import { OrderStatus } from "@/types/pharmacyOrders";
import { InventoryStatus } from "@/types/pharmacyTypes";
import {
  INVENTORY_STATUS_MAP,
  ORDER_STATUS_MAP,
} from "@/utils/pharmacyConstants";

interface StatusBadgeProps {
  value: OrderStatus | InventoryStatus;
  type?: "order" | "inventory";
}

export default function StatusBadge({
  value,
  type = "order",
}: StatusBadgeProps) {
  if (type === "order") {
    const config = ORDER_STATUS_MAP[value as OrderStatus] ?? {
      label: value,
      className: "bg-gray-100 text-gray-600",
    };

    return (
      <span
        className={`inline-flex rounded-full px-4 py-1.5 text-xs font-medium ${config.className}`}
      >
        {config.label}
      </span>
    );
  }

  const config = INVENTORY_STATUS_MAP[value as InventoryStatus] ?? {
    label: value,
    className: "bg-gray-100 text-gray-600",
  };

  return (
    <span
      className={`inline-flex rounded-full px-4 py-1.5 text-xs font-medium ${config.className}`}
    >
      {config.label}
    </span>
  );
}
