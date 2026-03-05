/**
 * API Error Normalization
 *
 * Provides a typed, consistent error shape for all API calls.
 * Handles axios errors, network errors, and unknown errors.
 */

import { AxiosError } from "axios";

// ---------------------------------------------------------------------------
// ApiError class — extends Error so instanceof checks work everywhere
// ---------------------------------------------------------------------------

export class ApiError extends Error {
  readonly status: number;
  readonly fieldErrors?: Record<string, string[]>;

  constructor(
    message: string,
    status: number,
    fieldErrors?: Record<string, string[]>,
  ) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.fieldErrors = fieldErrors;
    // Restore prototype chain (needed when targeting ES5)
    Object.setPrototypeOf(this, ApiError.prototype);
  }
}

// Keep the plain shape type for backwards compat with any code that reads it
export interface ApiErrorShape {
  /** HTTP status code (0 for network errors) */
  status: number;
  /** Human-readable error message */
  message: string;
  /** Per-field validation errors (422) */
  fieldErrors?: Record<string, string[]>;
}

// ---------------------------------------------------------------------------
// Normalizer — always returns an ApiError (which IS an Error)
// ---------------------------------------------------------------------------

/**
 * Convert any thrown value into an `ApiError` instance.
 * Because ApiError extends Error, `err instanceof Error` is always true.
 *
 * Usage:
 * ```ts
 * try { await api.post(...) }
 * catch (err) { throw normalizeError(err); }
 * ```
 */
export function normalizeError(error: unknown): ApiError {
  // Already an ApiError — pass through unchanged
  if (error instanceof ApiError) return error;

  // Axios error with a response from the server
  if (isAxiosError(error) && error.response) {
    const { status, data } = error.response;
    const message =
      (data as Record<string, unknown>)?.message ??
      (data as Record<string, unknown>)?.error ??
      httpStatusMessage(status);

    return new ApiError(
      String(message),
      status,
      extractFieldErrors(data),
    );
  }

  // Axios error without a response (network / timeout)
  if (isAxiosError(error)) {
    return new ApiError(
      error.message || "Network error — please check your connection.",
      0,
    );
  }

  // Standard JS Error
  if (error instanceof Error) {
    return new ApiError(error.message, 0);
  }

  // Unknown
  return new ApiError("An unexpected error occurred.", 0);
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function isAxiosError(value: unknown): value is AxiosError {
  return (
    typeof value === "object" &&
    value !== null &&
    "isAxiosError" in value &&
    (value as AxiosError).isAxiosError === true
  );
}

/**
 * Attempt to pull field-level errors from various common backend shapes:
 *
 *   CureWay API shape:
 *     { fields: [ { field: "email", message: "Invalid email" } ] }
 *
 *   Generic shapes:
 *     { errors: { email: ["taken"] } }
 *     { errors: [ { field: "email", message: "taken" } ] }
 */
function extractFieldErrors(
  data: unknown,
): Record<string, string[]> | undefined {
  if (!data || typeof data !== "object") return undefined;

  const obj = data as Record<string, unknown>;

  // ---- CureWay API: { fields: Array<{ field, message }> } ----------------
  if (Array.isArray(obj.fields)) {
    const map: Record<string, string[]> = {};
    for (const item of obj.fields) {
      if (item && typeof item === "object" && "field" in item) {
        const f = String((item as Record<string, unknown>).field);
        const m = String(
          (item as Record<string, unknown>).message ?? "Invalid",
        );
        (map[f] ??= []).push(m);
      }
    }
    return Object.keys(map).length > 0 ? map : undefined;
  }

  // ---- Generic: { errors: Record<string, string[]> } ---------------------
  if (
    obj.errors &&
    typeof obj.errors === "object" &&
    !Array.isArray(obj.errors)
  ) {
    return obj.errors as Record<string, string[]>;
  }

  // ---- Generic: { errors: Array<{ field, message }> } --------------------
  if (Array.isArray(obj.errors)) {
    const map: Record<string, string[]> = {};
    for (const item of obj.errors) {
      if (item && typeof item === "object" && "field" in item) {
        const f = String((item as Record<string, unknown>).field);
        const m = String(
          (item as Record<string, unknown>).message ?? "Invalid",
        );
        (map[f] ??= []).push(m);
      }
    }
    return Object.keys(map).length > 0 ? map : undefined;
  }

  return undefined;
}

function httpStatusMessage(status: number): string {
  switch (status) {
    case 400:
      return "Bad request.";
    case 401:
      return "Unauthorized — please log in.";
    case 403:
      return "Forbidden — you do not have access.";
    case 404:
      return "Resource not found.";
    case 409:
      return "Conflict — resource already exists.";
    case 422:
      return "Validation failed.";
    case 429:
      return "Too many requests — please try again later.";
    default:
      return status >= 500
        ? "Server error — please try again later."
        : "Request failed.";
  }
}
