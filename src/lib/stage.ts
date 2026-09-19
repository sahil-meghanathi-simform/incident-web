export type Stage = 'REPORTED' | 'TRIAGE' | 'INVESTIGATION' | 'PENDING_CLOSURE' | 'CLOSED';
export const STAGE_ORDER: Stage[] = ['REPORTED', 'TRIAGE', 'INVESTIGATION', 'PENDING_CLOSURE', 'CLOSED'];

export const STAGE_LABEL: Record<Stage, string> = {
  REPORTED: 'Reported',
  TRIAGE: 'Triage',
  INVESTIGATION: 'Investigation',
  PENDING_CLOSURE: 'Pending closure',
  CLOSED: 'Closed',
};

// Opaque tint per stage — see severity.ts for why opacity-modified colors are
// dropped. The stage/severity hues necessarily collide (only four palette hues
// for nine states) — a neutral-chip-plus-dot treatment that resolves this by
// treatment rather than hue lands with the Badge primitive's cva rebuild.
export const STAGE_COLOR_CLASS: Record<Stage, string> = {
  REPORTED: 'bg-muted text-stage-reported border-border',
  TRIAGE: 'bg-muted text-stage-triage border-border',
  INVESTIGATION: 'bg-muted text-stage-investigation border-border',
  PENDING_CLOSURE: 'bg-muted text-stage-pending-closure border-border',
  CLOSED: 'bg-muted text-stage-closed border-border',
};

// UI hint only — the server (policy/stage.policy.ts) is the real gate.
export const STAGE_NEXT: Record<Stage, Stage[]> = {
  REPORTED: ['TRIAGE'],
  TRIAGE: ['INVESTIGATION'],
  INVESTIGATION: ['PENDING_CLOSURE', 'TRIAGE'],
  PENDING_CLOSURE: ['CLOSED', 'INVESTIGATION'],
  CLOSED: [],
};
