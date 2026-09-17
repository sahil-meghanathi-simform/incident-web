import { api } from '../client';
import type { CreateIncidentRequest, IncidentReceipt, IncidentTypesResponse } from '../contracts/incident.contract';

export function createIncident(body: CreateIncidentRequest): Promise<IncidentReceipt> {
  return api.post<IncidentReceipt>('/api/v1/incidents', body);
}

export function listIncidentTypes(): Promise<IncidentTypesResponse> {
  return api.get<IncidentTypesResponse>('/api/v1/incidents/types');
}
