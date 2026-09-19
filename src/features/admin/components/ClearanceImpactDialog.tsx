import type { ReactElement } from 'react';
import { Link } from 'react-router-dom';
import { Dialog, DialogContent, DialogTitle } from '../../../components/ui/Dialog';
import { Button } from '../../../components/ui/Button';
import { Loader2 } from 'lucide-react';
import { useClearanceImpactPreview } from '../hooks/useClearanceImpactPreview';
import { ROUTES } from '../../../app/routes';
import { LABELS } from '../../../lib/labels';

type ClearanceImpactDialogProps = Readonly<{
  isOpen: boolean;
  userId: string;
  nextClearanceLevel: number | null;
  isSubmitting: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}>;

/**
 * build-plan.md §15.2: lists affected incidents BY REFERENCE before the clearance
 * PATCH is ever sent — the preview call is a separate, read-only round trip
 * (useClearanceImpactPreview), not a client-side guess, since the drawer has no
 * cached view of this user's assignments. [Confirm] stays disabled until the preview
 * has actually resolved, so the admin never confirms a change whose impact they
 * haven't seen yet.
 */
export function ClearanceImpactDialog({
  isOpen,
  userId,
  nextClearanceLevel,
  isSubmitting,
  onConfirm,
  onCancel,
}: ClearanceImpactDialogProps): ReactElement | null {
  const preview = useClearanceImpactPreview(userId, isOpen ? nextClearanceLevel : null);

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onCancel()}>
      <DialogContent>
        <DialogTitle>{LABELS.admin.clearanceImpactDialogTitle}</DialogTitle>
        <div className="mt-4 space-y-4">
          {preview.isPending && (
            <p className="flex items-center gap-2 text-sm text-foreground-soft">
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> {LABELS.admin.clearanceImpactLoading}
            </p>
          )}

          {preview.isError && <p role="alert" className="text-sm text-destructive">{LABELS.errors.generic}</p>}

          {preview.data && preview.data.count === 0 && (
            <p className="text-sm text-foreground-soft">{LABELS.admin.clearanceImpactNone}</p>
          )}

          {preview.data && preview.data.count > 0 && (
            <div className="space-y-2">
              <p role="alert" className="text-sm font-medium text-severity-medium">
                {LABELS.admin.clearanceImpactWarning(preview.data.count)}
              </p>
              <ul className="max-h-48 space-y-1 overflow-y-auto rounded-md border border-severity-medium-border bg-severity-medium-surface p-3 text-sm">
                {preview.data.affectedIncidents.map((incident) => (
                  <li key={incident.id}>
                    <Link to={ROUTES.incidentDetail(incident.id)} className="font-mono text-primary hover:underline">
                      {incident.reference}
                    </Link>{' '}
                    <span className="text-muted-foreground">({incident.severity})</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="button" onClick={onConfirm} isLoading={isSubmitting} disabled={!preview.data}>
              {LABELS.admin.clearanceImpactConfirm}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
