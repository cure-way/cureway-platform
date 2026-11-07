"use client";

import { WeeklyOrdersDatum } from "@/types/pharmacyOrders";
import {
  BarChart,
  Bar,
  XAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

export function WeeklyOrdersBar({
  data,
}: {
  data: WeeklyOrdersDatum[] | null;
}) {
  const totalOrdersThisWeek = data?.reduce((sum, d) => sum + d.orders, 0);

  return (
    <div className="h-80 flex flex-col">
      <h2 className="mb-4 font-medium text-sm text-center">
        {totalOrdersThisWeek} Orders This Week
      </h2>

      {/* ResponsiveContainer needs a parent with a resolved height. Inside the
          h-80 box the heading took part of it, so the container measured a
          negative height and recharts warned on every render. */}
      <div className="flex-1 min-h-0">
        <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data ?? []}>
          <CartesianGrid
            strokeDasharray="3 3"
            vertical={false}
            stroke="#e5e7eb"
          />
          <XAxis
            dataKey="label"
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 12, fill: "#6b7280" }}
          />

          <Tooltip
            formatter={(value) => [`${Number(value ?? 0)} orders`, ""]}
            separator=""
            contentStyle={{
              backgroundColor: "#ffffff",
              border: "1px solid #e5e7eb",
              borderRadius: "10px",
              padding: "6px 12px",
              fontSize: "12px",
              boxShadow: "0 6px 18px rgba(0,0,0,0.08)",
            }}
            cursor={{ fill: "rgba(30,64,175,0.06)" }}
          />

          <Bar
            dataKey="orders"
            radius={[8, 8, 0, 0]}
            fill="var(--color-primary)"
            animationDuration={800}
          />
        </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
