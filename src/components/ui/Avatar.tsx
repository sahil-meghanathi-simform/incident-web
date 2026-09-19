// rules-ok: naming — component files in this repo are PascalCase by convention;
// a repo-wide rename is out of scope for this redesign.
import type { ReactElement } from 'react';
import { cn } from '../../lib/cn';

type AvatarProps = Readonly<{
  name: string;
  className?: string;
}>;

/** Hand-rolled initials, not @radix-ui/react-avatar — the app has no avatar
 * images anywhere, only `displayName`, so there's no image-load-fallback case
 * to justify the dependency. */
export function Avatar({ name, className }: AvatarProps): ReactElement {
  const initials = name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('');

  return (
    <span
      aria-hidden="true"
      className={cn(
        'inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent text-xs font-medium text-accent-foreground',
        className,
      )}
    >
      {initials}
    </span>
  );
}
