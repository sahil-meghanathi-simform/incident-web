export type Stage = 'REPORTED' | 'TRIAGE' | 'INVESTIGATION' | 'PENDING_CLOSURE' | 'CLOSED';
export const STAGE_ORDER: Stage[] = ['REPORTED', 'TRIAGE', 'INVESTIGATION', 'PENDING_CLOSURE', 'CLOSED'];

export const STAGE_LABEL: Record<Stage, string> = {
  REPORTED: 'Reported',
  TRIAGE: 'Triage',
  INVESTIGATION: 'Investigation',
  PENDING_CLOSURE: 'Pending closure',
  CLOSED: 'Closed',
};

export const STAGE_COLOR_CLASS: Record<Stage, string> = {
  REPORTED: 'bg-stage-reported/10 text-stage-reported border-stage-reported/30',
  TRIAGE: 'bg-stage-triage/10 text-stage-triage border-stage-triage/30',
  INVESTIGATION: 'bg-stage-investigation/10 text-stage-investigation border-stage-investigation/30',
  PENDING_CLOSURE: 'bg-stage-pending-closure/10 text-stage-pending-closure border-stage-pending-closure/30',
  CLOSED: 'bg-stage-closed/10 text-stage-closed border-stage-closed/30',
};

// UI hint only — the server (policy/stage.policy.ts) is the real gate.
export const STAGE_NEXT: Record<Stage, Stage[]> = {
  REPORTED: ['TRIAGE'],
  TRIAGE: ['INVESTIGATION'],
  INVESTIGATION: ['PENDING_CLOSURE', 'TRIAGE'],
  PENDING_CLOSURE: ['CLOSED', 'INVESTIGATION'],
  CLOSED: [],
};
