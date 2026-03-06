import OrdersSection from "@/components/pharmacy/orders/OrdersSection";
import PageHeader from "@/components/pharmacy/shared/PageHeader";
import { FiFileText } from "react-icons/fi";

export default function OrdersPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Orders Management" icon={FiFileText} />

      <OrdersSection />
    </div>
  );
}
