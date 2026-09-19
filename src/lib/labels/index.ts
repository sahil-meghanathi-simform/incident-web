/**
 * All user-visible copy lives here (labels.md) — components and hooks reference
 * `LABELS.*`, never a literal string, so a copy edit can't silently break a branch
 * that happens to compare against the old text.
 *
 * Split across this folder by domain (300-line cap, architecture.md) — every
 * existing `from '.../lib/labels'` import resolves to this index unchanged.
 */
import { ERRORS } from './errors';
import { AUTH } from './auth';
import { INCIDENTS } from './incidents';
import { TRIAGE, INVESTIGATION, CLOSURE } from './workflow';
import { NAV, FEEDBACK, CHROME } from './ui';
import { ESCALATIONS, NOTIFICATIONS, TIMELINE } from './monitoring';
import { ADMIN } from './admin';
import { ANALYTICS } from './analytics';
import { DASHBOARD } from './dashboard';

export const LABELS = {
  errors: ERRORS,
  auth: AUTH,
  incidents: INCIDENTS,
  triage: TRIAGE,
  investigation: INVESTIGATION,
  closure: CLOSURE,
  nav: NAV,
  feedback: FEEDBACK,
  chrome: CHROME,
  escalations: ESCALATIONS,
  notifications: NOTIFICATIONS,
  timeline: TIMELINE,
  admin: ADMIN,
  analytics: ANALYTICS,
  dashboard: DASHBOARD,
} as const;
