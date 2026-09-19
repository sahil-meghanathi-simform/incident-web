import type { ReactElement, ReactNode } from 'react';

type PageHeaderProps = Readonly<{
  title: string;
  description?: string;
  actions?: ReactNode;
  breadcrumb?: ReactNode;
}>;

export function PageHeader({ title, description, actions, breadcrumb }: PageHeaderProps): ReactElement {
  return (
    <div className="mb-6">
      {breadcrumb && <div className="mb-2">{breadcrumb}</div>}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-xl font-semibold tracking-display text-foreground">{title}</h1>
          {description && <p className="mt-1 text-sm text-muted-foreground">{description}</p>}
        </div>
        {actions && <div className="flex shrink-0 gap-2">{actions}</div>}
      </div>
    </div>
  );
}
