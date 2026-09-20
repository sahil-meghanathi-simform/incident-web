// rules-ok: naming — component files in this repo are PascalCase by convention;
// a repo-wide rename is out of scope for this redesign.
import type { ReactElement, ReactNode } from 'react';
import { cn } from '../../lib/cn';

type PageContainerProps = Readonly<{
  children: ReactNode;
  /** `narrow` for single forms, `wide` for dense dashboards and tables. */
  size?: 'narrow' | 'default' | 'wide';
  /** From md up, exactly as tall as the viewport area, laid out as a column — for a
   * page whose main panel scrolls inside itself (the report form) rather than
   * growing the page. If the content can't fit, the page still scrolls as usual. */
  isFullHeight?: boolean;
}>;

const SIZE_CLASS = { narrow: 'max-w-3xl', default: 'max-w-6xl', wide: 'max-w-7xl' } as const;

export function PageContainer({ children, size = 'default', isFullHeight = false }: PageContainerProps): ReactElement {
  return (
    <div
      className={cn(
        'mx-auto w-full px-4 pb-16 pt-6 sm:px-6 sm:pt-8 lg:px-8',
        isFullHeight && 'md:flex md:h-full md:flex-col md:pb-8',
        SIZE_CLASS[size],
      )}
    >
      {children}
    </div>
  );
}
