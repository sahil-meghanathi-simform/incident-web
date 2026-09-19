export const SEVERITY_RANK = { LOW: 1, MEDIUM: 2, HIGH: 3, CRITICAL: 4 } as const;
export type Severity = keyof typeof SEVERITY_RANK;
export const SEVERITY_ORDER: Severity[] = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'];

export const SEVERITY_LABEL: Record<Severity, string> = {
  LOW: 'Low',
  MEDIUM: 'Medium',
  HIGH: 'High',
  CRITICAL: 'Critical',
};

// Opaque tint/border per severity, not an opacity-modified ink color — a badge at
// `/10` composites against whatever row it sits on (striped, hovered, selected,
// sticky header), so contrast can only be guaranteed against a known opaque
// backdrop. CRITICAL is deliberately the only SOLID badge in the system: at 12px
// across a dense table its nearest hue neighbor (HIGH) would otherwise read as
// "another red" — the luminance inversion survives greyscale and red-green CVD,
// where hue alone does not.
export const SEVERITY_COLOR_CLASS: Record<Severity, string> = {
  LOW: 'bg-severity-low-surface text-severity-low border-severity-low-border',
  MEDIUM: 'bg-severity-medium-surface text-severity-medium border-severity-medium-border',
  HIGH: 'bg-severity-high-surface text-severity-high border-severity-high-border',
  CRITICAL: 'bg-severity-critical text-severity-critical-foreground border-severity-critical',
};

// Solid fill/background for chart marks (the trend chart's bars, its legend
// swatches) — the ink token itself, not the tinted badge surface. Tailwind v4
// generates `fill-*`/`bg-*` utilities from the same `--color-severity-*`
// tokens SEVERITY_COLOR_CLASS reads, so there is exactly one place these
// colors are ever defined (src/styles/index.css).
export const SEVERITY_FILL_CLASS: Record<Severity, string> = {
  LOW: 'fill-severity-low',
  MEDIUM: 'fill-severity-medium',
  HIGH: 'fill-severity-high',
  CRITICAL: 'fill-severity-critical',
};

export const SEVERITY_SWATCH_CLASS: Record<Severity, string> = {
  LOW: 'bg-severity-low',
  MEDIUM: 'bg-severity-medium',
  HIGH: 'bg-severity-high',
  CRITICAL: 'bg-severity-critical',
};

// CSS custom property names, for the one legitimate use of continuous alpha in
// this app (the analytics heatmap's per-cell shading) — no fixed set of
// Tailwind classes can express a continuous scale, so this reads the same
// tokens the classes above generate from, via `var()` at render time.
export const SEVERITY_VAR: Record<Severity, string> = {
  LOW: '--color-severity-low',
  MEDIUM: '--color-severity-medium',
  HIGH: '--color-severity-high',
  CRITICAL: '--color-severity-critical',
};

export function compareSeverity(a: Severity, b: Severity): number {
  return SEVERITY_RANK[a] - SEVERITY_RANK[b];
}
