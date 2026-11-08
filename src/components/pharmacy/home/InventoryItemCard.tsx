"use client";

import { useRouter } from "next/navigation";
import { FaPills } from "react-icons/fa";

interface InventoryItemCardProps {
  id: string;
  title: string;
  extra: string;
}

export default function InventoryItemCard({
  id,
  title,
  extra,
}: InventoryItemCardProps) {
  const router = useRouter();

  return (
    <div
      onClick={() => router.push(`/pharmacy/inventory/${id}`)}
      className="flex items-center gap-3 hover:bg-gray-50 p-3 border rounded-lg transition cursor-pointer"
    >
      {/* Icon */}
      <div className="flex justify-center items-center bg-(--color-secondary-light) rounded-lg w-10 h-10 text-(--color-primary)">
        <FaPills className="text-t-17" />
      </div>

      {/* Text */}
      <div>
        <p className="font-medium text-gray-900 text-t-14">{title}</p>
        <p className="text-(--color-secondary-dark) text-t-12">{extra}</p>
      </div>
    </div>
  );
}
