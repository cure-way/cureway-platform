import OrdersSection from "@/components/pharmacy/orders/OrdersSection";
import { PageHeader } from "@/components/shared";
import { FiFileText } from "react-icons/fi";

export default function OrdersPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Orders Management"
        subtitle="Review, accept and fulfil incoming orders"
        icon={<FiFileText />}
      />

      <OrdersSection />
    </div>
  );
}
