export const NAV = {
  appTitle: 'Incident Reporting & Escalation',
  backToHome: 'Back to home',
} as const;

export const FEEDBACK = {
  forbiddenTitle: "You don't have access to this page",
  forbiddenBody: "Your role doesn't permit this action. If you think this is a mistake, contact an administrator.",
  accessRevokedTitle: 'You no longer have access to this incident',
  accessRevokedBody:
    'Its severity was raised above your clearance level. This is expected — clearance is re-checked on every request.',
  comingSoonTitle: 'Not built yet',
  comingSoonBody: 'This screen lands with its feature module.',
  unexpectedErrorTitle: 'Something went wrong',
  unexpectedErrorBody: 'The application hit an unexpected error. Reloading the page usually resolves it.',
  reload: 'Reload',
} as const;

/** Copy introduced by the shadcn/ui migration — sr-only labels, dialog chrome, nav a11y strings. */
export const CHROME = {
  dialogClose: 'Close',
  sheetClose: 'Close',
  sideNavToggle: 'Toggle navigation',
  sideNavLabel: 'Main navigation',
  breadcrumbLabel: 'Breadcrumb',
  userMenuLabel: 'Account menu',
  paginationPrevious: 'Previous page',
  paginationNext: 'Next page',
  paginationSummary: (from: number, to: number, total: number) => `Showing ${from}–${to} of ${total}`,
} as const;
