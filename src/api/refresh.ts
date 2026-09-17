import { env } from '../lib/env';
import { RefreshResponseSchema } from './contracts/auth.contract';

let refreshPromise: Promise<string | null> | null = null;

/**
 * Single-flight refresh: concurrent 401s from several in-flight requests share one
 * POST /auth/refresh call instead of racing each other and rotating the refresh
 * token multiple times (which would trip the backend's reuse-detection and revoke
 * the whole session).
 */
export function refreshAccessToken(): Promise<string | null> {
  if (!refreshPromise) {
    refreshPromise = doRefresh().finally(() => {
      refreshPromise = null;
    });
  }
  return refreshPromise;
}

async function doRefresh(): Promise<string | null> {
  try {
    const res = await fetch(`${env.apiBaseUrl}/api/v1/auth/refresh`, {
      method: 'POST',
      credentials: 'include', // httpOnly refresh cookie — invisible to JS by design (Q8)
    });
    if (!res.ok) return null;
    const body: unknown = await res.json();
    return RefreshResponseSchema.parse(body).accessToken;
  } catch {
    return null;
  }
}
