// Typed import.meta.env access — the one place Vite's env typing lives.
export const env = {
  apiBaseUrl: (import.meta.env.VITE_API_BASE_URL as string | undefined) ?? '',
};
