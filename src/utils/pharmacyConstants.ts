import {
  Column,
  InventoryFilterStatus,
  InventoryItem,
  OrderRow,
  RowAction,
  StatusConfig,
} from "@/types/pharmacyTypes";

export const INVENTORY_STATUSES: {
  label: string;
  value: InventoryFilterStatus;
}[] = [
  { label: "All", value: "all" },
  { label: "In Stock", value: "IN_STOCK" },
  { label: "Low Stock", value: "LOW_STOCK" },
  { label: "Out of Stock", value: "OUT_OF_STOCK" },
];

export const ORDER_STATUSES = [
  { label: "All", value: "All" },
  { label: "New", value: "New" },
  { label: "Pending", value: "Pending" },
  { label: "Delivered", value: "Delivered" },
  { label: "Cancelled", value: "Cancelled" },
];

export const ROWS_PER_PAGE_OPTIONS = [
  { label: "5", value: "5" },
  { label: "10", value: "10" },
  { label: "20", value: "20" },
];

export const inventoryColumns: Column<InventoryItem>[] = [
  { key: "id", header: "ID" },
  { key: "medicineName", header: "Medicine" },
  { key: "brand", header: "Brand", hideOnMobile: true },
  { key: "stock", header: "Stock", hideOnMobile: true },
  { key: "expiryDate", header: "Expiration", hideOnMobile: true },
  { key: "status", header: "Status" },
  { key: "action", header: "" },
];

export const INVENTORY_ACTIONS: RowAction[] = [
  { id: "view", label: "View details" },
  { id: "mark_out", label: "Mark as out of stock" },
  { id: "delete", label: "Delete medicine", danger: true },
];

export const orderColumns: readonly Column<OrderRow>[] = [
  { key: "id", header: "Order ID" },
  { key: "customer", header: "Customer", hideOnMobile: true },
  { key: "items", header: "Medicine", hideOnMobile: true },
  { key: "total", header: "Total" },
  { key: "date", header: "Date", hideOnMobile: true },
  { key: "status", header: "Status" },
];

export const DAY_ORDER = [
  "Sun",
  "Mon",
  "Tue",
  "Wed",
  "Thu",
  "Fri",
  "Sat",
] as const;

export const ORDER_STATUS_MAP: Record<string, StatusConfig> = {
  New: {
    label: "New",
    className: "bg-blue-100 text-blue-700",
  },
  Delivered: {
    label: "Delivered",
    className: "bg-green-100 text-green-700",
  },
  Pending: {
    label: "Pending",
    className: "bg-yellow-100 text-yellow-700",
  },
  Cancelled: {
    label: "Cancelled",
    className: "bg-red-100 text-red-700",
  },
};

export const INVENTORY_STATUS_MAP: Record<string, StatusConfig> = {
  in: {
    label: "In Stock",
    className: "bg-green-100 text-green-700",
  },
  low: {
    label: "Low Stock",
    className: "bg-yellow-100 text-yellow-700",
  },
  out: {
    label: "Out of Stock",
    className: "bg-red-100 text-red-700",
  },
};
