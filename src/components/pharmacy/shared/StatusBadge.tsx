import {
  INVENTORY_STATUS_MAP,
  ORDER_STATUS_MAP,
} from "@/utils/pharmacyConstants";

interface StatusBadgeProps {
  value: string;
  type?: "order" | "inventory";
}

export default function StatusBadge({
  value,
  type = "order",
}: StatusBadgeProps) {
  const map = type === "order" ? ORDER_STATUS_MAP : INVENTORY_STATUS_MAP;

  const config = map[value] ?? {
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
