// rules-ok: naming — component files in this repo are PascalCase by convention;
// a repo-wide rename is out of scope for this redesign.
import type { ReactElement } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { LABELS } from '../../lib/labels';

type BreadcrumbItem = Readonly<{ to?: string; label: string }>;

type BreadcrumbProps = Readonly<{
  items: readonly BreadcrumbItem[];
}>;

/** Hand-rolled, not a Radix primitive — a breadcrumb is a plain <nav><ol> with
 * no interaction states beyond a link hover. Every item but the last is a
 * link; the last renders as plain text (the current page). */
export function Breadcrumb({ items }: BreadcrumbProps): ReactElement {
  return (
    <nav aria-label={LABELS.chrome.breadcrumbLabel}>
      <ol className="flex items-center gap-1.5 text-sm text-muted-foreground">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li key={item.label} className="flex items-center gap-1.5">
              {index > 0 && <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />}
              {item.to && !isLast ? (
                <Link to={item.to} className="hover:text-primary hover:underline">
                  {item.label}
                </Link>
              ) : (
                <span aria-current={isLast ? 'page' : undefined} className={isLast ? 'text-foreground-soft' : undefined}>
                  {item.label}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
