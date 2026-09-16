/** Every path string lives here, typed — no bare string literals in feature code. */
export const ROUTES = {
  home: '/',
  login: '/login',
  register: '/register',
  forbidden: '/403',
  notFound: '/404',

  incidents: '/incidents',
  incidentNew: '/incidents/new',
  incidentNewSubmitted: '/incidents/new/submitted',
  incidentMine: '/incidents/mine',
  incidentDetail: (id: string) => `/incidents/${id}`,

  triageQueue: '/triage/queue',
  investigations: '/investigations',
  closuresPending: '/closures/pending',
  escalations: '/escalations',
  notifications: '/notifications',
  analytics: '/analytics',

  adminUsers: '/admin/users',
  adminEscalationPolicy: '/admin/escalation-policy',
  adminJobs: '/admin/jobs',
  adminAudit: '/admin/audit',
} as const;
