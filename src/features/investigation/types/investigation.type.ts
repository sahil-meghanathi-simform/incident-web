export type {
  AddNoteRequest,
  InvestigationNote,
  NotesPageResponse,
  MyInvestigationsQuery,
  MyInvestigationsResponse,
} from '../../../api/contracts/investigation.contract';

export type { IncidentListItem } from '../../incidents/types/incident.type';

/** Which of the two note gates (§10.1) failed — drives NotesRestrictedNotice's copy. */
export type NotesAccessReason = 'granted' | 'clearance' | 'not-assigned';
