import { dayKey, formatDayLabel } from '../../../lib/datetime';
import type { NotificationItem } from '../types/notification.type';

export type NotificationDayGroup = Readonly<{
  key: string;
  label: string;
  items: readonly NotificationItem[];
}>;

/** Buckets an already newest-first list into calendar days, preserving order. */
export function groupByDay(items: readonly NotificationItem[]): readonly NotificationDayGroup[] {
  const groups: { key: string; label: string; items: NotificationItem[] }[] = [];
  for (const item of items) {
    const key = dayKey(item.createdAt);
    const last = groups.at(-1);
    if (last && last.key === key) {
      last.items.push(item);
    } else {
      groups.push({ key, label: formatDayLabel(item.createdAt), items: [item] });
    }
  }
  return groups;
}
