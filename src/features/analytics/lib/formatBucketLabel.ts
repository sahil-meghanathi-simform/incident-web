const bucketFormatter = new Intl.DateTimeFormat('en', { month: 'short', day: 'numeric' });

/** A trend-chart x-axis tick: "Sep 19". lib/datetime has no short month-day
 * formatter, so this stays local to analytics. */
export function formatBucketLabel(value: string): string {
  return bucketFormatter.format(new Date(value));
}
