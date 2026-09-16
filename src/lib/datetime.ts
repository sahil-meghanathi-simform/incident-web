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
