import { PaginationMeta } from "./common";

export interface CategoryDTO {
  id: number;
  name: string;
  categoryImageUrl: string | null;
  description: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface PaginatedCategoriesResponse {
  success: boolean;
  data: CategoryDTO[];
  meta: PaginationMeta;
}

export interface Category {
  id: number;
  name: string;
  description: string | null;
  displayImage?: string;
}
