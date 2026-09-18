/**
 * Centralised key factory — prevents cache-key drift between a mutation's invalidation
 * call and a query's own key. Extended by each feature as its endpoints land.
 */
export const queryKeys = {
  session: ['session'] as const,
  incidents: {
    all: ['incidents'] as const,
    types: ['incidents', 'types'] as const,
    list: (filters: unknown) => ['incidents', 'list', filters] as const,
    detail: (id: string) => ['incident', id] as const,
    mine: (page: number) => ['incidents', 'mine', page] as const,
    summary: ['incidents', 'summary'] as const,
  },
  triage: {
    all: ['triage'] as const,
    queue: (filters: unknown) => ['triage', 'queue', filters] as const,
  },
  users: {
    assignableInvestigators: (minClearance: number) => ['users', 'assignable-investigators', minClearance] as const,
  },
  investigations: {
    mine: (filters: unknown) => ['investigations', 'mine', filters] as const,
    notes: (incidentId: string) => ['notes', incidentId] as const,
  },
  closures: {
    all: ['closures'] as const,
    pending: (filters: unknown) => ['closures', 'pending', filters] as const,
  },
  escalations: {
    feed: ['escalations'] as const,
    events: (incidentId: string) => ['escalations', incidentId] as const,
    tiers: ['escalations', 'tiers'] as const,
  },
  notifications: {
    list: ['notifications'] as const,
    unreadCount: ['notifications', 'unread-count'] as const,
  },
  timeline: (incidentId: string) => ['timeline', incidentId] as const,
  analytics: {
    overview: (period: unknown) => ['analytics', 'overview', period] as const,
    matrix: (period: unknown) => ['analytics', 'matrix', period] as const,
    trend: (period: unknown, bucket: unknown) => ['analytics', 'trend', period, bucket] as const,
    escalationPerformance: (period: unknown) => ['analytics', 'escalation-performance', period] as const,
  },
  admin: {
    usersAll: ['admin', 'users'] as const,
    users: (filters: unknown) => ['admin', 'users', filters] as const,
    clearanceImpact: (userId: string, clearanceLevel: number) => ['admin', 'clearance-impact', userId, clearanceLevel] as const,
    tiers: ['admin', 'tiers'] as const,
    jobRuns: ['admin', 'job-runs'] as const,
    audit: (filters: unknown) => ['admin', 'audit', filters] as const,
  },
};
