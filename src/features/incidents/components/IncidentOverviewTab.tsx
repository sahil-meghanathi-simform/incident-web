// rules-ok: naming — component files in this repo are PascalCase by convention;
// a repo-wide rename is out of scope for this redesign.
import type { ReactElement } from 'react';
import {
  BellRing,
  CalendarPlus,
  CheckCheck,
  CircleCheck,
  Clock,
  FileText,
  ImageOff,
  Tag,
  UserRound,
  UserSearch,
} from 'lucide-react';
import { formatDateTime } from '../../../lib/datetime';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/Card';
import { EscalationBadge } from '../../../components/ui/EscalationBadge';
import { EscalationHistoryPanel } from '../../escalations/components/EscalationHistoryPanel';
import { MetaRow } from './MetaRow';
import { LABELS } from '../../../lib/labels';
import type { IncidentDetail } from '../types/incident.type';

type IncidentOverviewTabProps = Readonly<{
  incident: IncidentDetail;
}>;

const COPY = LABELS.incidents.detail;
const META = COPY.meta;

/** Core fields + the meta panel — everyone who passed the clearance gate sees this
 * much. On mobile the details card comes first (it answers "who/what/when" at a
 * glance); from `lg` it sits in the right-hand column. */
export function IncidentOverviewTab({ incident }: IncidentOverviewTabProps): ReactElement {
  const hasResolution = Boolean(incident.rootCause || incident.correctiveAction);
  // security.md: never build a src/href from API input without checking the scheme —
  // this is always our own backend's signed Supabase URL, but the contract only types
  // it as `string`, so the check stays here rather than trusting the shape.
  const imageUrl = incident.imageUrl?.startsWith('https://') ? incident.imageUrl : null;
  return (
    <div className="grid gap-5 animate-in fade-in duration-300 lg:grid-cols-3">
      <div className="space-y-5 lg:col-span-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">
              <FileText className="size-4 text-muted-foreground" aria-hidden="true" />
              {COPY.descriptionHeading}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="whitespace-pre-wrap break-words text-sm leading-relaxed text-foreground">{incident.description}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">
              {imageUrl ? (
                <FileText className="size-4 text-muted-foreground" aria-hidden="true" />
              ) : (
                <ImageOff className="size-4 text-muted-foreground" aria-hidden="true" />
              )}
              {imageUrl ? COPY.photoHeading : COPY.noPhotoReasonHeading}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {imageUrl ? (
              <a href={imageUrl} target="_blank" rel="noopener noreferrer">
                <img
                  src={imageUrl}
                  alt={COPY.photoAlt}
                  className="max-h-96 w-full rounded-md border border-border object-contain"
                />
              </a>
            ) : (
              <p className="whitespace-pre-wrap break-words text-sm leading-relaxed text-foreground">
                {incident.noImageReason}
              </p>
            )}
          </CardContent>
        </Card>
        {hasResolution && (
          <Card className="border-success-border">
            <CardHeader>
              <CardTitle className="text-base">
                <CircleCheck className="size-4 text-success" aria-hidden="true" />
                {COPY.resolutionHeading}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {incident.rootCause && (
                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-caps text-muted-foreground">
                    {LABELS.closure.rootCauseLabel}
                  </h4>
                  <p className="mt-1 whitespace-pre-wrap text-sm text-foreground">{incident.rootCause}</p>
                </div>
              )}
              {incident.correctiveAction && (
                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-caps text-muted-foreground">
                    {LABELS.closure.correctiveActionLabel}
                  </h4>
                  <p className="mt-1 whitespace-pre-wrap text-sm text-foreground">{incident.correctiveAction}</p>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>

      <Card className="order-first lg:order-none">
        <CardHeader>
          <CardTitle className="text-base">{COPY.detailsHeading}</CardTitle>
        </CardHeader>
        <CardContent>
          <dl className="divide-y divide-border">
            <MetaRow icon={Tag} label={META.type}>
              <span className="capitalize">{LABELS.incidents.typeName(incident.type).toLowerCase()}</span>
            </MetaRow>
            <MetaRow icon={UserRound} label={META.reportedBy}>
              {incident.reporter.displayName}
            </MetaRow>
            {incident.assignedInvestigator !== undefined && (
              <MetaRow icon={UserSearch} label={META.assignedInvestigator}>
                {incident.assignedInvestigator?.displayName ?? META.unassigned}
              </MetaRow>
            )}
            {incident.acknowledgement !== undefined && (
              <MetaRow icon={CheckCheck} label={META.acknowledged}>
                {incident.acknowledgement
                  ? META.acknowledgedValue(
                      formatDateTime(incident.acknowledgement.acknowledgedAt),
                      incident.acknowledgement.acknowledgedBy?.displayName ?? COPY.removedUser,
                    )
                  : META.notAcknowledged}
              </MetaRow>
            )}
            {incident.escalation !== undefined && (
              <MetaRow icon={BellRing} label={META.escalation}>
                {incident.escalation.currentEscalationLevel > 0 ? (
                  <div className="space-y-2">
                    <EscalationBadge level={incident.escalation.currentEscalationLevel} />
                    <EscalationHistoryPanel incidentId={incident.id} />
                  </div>
                ) : (
                  META.notEscalated
                )}
              </MetaRow>
            )}
            <MetaRow icon={CalendarPlus} label={META.created}>
              {formatDateTime(incident.createdAt)}
            </MetaRow>
            <MetaRow icon={Clock} label={META.lastUpdated}>
              {formatDateTime(incident.updatedAt)}
            </MetaRow>
          </dl>
        </CardContent>
      </Card>
    </div>
  );
}
