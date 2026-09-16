export const SEVERITY_RANK = { LOW: 1, MEDIUM: 2, HIGH: 3, CRITICAL: 4 } as const;
export type Severity = keyof typeof SEVERITY_RANK;
export const SEVERITY_ORDER: Severity[] = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'];

export const SEVERITY_LABEL: Record<Severity, string> = {
  LOW: 'Low',
  MEDIUM: 'Medium',
  HIGH: 'High',
  CRITICAL: 'Critical',
};

export const SEVERITY_COLOR_CLASS: Record<Severity, string> = {
  LOW: 'bg-severity-low/10 text-severity-low border-severity-low/30',
  MEDIUM: 'bg-severity-medium/10 text-severity-medium border-severity-medium/30',
  HIGH: 'bg-severity-high/10 text-severity-high border-severity-high/30',
  CRITICAL: 'bg-severity-critical/10 text-severity-critical border-severity-critical/30',
};

export function compareSeverity(a: Severity, b: Severity): number {
  return SEVERITY_RANK[a] - SEVERITY_RANK[b];
}
