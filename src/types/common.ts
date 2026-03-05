/**
 * Common Types
 * Shared type definitions used across the application
 */

import type { ReactNode } from "react";

/**
 * Pagination parameters
 */
export interface PaginationParams {
  page: number;
  limit: number;
}

/**
 * Paginated response wrapper
 */
export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

/**
 * API response wrapper
 */
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  error?: {
    code: string;
    details?: Record<string, string[]>;
  };
}

/**
 * Sort direction
 */
export type SortDirection = "asc" | "desc";

/**
 * Sort parameters
 */
export interface SortParams {
  field: string;
  direction: SortDirection;
}

/**
 * Filter operator
 */
export type FilterOperator =
  | "eq"
  | "ne"
  | "gt"
  | "gte"
  | "lt"
  | "lte"
  | "contains"
  | "in";

/**
 * Filter item
 */
export interface FilterItem {
  field: string;
  operator: FilterOperator;
  value: string | number | boolean | (string | number)[];
}

/**
 * Date range
 */
export interface DateRange {
  from: string;
  to: string;
}

/**
 * Address type
 */
export interface Address {
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  lat?: number;
  lng?: number;
}

/**
 * Status badge variant
 */
export type StatusVariant =
  | "success"
  | "warning"
  | "error"
  | "info"
  | "default";

/**
 * Common status type
 */
export interface Status {
  id: string;
  label: string;
  variant: StatusVariant;
}

/**
 * File upload type
 */
export interface FileUpload {
  id: string;
  name: string;
  url: string;
  type: string;
  size: number;
  uploadedAt: string;
}

/**
 * Notification type
 */
export interface Notification {
  id: string;
  title: string;
  message: string;
  type: "info" | "success" | "warning" | "error";
  isRead: boolean;
  createdAt: string;
  link?: string;
}

/**
 * Base entity with timestamps
 */
export interface BaseEntity {
  id: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Select option for dropdowns
 */
export interface SelectOption<T = string> {
  value: T;
  label: string;
  disabled?: boolean;
}

/**
 * Tab item
 */
export interface TabItem {
  id: string;
  label: string;
  icon?: ReactNode;
  badge?: number | string;
  disabled?: boolean;
}

export interface PaginationMeta {
  total: number;
  limit: number;
  page: number;
  totalPages: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
}
