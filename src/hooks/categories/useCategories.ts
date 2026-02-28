"use client";

import { getCategories } from "@/services/categoriesService";
import { Category } from "@/types/categories.types";
import { useEffect, useState } from "react";

interface CategoriesState {
  categories: Category[];
  loading: boolean;
  error: string | null;
}

export function useCategories(page = 1, limit = 50): CategoriesState {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const res = await getCategories(page, limit);
        setCategories(res.categories);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load categories",
        );
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [page, limit]);

  return { categories, loading, error };
}
