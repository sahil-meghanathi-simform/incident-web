// rules-ok: naming — component files in this repo are PascalCase by convention;
// a repo-wide rename is out of scope for this redesign.
import type { ReactElement } from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '../../lib/cn';

type SpinnerProps = Readonly<{
  size?: 'sm' | 'md' | 'lg';
  /** When set, the spinner announces itself as a status; omit for a purely
   * decorative spinner next to text that already says what's happening. */
  label?: string;
  className?: string;
}>;

const SIZE_CLASS = { sm: 'size-3.5', md: 'size-4', lg: 'size-6' } as const;

export function Spinner({ size = 'md', label, className }: SpinnerProps): ReactElement {
  const icon = (
    <Loader2
      className={cn('animate-spin text-muted-foreground motion-reduce:animate-none', SIZE_CLASS[size], className)}
      aria-hidden="true"
    />
  );
  if (!label) return icon;
  return (
    <span role="status" className="inline-flex items-center">
      {icon}
      <span className="sr-only">{label}</span>
    </span>
  );
}
