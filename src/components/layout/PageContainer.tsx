import type { ReactElement, ReactNode } from 'react';

type PageContainerProps = Readonly<{
  children: ReactNode;
}>;

export function PageContainer({ children }: PageContainerProps): ReactElement {
  return <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">{children}</div>;
}
