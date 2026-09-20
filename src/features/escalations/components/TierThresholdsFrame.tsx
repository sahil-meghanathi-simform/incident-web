// rules-ok: naming — component files in this repo are PascalCase by convention;
// a repo-wide rename is out of scope for this redesign.
import type { ReactElement, ReactNode } from 'react';
import { Timer } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/Card';
import { LABELS } from '../../../lib/labels';

type TierThresholdsFrameProps = Readonly<{
  className?: string | undefined;
  children: ReactNode;
}>;

/** The titled card TierThresholdsPanel renders its loading and loaded states in. */
export function TierThresholdsFrame({ className, children }: TierThresholdsFrameProps): ReactElement {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-base">
          <Timer className="size-4 text-primary" aria-hidden="true" />
          {LABELS.escalations.tiersTitle}
        </CardTitle>
        <CardDescription>{LABELS.escalations.tiersDescription}</CardDescription>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}
