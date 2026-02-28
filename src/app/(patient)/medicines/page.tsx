"use client";

import { useState } from "react";
import ProductGrid from "@/components/patient/categories/ProductGrid";

import { useMedicines } from "@/hooks/categories/useMedicines";
import Pagination from "@/components/patient/shared/Pagination";

export default function MedicinesPage() {
  const [page, setPage] = useState(1);
  const limit = 10;

  const { medicines, loading, error, totalPages } = useMedicines(page, limit);

  return (
    <div className="space-y-8 px-6 lg:px-16 py-8">
      <div>
        <h1 className="font-bold text-2xl">Medicines</h1>
        <p className="text-gray-600">Browse all available medicines</p>
      </div>

      <ProductGrid medicines={medicines} loading={loading} error={error} />

      {/* Pagination */}
      <Pagination
        currentPage={page}
        totalPages={totalPages}
        onPageChange={setPage}
      />
    </div>
  );
}
