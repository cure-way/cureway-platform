"use client";

import { ORDERS } from "@/services/pharmacyData";
import { getOrdersSummary } from "@/services/pharmacy/pharmacyService";
import { FiFileText, FiBox } from "react-icons/fi";

export default function OrdersSummaryCards() {
  const { totalToday, delivered } = getOrdersSummary(ORDERS);

  const cards = [
    {
      label: "All Orders",
      value: totalToday,
      unit: "orders",
      icon: FiFileText,
    },
    {
      label: "Orders Delivered",
      value: delivered,
      unit: "orders",
      icon: FiBox,
    },
  ];

  return (
    <div className="gap-4 grid sm:grid-cols-2 mb-6">
      {cards.map((card) => {
        const Icon = card.icon;

        return (
          <div
            key={card.label}
            className="flex items-center gap-4 bg-white p-4 border rounded-xl"
          >
            <div className="flex justify-center items-center bg-blue-50 rounded-lg w-10 h-10 text-(--color-primary)">
              <Icon className="text-lg" />
            </div>

            <div>
              <p className="text-gray-500 text-sm">{card.label}</p>
              <p className="font-semibold text-gray-900 text-lg">
                {card.value}{" "}
                <span className="font-normal text-gray-500 text-sm">
                  {card.unit}
                </span>
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
