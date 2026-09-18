const relativeFormatter = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });

export function formatDateTime(value: string | Date): string {
  const d = typeof value === 'string' ? new Date(value) : value;
  return new Intl.DateTimeFormat('en', { dateStyle: 'medium', timeStyle: 'short' }).format(d);
}

export function formatRelative(value: string | Date, now: Date = new Date()): string {
  const d = typeof value === 'string' ? new Date(value) : value;
  const diffMs = d.getTime() - now.getTime();
  const diffMin = Math.round(diffMs / 60_000);
  if (Math.abs(diffMin) < 60) return relativeFormatter.format(diffMin, 'minute');
  const diffHr = Math.round(diffMin / 60);
  if (Math.abs(diffHr) < 24) return relativeFormatter.format(diffHr, 'hour');
  const diffDay = Math.round(diffHr / 24);
  return relativeFormatter.format(diffDay, 'day');
}

/** For an SLA countdown: minutes remaining until `dueAt`, negative if overdue. */
export function minutesUntil(dueAt: string | Date, now: Date = new Date()): number {
  const d = typeof dueAt === 'string' ? new Date(dueAt) : dueAt;
  return Math.round((d.getTime() - now.getTime()) / 60_000);
}

/** The timeline's "grouped by day" header (build-plan.md, Module 8) — 'Today'/'Yesterday'
 * for the two nearest calendar days (local time zone), a full date otherwise. */
export function formatDayLabel(value: string | Date, now: Date = new Date()): string {
  const d = typeof value === 'string' ? new Date(value) : value;
  const startOfDay = (x: Date) => new Date(x.getFullYear(), x.getMonth(), x.getDate()).getTime();
  const diffDays = Math.round((startOfDay(d) - startOfDay(now)) / 86_400_000);
  if (diffDays === 0) return 'Today';
  if (diffDays === -1) return 'Yesterday';
  return new Intl.DateTimeFormat('en', { dateStyle: 'long' }).format(d);
}

/** Same-calendar-day grouping key (local time zone) — two events group together iff
 * this string matches, independent of how the label above is worded. */
export function dayKey(value: string | Date): string {
  const d = typeof value === 'string' ? new Date(value) : value;
  return d.toDateString();
}
