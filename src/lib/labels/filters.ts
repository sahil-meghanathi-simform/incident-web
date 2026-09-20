/** The incident list's filter toolbar. One label map feeds both the controls and
 * the active-filter chips, so the two can never drift apart. */
export const FILTERS = {
  searchLabel: 'Search incidents',
  searchPlaceholder: 'Search title or reference…',
  searching: 'Searching…',
  severityLabel: 'Severity',
  stageLabel: 'Stage',
  typeLabel: 'Type',
  anyType: 'Any type',
  dateRangeLabel: 'Reported between',
  quickFiltersLabel: 'Quick filters',
  hiddenSeverities: (count: number) =>
    `${count} higher ${count === 1 ? 'severity is' : 'severities are'} hidden by your clearance.`,
  toggles: {
    assignedToMe: 'Assigned to me',
    reportedByMe: 'Reported by me',
    unacknowledged: 'Unacknowledged',
    escalatedOnly: 'Escalated only',
  },
  filtersButton: 'Filters',
  openFilters: (count: number) => (count > 0 ? `Filters (${count})` : 'Filters'),
  activeCount: (count: number) =>
    count === 0 ? 'No filters applied' : `${count} filter${count === 1 ? '' : 's'} applied`,
  done: 'Done',
  sheetTitle: 'Filter incidents',
  sheetDescription: 'Changes apply straight away.',
  showResults: 'Show results',
  clearAll: 'Clear all',
  activeFiltersLabel: 'Active filters',
  chips: {
    search: (q: string) => `“${q}”`,
    dateRange: (from: string | undefined, to: string | undefined) => [from, to].filter(Boolean).join(' – '),
    remove: (label: string) => `Remove filter: ${label}`,
  },
} as const;
