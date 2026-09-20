import type { z } from 'zod';
import { env } from '../lib/env';
import { recordServerDate } from '../lib/serverTime';
import { ApiError, type ErrorDetail } from './ApiError';
import { refreshAccessToken } from './refresh';

// Deliberately a module-level variable, never localStorage (build-plan.md §6.2 state
// table) — an XSS payload that can run JS can always call the API with the user's own
// cookies/headers anyway, but there is no reason to also hand it a token that
// outlives the tab via persistent storage.
let accessToken: string | null = null;
let onAuthLost: (() => void) | null = null;
let lastSeenContractVersion: string | null = null;
let onContractMismatch: ((serverVersion: string, clientVersion: string) => void) | null = null;

const CLIENT_CONTRACT_VERSION = '0.1.0'; // bumped in lockstep with contracts:sync

export function setAccessToken(token: string | null): void {
  accessToken = token;
}

export function getAccessToken(): string | null {
  return accessToken;
}

/** Called once, by AuthProvider, so a failed refresh can clear session state and redirect. */
export function registerAuthLostHandler(handler: () => void): void {
  onAuthLost = handler;
}

/** §2.6 runtime backstop: a mismatched X-Contract-Version shows a non-blocking banner. */
export function registerContractMismatchHandler(handler: (serverVersion: string, clientVersion: string) => void): void {
  onContractMismatch = handler;
}

type RequestOptions = Readonly<{
  method?: string;
  body?: unknown;
  query?: Record<string, string | number | boolean | undefined>;
  ifMatchVersion?: number;
  signal?: AbortSignal;
}>;

function buildUrl(path: string, query?: RequestOptions['query']): string {
  const url = new URL(`${env.apiBaseUrl}${path}`, window.location.origin);
  if (query) {
    for (const [key, value] of Object.entries(query)) {
      if (value !== undefined) url.searchParams.set(key, String(value));
    }
  }
  return url.toString();
}

async function parseErrorBody(res: Response): Promise<ApiError> {
  let body: { error?: { code?: string; message?: string; requestId?: string; details?: ErrorDetail[]; meta?: Record<string, unknown> } } = {};
  try {
    body = await res.json();
  } catch {
    // fall through to a generic envelope below
  }
  return new ApiError({
    code: body.error?.code ?? 'INTERNAL',
    status: res.status,
    message: body.error?.message ?? `Request failed with status ${res.status}`,
    requestId: body.error?.requestId ?? 'unknown',
    details: body.error?.details,
    meta: body.error?.meta,
  });
}

async function rawRequest<T>(path: string, schema: z.ZodType<T> | null, opts: RequestOptions): Promise<T> {
  const headers: Record<string, string> = { Accept: 'application/json' };
  // FormData ships as-is — fetch sets its own Content-Type with the multipart
  // boundary, which a hand-set header would clobber (§ image upload: incidents.api.ts).
  const requestBody = opts.body;
  if (requestBody !== undefined && !(requestBody instanceof FormData)) headers['Content-Type'] = 'application/json';
  if (accessToken) headers.Authorization = `Bearer ${accessToken}`;
  if (opts.ifMatchVersion !== undefined) headers['If-Match'] = String(opts.ifMatchVersion);

  const res = await fetch(buildUrl(path, opts.query), {
    method: opts.method ?? 'GET',
    headers,
    credentials: 'include',
    body: requestBody instanceof FormData ? requestBody : requestBody !== undefined ? JSON.stringify(requestBody) : undefined,
    signal: opts.signal,
  });

  recordServerDate(res.headers.get('Date'));

  const serverContractVersion = res.headers.get('X-Contract-Version');
  if (serverContractVersion && serverContractVersion !== lastSeenContractVersion) {
    lastSeenContractVersion = serverContractVersion;
    if (serverContractVersion !== CLIENT_CONTRACT_VERSION) {
      onContractMismatch?.(serverContractVersion, CLIENT_CONTRACT_VERSION);
    }
  }

  if (res.status === 204) return undefined as T;

  if (!res.ok) {
    throw await parseErrorBody(res);
  }

  const body: unknown = await res.json();
  // A server contract is an assumption until it's validated (queries.md) — every
  // endpoint passes its response schema so a backend drift fails loudly here instead
  // of silently mistyping data for every caller downstream.
  return schema ? schema.parse(body) : (body as T);
}

/**
 * Every method returns parsed data or throws ApiError. On a 401 with code
 * TOKEN_EXPIRED, a single shared refresh runs and the original request replays once;
 * on failure, auth state is cleared via onAuthLost (AuthProvider redirects to
 * /login?next=...). Never retries 401 UNAUTHENTICATED (no token at all) or any other
 * 401 variant, and never retries a request that has already been replayed once.
 */
export async function apiRequest<T>(
  path: string,
  schema: z.ZodType<T> | null,
  opts: RequestOptions = {},
  _isRetry = false,
): Promise<T> {
  try {
    return await rawRequest<T>(path, schema, opts);
  } catch (err) {
    if (err instanceof ApiError && err.code === 'TOKEN_EXPIRED' && !_isRetry) {
      const newToken = await refreshAccessToken();
      if (newToken) {
        setAccessToken(newToken);
        return apiRequest<T>(path, schema, opts, true);
      }
      setAccessToken(null);
      onAuthLost?.();
    }
    throw err;
  }
}

export const api = {
  get: <T>(path: string, schema: z.ZodType<T> | null, query?: RequestOptions['query'], signal?: AbortSignal) =>
    apiRequest<T>(path, schema, { method: 'GET', query, signal }),
  post: <T>(path: string, schema: z.ZodType<T> | null, body?: unknown, opts: Pick<RequestOptions, 'ifMatchVersion'> = {}) =>
    apiRequest<T>(path, schema, { method: 'POST', body, ...opts }),
  patch: <T>(
    path: string,
    schema: z.ZodType<T> | null,
    body?: unknown,
    opts: Pick<RequestOptions, 'ifMatchVersion'> = {},
  ) => apiRequest<T>(path, schema, { method: 'PATCH', body, ...opts }),
  put: <T>(path: string, schema: z.ZodType<T> | null, body?: unknown, opts: Pick<RequestOptions, 'ifMatchVersion'> = {}) =>
    apiRequest<T>(path, schema, { method: 'PUT', body, ...opts }),
  delete: <T>(path: string, schema: z.ZodType<T> | null, opts: Pick<RequestOptions, 'ifMatchVersion'> = {}) =>
    apiRequest<T>(path, schema, { method: 'DELETE', ...opts }),
};
