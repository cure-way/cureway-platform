import { WeeklyStats } from "@/types/pharmacyOrders";
import { StatCard } from "./StatCard";

interface StateGridProps {
  stats: WeeklyStats | null;
}

export default function StateGrid({ stats }: StateGridProps) {
  if (!stats) return null;

  const cards = [
    {
      title: "Order Completion Rate",
      value: `${stats.completionRate}%`,
      subtitle: `${stats.deliveredCount} of ${stats.totalOrders} orders delivered`,
    },
    {
      title: "Pending Orders Rate",
      value: `${stats.pendingRate}%`,
      subtitle: "Orders awaiting processing",
    },
    {
      title: "Total Orders",
      value: stats.totalOrders.toString(),
      subtitle: "Last 7 days",
    },
    {
      title: "Delivered Orders",
      value: stats.deliveredCount.toString(),
      subtitle: "Last 7 days",
    },
  ];

  return (
    <div className="gap-4 grid grid-cols-2 grow">
      {cards.map((card) => (
        <StatCard
          key={card.title}
          title={card.title}
          value={card.value}
          subtitle={card.subtitle}
        />
      ))}
    </div>
  );
}
