import { Badge } from './Badge';

const LEVEL_CLASS: Record<number, string> = {
  1: 'bg-escalation-l1/10 text-escalation-l1 border-escalation-l1/30',
  2: 'bg-escalation-l2/10 text-escalation-l2 border-escalation-l2/30',
  3: 'bg-escalation-l3/10 text-escalation-l3 border-escalation-l3/30',
};

export function EscalationBadge({ level }: { level: number }) {
  if (level <= 0) return null;
  return <Badge className={LEVEL_CLASS[level] ?? LEVEL_CLASS[3]}>Escalated · L{level}</Badge>;
}
