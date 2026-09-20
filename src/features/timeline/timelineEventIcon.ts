import {
  ArrowRightLeft,
  BellRing,
  CheckCheck,
  CircleCheck,
  FilePlus,
  FileText,
  Gauge,
  ShieldX,
  Undo2,
  UserMinus,
  UserPlus,
  type LucideIcon,
} from 'lucide-react';
import type { TimelineEvent } from './types/timeline.type';

type TimelineEventType = TimelineEvent['type'];

type EventVisual = Readonly<{ icon: LucideIcon; toneClass: string }>;

/** One icon + tint per event type for the timeline rail. The sentence beside the
 * dot always says what happened, so the tint is never the only signal. */
export const TIMELINE_EVENT_VISUAL: Readonly<Record<TimelineEventType, EventVisual>> = {
  INCIDENT_CREATED: { icon: FilePlus, toneClass: 'bg-accent text-accent-foreground ring-primary/20' },
  STAGE_CHANGED: { icon: ArrowRightLeft, toneClass: 'bg-info-surface text-info ring-info-border' },
  SEVERITY_CHANGED: { icon: Gauge, toneClass: 'bg-warning-surface text-warning ring-warning-border' },
  INVESTIGATOR_ASSIGNED: { icon: UserPlus, toneClass: 'bg-accent text-accent-foreground ring-primary/20' },
  INVESTIGATOR_UNASSIGNED: { icon: UserMinus, toneClass: 'bg-muted text-muted-foreground ring-border' },
  INCIDENT_ACKNOWLEDGED: { icon: CheckCheck, toneClass: 'bg-success-surface text-success ring-success-border' },
  NOTE_ADDED: { icon: FileText, toneClass: 'bg-muted text-foreground-soft ring-border' },
  CLOSURE_PROPOSED: { icon: CircleCheck, toneClass: 'bg-info-surface text-info ring-info-border' },
  CLOSURE_APPROVED: { icon: CircleCheck, toneClass: 'bg-success-surface text-success ring-success-border' },
  CLOSURE_REJECTED: { icon: Undo2, toneClass: 'bg-warning-surface text-warning ring-warning-border' },
  INCIDENT_ESCALATED: { icon: BellRing, toneClass: 'bg-escalation-l2-surface text-escalation-l2 ring-escalation-l2/40' },
  ACCESS_DENIED: { icon: ShieldX, toneClass: 'bg-destructive/10 text-destructive ring-destructive/30' },
};
