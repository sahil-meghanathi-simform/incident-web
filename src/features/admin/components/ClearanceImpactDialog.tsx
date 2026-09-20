// rules-ok: naming — component files in this repo are PascalCase by convention;
// a repo-wide rename is out of scope for this redesign.
import type { ReactElement } from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle, CheckCircle2, ChevronRight, RotateCw } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../../../components/ui/Dialog';
import { Alert, AlertDescription } from '../../../components/ui/Alert';
import { Button } from '../../../components/ui/Button';
import { Skeleton } from '../../../components/ui/Skeleton';
import { SeverityBadge } from '../../../components/ui/SeverityBadge';
import { useClearanceImpactPreview } from '../hooks/useClearanceImpactPreview';
import { ROUTES } from '../../../app/routes';
import { LABELS } from '../../../lib/labels';

type ClearanceImpactDialogProps = Readonly<{
  isOpen: boolean;
  userId: string;
  currentClearanceLevel: number;
  nextClearanceLevel: number | null;
  isSubmitting: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}>;

const SKELETON_ROWS = ['a', 'b', 'c'] as const;

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
  currentClearanceLevel,
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
        <DialogHeader>
          <DialogTitle>{LABELS.admin.clearanceImpactDialogTitle}</DialogTitle>
          {nextClearanceLevel !== null && (
            <DialogDescription>
              {LABELS.admin.clearanceImpactDescription(currentClearanceLevel, nextClearanceLevel)}
            </DialogDescription>
          )}
        </DialogHeader>

        <div className="mt-4 space-y-3">
          {preview.isPending && (
            <div role="status" className="space-y-2">
              <p className="text-sm text-muted-foreground">{LABELS.admin.clearanceImpactLoading}</p>
              <ul className="divide-y divide-border rounded-lg border border-border" aria-hidden="true">
                {SKELETON_ROWS.map((key) => (
                  <li key={key} className="flex items-center justify-between gap-3 px-3 py-2.5">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-5 w-16 rounded-full" />
                  </li>
                ))}
              </ul>
            </div>
          )}

          {preview.isError && (
            <Alert variant="destructive" className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <span className="flex items-start gap-2">
                <AlertTriangle className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
                <AlertDescription>{LABELS.admin.clearanceImpactError}</AlertDescription>
              </span>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => void preview.refetch()}
                isLoading={preview.isFetching}
              >
                {!preview.isFetching && <RotateCw aria-hidden="true" />}
                {LABELS.chrome.retry}
              </Button>
            </Alert>
          )}

          {preview.data && preview.data.count === 0 && (
            <Alert variant="success" role="status" className="flex gap-2">
              <CheckCircle2 aria-hidden="true" />
              <AlertDescription>{LABELS.admin.clearanceImpactNone}</AlertDescription>
            </Alert>
          )}

          {preview.data && preview.data.count > 0 && (
            <div className="space-y-2">
              <Alert variant="warning" className="flex gap-2">
                <AlertTriangle aria-hidden="true" />
                <AlertDescription>{LABELS.admin.clearanceImpactWarning(preview.data.count)}</AlertDescription>
              </Alert>
              <ul className="max-h-60 divide-y divide-border overflow-y-auto rounded-lg border border-border">
                {preview.data.affectedIncidents.map((incident) => (
                  <li key={incident.id} className="relative flex items-center justify-between gap-3 px-3 py-2.5 hover:bg-accent/60">
                    <Link
                      to={ROUTES.incidentDetail(incident.id)}
                      className="font-mono text-xs font-medium text-primary after:absolute after:inset-0 after:content-[''] hover:underline focus-visible:outline-none focus-visible:after:rounded-md focus-visible:after:ring-2 focus-visible:after:ring-ring"
                    >
                      {incident.reference}
                    </Link>
                    <span className="flex items-center gap-2">
                      <SeverityBadge severity={incident.severity} />
                      <ChevronRight className="size-4 text-muted-foreground" aria-hidden="true" />
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <DialogFooter className="mt-6">
          <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
            {LABELS.admin.cancel}
          </Button>
          <Button
            type="button"
            variant={preview.data && preview.data.count > 0 ? 'destructive' : 'default'}
            onClick={onConfirm}
            isLoading={isSubmitting}
            disabled={!preview.data}
          >
            {LABELS.admin.clearanceImpactConfirm}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
