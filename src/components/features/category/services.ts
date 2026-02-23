import { httpGet } from "@/lib/api";

// ============================================================
// Types
// ============================================================

export interface Category {
  id: string;
  name: string;
  image: string;
  imageAlt?: string;
  description?: string;
}

export interface SaleProduct {
  id: string;
  title: string;
  description: string;
  image: string;
  buttonText: string;
  buttonColor: "blue" | "green" | "gray" | "orange";
}

export interface Product {
  id: string;
  name: string;
  image: string;
  category: string;
  description: string;
  price?: number;
  badge?: "new" | "sale" | "popular";
}

// ============================================================
// API Response Shape
// ============================================================
// getRequest<T>() returns T directly (unwraps res.data internally).
// All endpoints are expected to return the array/object directly,
// NOT wrapped in { data: ... }.
// ============================================================

// ============================================================
// Service Functions
// ============================================================

/**
 * Fetches featured categories for the navigation/hero section.
 * @returns Category[] on success, empty array on failure.
 */
export async function getFeaturedCategories(): Promise<Category[]> {
  try {
    return await httpGet<Category[]>("/categories/featured");
  } catch {
    if (process.env.NODE_ENV === "development") {
      // Silent in production
    }
    return [];
  }
}

/**
 * Fetches all available categories.
 * @returns Category[] on success, empty array on failure.
 */
export async function getAllCategories(): Promise<Category[]> {
  try {
    return await httpGet<Category[]>("/categories/all");
  } catch {
    if (process.env.NODE_ENV === "development") {
      // Silent in production
    }
    return [];
  }
}

/**
 * Fetches a single category by its slug/name.
 * @param name - Category slug or name (URL encoded internally).
 * @returns Category on success, null on failure.
 */
export async function getCategoryByName(
  name: string,
): Promise<Category | null> {
  try {
    return await httpGet<Category>(`/categories/${encodeURIComponent(name)}`);
  } catch {
    if (process.env.NODE_ENV === "development") {
      // Silent in production
    }
    return null;
  }
}

/**
 * Fetches most-sold products for promotional display.
 * @returns SaleProduct[] on success, empty array on failure.
 */
export async function getMostSalesProducts(): Promise<SaleProduct[]> {
  try {
    return await httpGet<SaleProduct[]>("/products/most-sales");
  } catch {
    if (process.env.NODE_ENV === "development") {
      // Silent in production
    }
    return [];
  }
}

/**
 * Fetches personalized recommended products.
 * @returns Product[] on success, empty array on failure.
 */
export async function getRecommendedProducts(): Promise<Product[]> {
  try {
    return await httpGet<Product[]>("/products/recommended");
  } catch {
    if (process.env.NODE_ENV === "development") {
      // Silent in production
    }
    return [];
  }
}
