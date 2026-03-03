"use client";

import { PieChart, Pie, Tooltip, Cell } from "recharts";

import { OrdersStatusInfo } from "./OrdersStatusInfo";
import { OrderStatusDonutDatum } from "@/types/pharmacyOrders";
import { buildOrdersStatusModel } from "@/services/pharmacyOrders";

export function OrdersStatusDonut({
  data,
}: {
  data: OrderStatusDonutDatum[] | null;
}) {
  const { completedPercent, pendingPercent, outerData, innerData } =
    buildOrdersStatusModel(data ?? []);

  return (
    <div className="flex flex-col items-center">
      <div className="relative flex justify-center items-center">
        <PieChart width={200} height={200}>
          <Tooltip
            formatter={(value) => `${Number(value ?? 0)}%`}
            separator=": "
            contentStyle={{
              backgroundColor: "#ffffff",
              border: "1px solid #e5e7eb",
              borderRadius: "10px",
              padding: "6px 12px",
              fontSize: "12px",
              boxShadow: "0 6px 18px rgba(0,0,0,0.08)",
            }}
            itemStyle={{
              color: "#111827",
              fontWeight: 500,
            }}
            cursor={{ fill: "rgba(30,64,175,0.06)" }}
          />

          {/* OUTER RING */}
          <Pie
            data={outerData}
            dataKey="value"
            startAngle={90}
            endAngle={-270}
            innerRadius={80}
            outerRadius={88}
            stroke="none"
            cornerRadius={8}
          >
            <Cell fill="var(--color-primary)" />
            <Cell fill="#e5e7eb" />
          </Pie>

          {/* INNER RING */}
          <Pie
            data={innerData}
            dataKey="value"
            startAngle={90}
            endAngle={-270}
            innerRadius={60}
            outerRadius={68}
            stroke="none"
            cornerRadius={8}
          >
            <Cell fill="var(--color-secondary)" />
            <Cell fill="#e5e7eb" />
          </Pie>
        </PieChart>

        <div className="absolute text-center pointer-events-none">
          <p className="text-gray-500 text-sm">Orders</p>
        </div>
      </div>

      <OrdersStatusInfo
        completedPercent={completedPercent}
        pendingPercent={pendingPercent}
      />
    </div>
  );
}
