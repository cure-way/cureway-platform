//===================================================================//
// ORDER PHARMACY GROUP COMPONENT (for Order Confirmation)
// ===================================================================


import {  MapPin } from "lucide-react";
import Image from "next/image";
import { formatCurrency } from "@/utils/cart.utils";



interface OrderPharmacyGroupProps {
  group: {
    pharmacy: {
      id: string;
      name: string;
      address: string;
    };
    items: any[];
    subtotal: number;
  };
}

export function OrderPharmacyGroup({ group }: OrderPharmacyGroupProps) {
  const displayItems = group.items.slice(0, 4);
  const remainingCount = group.items.length - 4;

  return (
    <div className="bg-neutral-light/50 rounded-xl p-4">
      <div className="flex items-start gap-4">
        {/* Product Images */}
        <div className="relative">
          <div className="flex items-center gap-1 bg-white p-3 rounded-lg">
            {displayItems.map((item, index) => (
              <div
                key={item.id}
                className="w-12 h-12 flex items-center justify-center"
                style={{ marginLeft: index > 0 ? "-8px" : "0" }}
              >
                <Image
                  src={item.image}
                  alt={item.name}
                  width={40}
                  height={40}
                  className="object-contain"
                />
              </div>
            ))}
            {remainingCount > 0 && (
              <div className="w-12 h-12 flex items-center justify-center -ml-2">
                <div className="w-10 h-10 rounded-full bg-primary text-white text-t-12 font-bold flex items-center justify-center">
                  +{remainingCount}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Pharmacy Info */}
        <div className="flex-1">
          <h3 className="text-t-17 font-semibold text-foreground mb-1">
            {group.pharmacy.name}
          </h3>
          <div className="flex items-center gap-2 text-t-14 text-muted-foreground mb-2">
            <MapPin size={14} />
            <span>{group.pharmacy.address}</span>
          </div>
          <p className="text-t-14 text-muted-foreground">
            {group.items.length} items | {formatCurrency(group.subtotal)}
          </p>
        </div>
      </div>
    </div>
  );
}