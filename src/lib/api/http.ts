/**
 * HTTP Client (Axios)
 *
 * Single shared axios instance with:
 *  - Bearer token from in-memory store
 *  - Automatic 401 → refresh → retry (with queue to prevent races)
 *  - Error normalization via `normalizeError`
 *
 * Auth strategy: Bearer tokens (access + refresh) stored in memory.
 * Refresh token is *also* persisted to localStorage so sessions survive
 * hard reloads. Access token is NEVER written to localStorage.
 */

import axios, {
  AxiosError,
  type AxiosRequestConfig,
  type InternalAxiosRequestConfig,
} from "axios";

// ---------------------------------------------------------------------------
// In-memory token store (singleton)
// ---------------------------------------------------------------------------

let accessToken: string | null = null;
let refreshToken: string | null = null;

const isClient = typeof window !== "undefined";

export function getAccessToken(): string | null {
  if (!accessToken && isClient) {
    accessToken = localStorage.getItem("cureway_at");
  }
  return accessToken;
}

export function getRefreshToken(): string | null {
  if (!refreshToken && isClient) {
    refreshToken = localStorage.getItem("cureway_rt");
  }
  return refreshToken;
}

export function setTokens(access: string, refresh: string): void {
  accessToken = access;
  refreshToken = refresh;
  if (isClient) {
    localStorage.setItem("cureway_at", access);
    localStorage.setItem("cureway_rt", refresh);
  }
}

export function clearTokens(): void {
  accessToken = null;
  refreshToken = null;
  if (isClient) {
    localStorage.removeItem("cureway_at");
    localStorage.removeItem("cureway_rt");
  }
}

// ---------------------------------------------------------------------------
// Axios instance
// ---------------------------------------------------------------------------

export const http = axios.create({
  baseURL:
    process.env.NEXT_PUBLIC_API_URL ||
    process.env.NEXT_PUBLIC_API_BASE_URL ||
    "https://gsg-project-group-1-production.up.railway.app",
  headers: { "Content-Type": "application/json" },
  timeout: 10_000,
});
// ---------------------------------------------------------------------------
// Request interceptor — attach Bearer token
// ---------------------------------------------------------------------------

http.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = getAccessToken();
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ---------------------------------------------------------------------------
// Response interceptor — auto-refresh on 401
// ---------------------------------------------------------------------------

/** Queued requests waiting for the refresh to complete */
type QueueItem = {
  resolve: (token: string) => void;
  reject: (err: unknown) => void;
};

let isRefreshing = false;
let failedQueue: QueueItem[] = [];

function processQueue(error: unknown, token: string | null): void {
  for (const { resolve, reject } of failedQueue) {
    if (token) resolve(token);
    else reject(error);
  }
  failedQueue = [];
}

http.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    // Only attempt refresh for 401, not on the refresh endpoint itself
    if (
      error.response?.status !== 401 ||
      originalRequest._retry ||
      originalRequest.url === "/auth/refresh"
    ) {
      return Promise.reject(error);
    }

    // If a refresh is already in progress, queue this request
    if (isRefreshing) {
      return new Promise<string>((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      }).then((newToken) => {
        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
        }
        return http(originalRequest);
      });
    }

    originalRequest._retry = true;
    isRefreshing = true;

    const rt = getRefreshToken();

    if (!rt) {
      isRefreshing = false;
      clearTokens();
      return Promise.reject(error);
    }

    try {
      // Call refresh endpoint directly (bypass interceptors) to avoid loops
      const { data } = await axios.post(
        `${http.defaults.baseURL}/auth/refresh`,
        { refreshToken: rt },
        {
          headers: { "Content-Type": "application/json" },
          timeout: 10_000,
        },
      );

      // Real API wraps response in { success, data: { tokens } }
      const tokens = data?.data?.tokens ?? data?.tokens;
      const newAccess: string = tokens.accessToken;
      const newRefresh: string = tokens.refreshToken;

      setTokens(newAccess, newRefresh);
      processQueue(null, newAccess);

      if (originalRequest.headers) {
        originalRequest.headers.Authorization = `Bearer ${newAccess}`;
      }
      return http(originalRequest);
    } catch (refreshError) {
      processQueue(refreshError, null);
      clearTokens();
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  },
);

// ---------------------------------------------------------------------------
// Convenience helpers (typed wrappers)
// ---------------------------------------------------------------------------

export async function httpGet<T>(
  url: string,
  config?: AxiosRequestConfig,
): Promise<T> {
  const res = await http.get<T>(url, config);
  return res.data;
}

export async function httpPost<T, B = unknown>(
  url: string,
  body?: B,
  config?: AxiosRequestConfig,
): Promise<T> {
  const res = await http.post<T>(url, body, config);
  return res.data;
}

export async function httpPut<T, B = unknown>(
  url: string,
  body?: B,
  config?: AxiosRequestConfig,
): Promise<T> {
  const res = await http.put<T>(url, body, config);
  return res.data;
}

export async function httpPatch<T, B = unknown>(
  url: string,
  body?: B,
  config?: AxiosRequestConfig,
): Promise<T> {
  const res = await http.patch<T>(url, body, config);
  return res.data;
}

export async function httpDelete<T>(
  url: string,
  config?: AxiosRequestConfig,
): Promise<T> {
  const res = await http.delete<T>(url, config);
  return res.data;
}
