/** One shared id for every login/register toast, so a re-submit replaces the previous
 * toast instead of stacking a second one on top of it. */
export const AUTH_TOAST_ID = 'auth-feedback';

/** For failures the inline form alert (role="alert") already announces — the toast is
 * only the visual echo, so it stays silent to a screen reader instead of announcing
 * the same message twice. */
export const SILENT_ERROR_TOAST = {
  id: AUTH_TOAST_ID,
  ariaProps: { role: 'status', 'aria-live': 'off' },
} as const;
