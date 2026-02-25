import { getReportStats } from "@/services/pharmacy/pharmacyService";
import { StatCard } from "./StatCard";
import { ORDERS } from "@/services/pharmacyData";

export default function StateGrid() {
  const { completionRate, pendingRate, totalOrders, deliveredCount } =
    getReportStats(ORDERS);

  const cards = [
    {
      title: "Order Completion Rate",
      value: `${completionRate}%`,
      subtitle: `${deliveredCount} of ${totalOrders} orders delivered`,
    },
    {
      title: "Pending Orders Rate",
      value: `${pendingRate}%`,
      subtitle: "Orders awaiting processing",
    },
    {
      title: "Total Orders",
      value: totalOrders.toString(),
      subtitle: "All recorded orders",
    },
    {
      title: "Delivered Orders",
      value: deliveredCount.toString(),
      subtitle: "Successfully completed",
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
