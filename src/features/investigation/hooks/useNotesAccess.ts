import { isApiError } from '../../../api/ApiError';
import type { IncidentDetail } from '../../incidents/types/incident.type';
import type { NotesAccessReason } from '../types/investigation.type';

/**
 * `_actions.canReadNotes` alone can only ever mean "not assigned" when it's false —
 * reaching the incident detail page at all already proved clearance (the same gate the
 * notes endpoint re-checks). A live 'clearance' refusal is still possible: severity can
 * be raised, revoking the actor's clearance, in the gap between the incident fetch and
 * the notes fetch (Q10) — that shows up as the notes query's own error, not `_actions`,
 * so a fresh error always wins over the coarser flag.
 */
export function useNotesAccess(incident: IncidentDetail, error: unknown): NotesAccessReason {
  if (isApiError(error) && error.code === 'INSUFFICIENT_CLEARANCE') return 'clearance';
  if (isApiError(error) && error.code === 'NOT_ASSIGNED_INVESTIGATOR') return 'not-assigned';
  return incident._actions.canReadNotes ? 'granted' : 'not-assigned';
}
