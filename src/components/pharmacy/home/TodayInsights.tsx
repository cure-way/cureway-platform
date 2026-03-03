"use client";

interface Props {
  topMedicine?: string | null;
}

export default function TodayInsights({ topMedicine }: Props) {
  const todaySummaryItems = [
    {
      id: "top-medicine",
      title: "Top Selling Medicine",
      value: topMedicine ?? "—",
    },
  ];

  if (!topMedicine) return null;

  return (
    <div>
      <h3 className="mb-3 font-semibold text-gray-900 text-sm">
        Today Summary
      </h3>

      <div className="space-y-3">
        {todaySummaryItems.map((item) => (
          <div
            key={item.id}
            className="flex items-start gap-2 p-3 border rounded-xl"
          >
            <span className="text-green-600">✔</span>

            <div>
              <p className="mb-1 font-medium text-gray-900 text-sm">
                {item.title}
              </p>
              <p className="text-gray-500 text-xs">{item.value}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
