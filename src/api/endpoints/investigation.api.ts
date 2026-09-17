import { api } from '../client';
import {
  type AddNoteRequest,
  InvestigationNoteSchema,
  type InvestigationNote,
  NotesPageResponseSchema,
  type NotesPageResponse,
  MyInvestigationsResponseSchema,
  type MyInvestigationsResponse,
} from '../contracts/investigation.contract';

export function listNotes(incidentId: string, cursor: string | undefined, pageSize: number): Promise<NotesPageResponse> {
  return api.get<NotesPageResponse>(`/api/v1/incidents/${incidentId}/notes`, NotesPageResponseSchema, {
    cursor,
    pageSize,
  });
}

export function addNote(incidentId: string, body: AddNoteRequest): Promise<InvestigationNote> {
  return api.post<InvestigationNote>(`/api/v1/incidents/${incidentId}/notes`, InvestigationNoteSchema, body);
}

export function getMyInvestigations(page: number, pageSize: number): Promise<MyInvestigationsResponse> {
  return api.get<MyInvestigationsResponse>('/api/v1/investigations/mine', MyInvestigationsResponseSchema, {
    page,
    pageSize,
  });
}
