import {
  Day,
  InventoryItem,
  InventoryListItem,
  OrderRow,
  OrdersStatusModel,
  OrderStatusDatum,
  TopMedicine,
  WeeklyOrdersDatum,
} from "@/types/pharmacyTypes";
import { DAY_ORDER } from "@/utils/pharmacyConstants";

export function getTopSellingMedicines(
  orders: OrderRow[],
  inventory: InventoryItem[],
): TopMedicine[] {
  const inventoryMap = Object.fromEntries(
    inventory.map((item) => [item.id, item]),
  );

  const count: Record<
    string,
    { id: string; medicine: string; sold: number; orders: number }
  > = {};

  for (const order of orders) {
    const seenInThisOrder = new Set<string>();

    for (const item of order.items) {
      if (!count[item.inventoryId]) {
        count[item.inventoryId] = {
          id: item.inventoryId,
          medicine: inventoryMap[item.inventoryId]?.medicineName ?? "Unknown",
          sold: 0,
          orders: 0,
        };
      }

      // Count quantity sold
      count[item.inventoryId].sold += item.quantity;

      // Count distinct orders
      if (!seenInThisOrder.has(item.inventoryId)) {
        count[item.inventoryId].orders += 1;
        seenInThisOrder.add(item.inventoryId);
      }
    }
  }

  return Object.values(count)
    .sort((a, b) => b.sold - a.sold)
    .slice(0, 4);
}

export function getMostRequestedCategory(
  orders: OrderRow[],
  inventory: InventoryItem[],
) {
  const inventoryMap = new Map(inventory.map((i) => [i.id, i.category]));

  const counts: Record<string, number> = {};

  for (const order of orders) {
    for (const item of order.items) {
      const category = inventoryMap.get(item.inventoryId);
      if (!category) continue;

      counts[category] = (counts[category] ?? 0) + item.quantity;
    }
  }

  return Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0];
}

export function getExpiryInfo(expiryDate: string) {
  const today = new Date();
  const expiry = new Date(expiryDate);

  today.setHours(0, 0, 0, 0);
  expiry.setHours(0, 0, 0, 0);

  const diffMs = expiry.getTime() - today.getTime();
  const daysLeft = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

  if (daysLeft < 0) {
    return {
      status: "expired" as const,
      daysLeft,
      label: `Expired ${Math.abs(daysLeft) === 1 ? "yesterday" : `${Math.abs(daysLeft)} days ago`}`,
    };
  }

  if (daysLeft <= 30) {
    return {
      status: "warning" as const,
      daysLeft,
      label: `${Math.ceil(daysLeft) === 1 ? "1 day" : `${Math.ceil(daysLeft)} days`} left to expiry`,
    };
  }

  return {
    status: "safe" as const,
    daysLeft,
    label: "Not expiring soon",
  };
}

export function getOrderStatusData(orders: OrderRow[]): OrderStatusDatum[] {
  const delivered = orders.filter((o) => o.status === "Delivered").length;

  const pending = orders.filter((o) => o.status === "Pending").length;

  return [
    { name: "Delivered", value: delivered },
    { name: "Pending", value: pending },
  ];
}
export function getWeeklyOrdersData(orders: OrderRow[]): WeeklyOrdersDatum[] {
  const counts: Record<Day, number> = {
    Sun: 0,
    Mon: 0,
    Tue: 0,
    Wed: 0,
    Thu: 0,
    Fri: 0,
    Sat: 0,
  };

  orders.forEach((order) => {
    const day = new Date(order.date).toLocaleDateString("en-US", {
      weekday: "short",
    }) as Day;

    counts[day]++;
  });

  return DAY_ORDER.map((day) => ({
    day,
    orders: counts[day],
  }));
}

export function buildOrdersStatusModel(
  data: OrderStatusDatum[],
): OrdersStatusModel {
  const total = data.reduce((sum, d) => sum + d.value, 0);

  const completedCount = data.find((d) => d.name === "Delivered")?.value ?? 0;

  const pendingCount = data.find((d) => d.name === "Pending")?.value ?? 0;

  const completedPercent =
    total > 0 ? Math.round((completedCount / total) * 100) : 0;

  const pendingPercent =
    total > 0 ? Math.round((pendingCount / total) * 100) : 0;

  return {
    completedPercent,
    pendingPercent,
    outerData: [
      { name: "Completed", value: completedPercent },
      { name: "Remaining", value: 100 - completedPercent },
    ],
    innerData: [
      { name: "Pending", value: pendingPercent },
      { name: "Remaining", value: 100 - pendingPercent },
    ],
  };
}

export function getOrdersSummary(orders: OrderRow[]): {
  totalToday: number;
  delivered: number;
} {
  // For now we assume all ORDERS are "today"
  // Later we can filter by real date

  const totalToday = orders.length;

  const delivered = orders.filter(
    (order) => order.status === "Delivered",
  ).length;

  return {
    totalToday,
    delivered,
  };
}

export function getInventoryAlerts(
  items: InventoryListItem[],
): { title: string; description: string } | null {
  const outOfStockCount = items.filter(
    (item) => item.stockQuantity === 0,
  ).length;

  if (outOfStockCount === 0) return null;

  return {
    title: "Medication Out Of Stock Alert",
    description: `${outOfStockCount} medication${
      outOfStockCount > 1 ? "s are" : " is"
    } currently out of stock.`,
  };
}

export function getReportStats(orders: OrderRow[]): {
  completionRate: number;
  pendingRate: number;
  totalOrders: number;
  deliveredCount: number;
} {
  const totalOrders = orders.length;

  const deliveredCount = orders.filter(
    (order) => order.status === "Delivered",
  ).length;

  const pendingCount = orders.filter(
    (order) => order.status === "Pending",
  ).length;

  const completionRate =
    totalOrders === 0 ? 0 : Math.round((deliveredCount / totalOrders) * 100);

  const pendingRate =
    totalOrders === 0 ? 0 : Math.round((pendingCount / totalOrders) * 100);

  return {
    completionRate,
    pendingRate,
    totalOrders,
    deliveredCount,
  };
}
