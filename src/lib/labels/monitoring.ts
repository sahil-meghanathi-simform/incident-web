export const ESCALATIONS = {
  feedTitle: 'Escalations',
  feedDescription: 'Unacknowledged incidents past a tier threshold, most severe and longest-overdue first.',
  loadFeedError: 'Could not load the escalation feed.',
  feedEmptyTitle: 'Nothing currently escalated',
  feedEmptyBody: 'Every unacknowledged HIGH/CRITICAL incident within your clearance is caught up. Here is what triggers an escalation:',
  tiersLoadError: 'Could not load escalation tiers.',
  acknowledgeAction: 'Acknowledge',
  acknowledgedToast: 'Acknowledged — removed from the feed.',
  historyTitle: 'Escalation history',
  historyLoadError: 'Could not load escalation history.',
  historyEmpty: 'No tiers have fired yet.',
  dueLabel: (level: number) => `Level ${level}`,
} as const;

export const NOTIFICATIONS = {
  bellLabel: 'Notifications',
  unreadBadgeLabel: (count: number) => `${count} unread notification${count === 1 ? '' : 's'}`,
  drawerTitle: 'Notifications',
  drawerEmpty: 'No notifications yet.',
  viewAll: 'View all',
  pageTitle: 'Notifications',
  pageDescription: 'Escalation notifications you were sent, most recent first.',
  loadError: 'Could not load notifications.',
  emptyTitle: 'No notifications',
  emptyBody: "You'll be notified here when an incident you can see escalates.",
  lastUpdated: (relative: string) => `Last updated ${relative}`,
  updateFailed: 'Could not refresh — showing the last known state.',
} as const;

export const TIMELINE = {
  timelineTab: 'Timeline',
  loadError: 'Could not load the timeline.',
  loadMore: 'Load more history',
  emptyTitle: 'Nothing recorded yet',
  emptyBody: 'Every stage change, severity change, and note lands here as it happens.',
  redactedNote: 'Investigation note added · restricted',
  exactTimestampLabel: (timestamp: string) => `Exactly ${timestamp}`,
} as const;
