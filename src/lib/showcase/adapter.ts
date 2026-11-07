/**
 * Showcase axios adapter — the single switch for the whole app.
 *
 * Installing this as `http.defaults.adapter` means axios resolves every
 * request from local fixtures and **never opens a socket**. That is a
 * structural guarantee rather than a convention: without a transport adapter
 * axios physically cannot emit a request, so no service, hook, store or
 * component needs a showcase branch.
 */

import { AxiosError, AxiosHeaders } from "axios";
import type {
  AxiosAdapter,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";

import { getDemoRole } from "./config";
import { ShowcaseHttpError, resolve, unmatched } from "./router";

/** Auth is resolved instantly so the first paint is not gated on a fake delay. */
const AUTH_PATHS = /^\/auth\//;

/** Simulated latency, so skeletons and spinners still read naturally. */
function latencyFor(path: string, method: string): number {
  if (AUTH_PATHS.test(path)) return 0;
  if (method === "get") return 140 + Math.random() * 160;
  return 220 + Math.random() * 180;
}

function sleep(ms: number): Promise<void> {
  return ms <= 0 ? Promise.resolve() : new Promise((r) => setTimeout(r, ms));
}

/** Strip the base URL and query string, leaving "/medicines/31". */
function toPath(config: InternalAxiosRequestConfig): string {
  const raw = config.url ?? "/";
  const withoutOrigin = raw.replace(/^https?:\/\/[^/]+/i, "");
  const path = withoutOrigin.split("?")[0].split("#")[0];
  return path.startsWith("/") ? path : `/${path}`;
}

/** Merge query params from the URL string and from axios `params`. */
function toQuery(config: InternalAxiosRequestConfig): Record<string, string> {
  const query: Record<string, string> = {};

  const qs = (config.url ?? "").split("?")[1];
  if (qs) {
    for (const [k, v] of new URLSearchParams(qs).entries()) query[k] = v;
  }

  const params = config.params as Record<string, unknown> | undefined;
  if (params) {
    for (const [k, v] of Object.entries(params)) {
      if (v !== undefined && v !== null && v !== "") query[k] = String(v);
    }
  }

  return query;
}

/** Parse the request body; FormData (file upload) becomes a plain object. */
function toBody(config: InternalAxiosRequestConfig): Record<string, unknown> {
  const data = config.data;
  if (data == null) return {};

  if (typeof FormData !== "undefined" && data instanceof FormData) {
    const out: Record<string, unknown> = {};
    data.forEach((value, key) => {
      out[key] = value instanceof File ? { name: value.name, size: value.size } : value;
    });
    return out;
  }

  if (typeof data === "string") {
    try {
      const parsed = JSON.parse(data);
      return typeof parsed === "object" && parsed !== null
        ? (parsed as Record<string, unknown>)
        : {};
    } catch {
      return {};
    }
  }

  return typeof data === "object" ? (data as Record<string, unknown>) : {};
}

function response<T>(
  config: InternalAxiosRequestConfig,
  status: number,
  data: T,
): AxiosResponse<T> {
  return {
    data,
    status,
    statusText: status === 200 ? "OK" : String(status),
    headers: new AxiosHeaders({ "content-type": "application/json" }),
    config,
    request: { showcase: true },
  };
}

/**
 * Resolve a request from fixtures.
 *
 * Errors are rejected as real `AxiosError`s with a `response`, so
 * `normalizeError()` in `@/lib/api/errors` produces the same `ApiError` it
 * would for a live backend and every existing catch block behaves identically.
 */
export const showcaseAdapter: AxiosAdapter = async (config) => {
  const method = (config.method ?? "get").toLowerCase();
  const path = toPath(config);

  await sleep(latencyFor(path, method));

  try {
    const { body } = resolve({
      method,
      path,
      query: toQuery(config),
      body: toBody(config),
      role: getDemoRole(),
    });
    return response(config, 200, body);
  } catch (err) {
    const status = err instanceof ShowcaseHttpError ? err.status : 500;
    const message =
      err instanceof Error ? err.message : "Showcase data error.";

    throw new AxiosError(
      message,
      status === 404 ? AxiosError.ERR_BAD_REQUEST : AxiosError.ERR_BAD_RESPONSE,
      config,
      { showcase: true },
      response(config, status, { success: false, message }),
    );
  }
};

/**
 * Endpoints the app asked for that the route table does not cover.
 * Exposed on `window` so the verification script can assert it stays empty.
 */
export function exposeShowcaseDiagnostics(): void {
  if (typeof window === "undefined") return;
  (window as unknown as Record<string, unknown>).__SHOWCASE__ = {
    unmatched,
    role: getDemoRole(),
  };
}
