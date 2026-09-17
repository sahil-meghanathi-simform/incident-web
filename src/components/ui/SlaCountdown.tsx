import { type ReactElement, useEffect, useState } from 'react';
import { cn } from '../../lib/cn';
import { serverNow } from '../../lib/serverTime';

type SlaCountdownProps = Readonly<{
  dueAt: string;
}>;

export function formatMinutes(minutes: number): string {
  const abs = Math.abs(minutes);
  if (abs < 60) return `${abs}m`;
  const hours = Math.floor(abs / 60);
  const mins = abs % 60;
  return mins === 0 ? `${hours}h` : `${hours}h ${mins}m`;
}

/**
 * Ticks on a local 1s timer, computed against `serverNow()` (build-plan.md: "a server
 * time offset captured from the Date response header, so a skewed client clock does
 * not produce nonsense") — never a poll, and never the client's bare `Date.now()`.
 */
export function SlaCountdown({ dueAt }: SlaCountdownProps): ReactElement {
  const [now, setNow] = useState(() => serverNow());

  useEffect(() => {
    const id = setInterval(() => setNow(serverNow()), 1000);
    return () => clearInterval(id);
  }, []);

  const minutes = Math.round((new Date(dueAt).getTime() - now.getTime()) / 60_000);
  const overdue = minutes < 0;

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 text-xs font-medium tabular-nums',
        overdue ? 'text-red-600' : minutes < 15 ? 'text-amber-600' : 'text-slate-500',
      )}
    >
      {overdue ? `Overdue ${formatMinutes(minutes)}` : `Due in ${formatMinutes(minutes)}`}
    </span>
  );
}
