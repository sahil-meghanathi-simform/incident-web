export type Stage = 'REPORTED' | 'TRIAGE' | 'INVESTIGATION' | 'PENDING_CLOSURE' | 'CLOSED';
export const STAGE_ORDER: Stage[] = ['REPORTED', 'TRIAGE', 'INVESTIGATION', 'PENDING_CLOSURE', 'CLOSED'];

export const STAGE_LABEL: Record<Stage, string> = {
  REPORTED: 'Reported',
  TRIAGE: 'Triage',
  INVESTIGATION: 'Investigation',
  PENDING_CLOSURE: 'Pending closure',
  CLOSED: 'Closed',
};

// The stage/severity hues necessarily collide (only four palette hues for nine
// states), so a stage is shown by treatment rather than hue: a neutral chip with
// a coloured dot, and the label always spelled out — never colour alone.
export const STAGE_DOT_CLASS: Record<Stage, string> = {
  REPORTED: 'bg-stage-reported',
  TRIAGE: 'bg-stage-triage',
  INVESTIGATION: 'bg-stage-investigation',
  PENDING_CLOSURE: 'bg-stage-pending-closure',
  CLOSED: 'bg-stage-closed',
};

export const STAGE_TEXT_CLASS: Record<Stage, string> = {
  REPORTED: 'text-stage-reported',
  TRIAGE: 'text-stage-triage',
  INVESTIGATION: 'text-stage-investigation',
  PENDING_CLOSURE: 'text-stage-pending-closure',
  CLOSED: 'text-stage-closed',
};

// UI hint only — the server (policy/stage.policy.ts) is the real gate.
export const STAGE_NEXT: Record<Stage, Stage[]> = {
  REPORTED: ['TRIAGE'],
  TRIAGE: ['INVESTIGATION'],
  INVESTIGATION: ['PENDING_CLOSURE', 'TRIAGE'],
  PENDING_CLOSURE: ['CLOSED', 'INVESTIGATION'],
  CLOSED: [],
};
