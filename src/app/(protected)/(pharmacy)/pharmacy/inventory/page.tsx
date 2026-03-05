import PageHeader from "@/components/pharmacy/shared/PageHeader";
import { FiLayers } from "react-icons/fi";

import InventorySection from "@/components/pharmacy/inventory/InventorySection";

export default function InventoryPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Inventory Management" icon={FiLayers} />

      <InventorySection />
    </div>
  );
}
