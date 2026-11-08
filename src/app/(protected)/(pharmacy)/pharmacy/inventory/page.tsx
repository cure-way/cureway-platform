import { PageHeader } from "@/components/shared";
import { FiLayers } from "react-icons/fi";

import InventorySection from "@/components/pharmacy/inventory/InventorySection";

export default function InventoryPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Inventory Management"
        subtitle="Stock levels, prices and product details"
        icon={<FiLayers />}
      />

      <InventorySection />
    </div>
  );
}
