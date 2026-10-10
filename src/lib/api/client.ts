import { getAccessToken, setAccessToken, clearTokens } from "@/lib/auth/token-store";
import { ENDPOINTS } from "@/lib/api/endpoints";

/**
 * Versioned base URL. `NEXT_PUBLIC_API_URL` holds the API origin; the version
 * prefix is added here so `ENDPOINTS` stays free of it.
 */
export const API_BASE_URL = `${
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000"
}/api/v1`;

/** Shape of the `error` object in a failed response envelope. */
interface ApiErrorBody {
  code: string;
  message: string;
  details?: Record<string, unknown>;
}

/** Pagination metadata returned alongside list responses. */
export interface ApiMeta {
  page: number;
  limit: number;
  total: number;
  total_pages: number;
}

/**
 * A failed API call. `code` is the backend's stable machine code, so callers
 * can branch on the reason without matching on message text.
 */
export class ApiRequestError extends Error {
  constructor(
    public status: number,
    public code: string,
    message: string,
    public details?: Record<string, unknown>,
  ) {
    super(message);
    this.name = "ApiRequestError";
  }

  /** True when the session is gone and the admin must sign in again. */
  get isUnauthorized() {
    return this.status === 401;
  }

  /** True when the account lacks the required role or permission. */
  get isForbidden() {
    return this.status === 403;
  }

  /** True when the backend rejected the submitted data. */
  get isValidation() {
    return this.status === 422 || this.code === "VALIDATION_ERROR";
  }
}

type QueryParams = Record<string, string | number | boolean | undefined | null>;

interface RequestOptions extends Omit<RequestInit, "body"> {
  params?: QueryParams;
  body?: unknown;
  /** Skip the automatic refresh-and-retry, used by the refresh call itself. */
  skipRefresh?: boolean;
}

/**
 * In-flight refresh, shared by every caller so a burst of 401s triggers one
 * rotation rather than several — the backend revokes a refresh-token family
 * when a token is presented twice.
 */
let refreshPromise: Promise<boolean> | null = null;

/** Exchanges the refresh cookie for a new access token. */
export async function refreshSession(): Promise<boolean> {
  if (!refreshPromise) {
    refreshPromise = (async () => {
      try {
        const res = await fetch(`${API_BASE_URL}${ENDPOINTS.auth.refresh}`, {
          method: "POST",
          credentials: "include",
        });
        if (!res.ok) return false;

        const body = await res.json();
        if (body?.success && body?.data?.access_token) {
          setAccessToken(body.data.access_token);
          return true;
        }
        return false;
      } catch {
        return false;
      } finally {
        refreshPromise = null;
      }
    })();
  }
  return refreshPromise;
}

/** Builds the full URL, dropping empty query parameters. */
function buildUrl(path: string, params?: QueryParams) {
  const url = new URL(`${API_BASE_URL}${path}`);
  if (params) {
    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined && value !== null && value !== "") {
        url.searchParams.set(key, String(value));
      }
    }
  }
  return url.toString();
}

/** Serialises the request, attaching the bearer token when we hold one. */
function buildInit(options: RequestOptions): RequestInit {
  // params and skipRefresh are handled by the caller; destructuring them here
  // keeps them out of the RequestInit handed to fetch.
  const { params, body, skipRefresh, ...init } = options;
  void params;
  void skipRefresh;

  const headers = new Headers(init.headers);
  if (body !== undefined && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  const token = getAccessToken();
  if (token) headers.set("Authorization", `Bearer ${token}`);

  return {
    ...init,
    headers,
    credentials: "include",
    body: body === undefined ? undefined : JSON.stringify(body),
  };
}

/** Reads the response envelope, raising ApiRequestError on failure. */
async function parse<T>(res: Response): Promise<{ data: T; meta?: ApiMeta }> {
  // 204 responses carry no body.
  if (res.status === 204) return { data: undefined as T };

  const body = await res.json().catch(() => null);

  if (!res.ok || !body?.success) {
    const error = body?.error as ApiErrorBody | undefined;
    throw new ApiRequestError(
      res.status,
      error?.code ?? "UNKNOWN_ERROR",
      error?.message ?? body?.message ?? "Something went wrong. Please try again.",
      error?.details,
    );
  }

  return { data: body.data as T, meta: body.meta as ApiMeta | undefined };
}

/**
 * Performs the request. On a 401 it rotates the session once and retries, so
 * an expired 15-minute access token is invisible to the caller.
 */
async function request<T>(
  method: string,
  path: string,
  options: RequestOptions = {},
): Promise<{ data: T; meta?: ApiMeta }> {
  const url = buildUrl(path, options.params);

  let res = await fetch(url, { ...buildInit(options), method });

  if (res.status === 401 && !options.skipRefresh) {
    if (await refreshSession()) {
      res = await fetch(url, { ...buildInit(options), method });
    } else {
      clearTokens();
      throw new ApiRequestError(
        401,
        "UNAUTHORIZED",
        "Your session has expired. Please sign in again.",
      );
    }
  }

  return parse<T>(res);
}

export const apiClient = {
  /** GET, returning the envelope's `data`. */
  get: <T>(path: string, options?: RequestOptions) =>
    request<T>("GET", path, options).then((r) => r.data),

  /** GET for list endpoints, returning both `data` and `meta`. */
  getPage: <T>(path: string, options?: RequestOptions) =>
    request<T>("GET", path, options),

  post: <T>(path: string, body?: unknown, options?: RequestOptions) =>
    request<T>("POST", path, { ...options, body }).then((r) => r.data),

  patch: <T>(path: string, body?: unknown, options?: RequestOptions) =>
    request<T>("PATCH", path, { ...options, body }).then((r) => r.data),

  put: <T>(path: string, body?: unknown, options?: RequestOptions) =>
    request<T>("PUT", path, { ...options, body }).then((r) => r.data),

  delete: <T>(path: string, options?: RequestOptions) =>
    request<T>("DELETE", path, options).then((r) => r.data),
};
