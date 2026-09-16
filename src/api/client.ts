import { env } from '../lib/env';
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

interface RequestOptions {
  method?: string;
  body?: unknown;
  query?: Record<string, string | number | boolean | undefined>;
  ifMatchVersion?: number;
  signal?: AbortSignal;
}

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

async function rawRequest<T>(path: string, opts: RequestOptions): Promise<T> {
  const headers: Record<string, string> = { Accept: 'application/json' };
  if (opts.body !== undefined) headers['Content-Type'] = 'application/json';
  if (accessToken) headers.Authorization = `Bearer ${accessToken}`;
  if (opts.ifMatchVersion !== undefined) headers['If-Match'] = String(opts.ifMatchVersion);

  const res = await fetch(buildUrl(path, opts.query), {
    method: opts.method ?? 'GET',
    headers,
    credentials: 'include',
    body: opts.body !== undefined ? JSON.stringify(opts.body) : undefined,
    signal: opts.signal,
  });

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

  return (await res.json()) as T;
}

/**
 * Every method returns parsed data or throws ApiError. On a 401 with code
 * TOKEN_EXPIRED, a single shared refresh runs and the original request replays once;
 * on failure, auth state is cleared via onAuthLost (AuthProvider redirects to
 * /login?next=...). Never retries 401 UNAUTHENTICATED (no token at all) or any other
 * 401 variant, and never retries a request that has already been replayed once.
 */
export async function apiRequest<T>(path: string, opts: RequestOptions = {}, _isRetry = false): Promise<T> {
  try {
    return await rawRequest<T>(path, opts);
  } catch (err) {
    if (err instanceof ApiError && err.code === 'TOKEN_EXPIRED' && !_isRetry) {
      const newToken = await refreshAccessToken();
      if (newToken) {
        setAccessToken(newToken);
        return apiRequest<T>(path, opts, true);
      }
      setAccessToken(null);
      onAuthLost?.();
    }
    throw err;
  }
}

export const api = {
  get: <T>(path: string, query?: RequestOptions['query'], signal?: AbortSignal) =>
    apiRequest<T>(path, { method: 'GET', query, signal }),
  post: <T>(path: string, body?: unknown, opts: Pick<RequestOptions, 'ifMatchVersion'> = {}) =>
    apiRequest<T>(path, { method: 'POST', body, ...opts }),
  patch: <T>(path: string, body?: unknown, opts: Pick<RequestOptions, 'ifMatchVersion'> = {}) =>
    apiRequest<T>(path, { method: 'PATCH', body, ...opts }),
  delete: <T>(path: string, opts: Pick<RequestOptions, 'ifMatchVersion'> = {}) =>
    apiRequest<T>(path, { method: 'DELETE', ...opts }),
};
