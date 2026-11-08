"use client";

import { useParams } from "next/navigation";

export default function OrderDetailsPage() {
  const params = useParams();
  return (
    <div>
      <h1 className="mb-4 text-page-title text-primary-darker">
        Order Details
      </h1>
      <p>Details for order {params.orderId} will be shown here.</p>
    </div>
  );
}
