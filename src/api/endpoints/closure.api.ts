import { api } from '../client';
import {
  ClosureActionResponseSchema,
  type ClosureActionResponse,
  ClosuresPendingResponseSchema,
  type ClosuresPendingResponse,
  type ProposeClosureRequest,
  type RejectClosureRequest,
} from '../contracts/closure.contract';

export function proposeClosure(id: string, version: number, body: ProposeClosureRequest): Promise<ClosureActionResponse> {
  return api.post<ClosureActionResponse>(`/api/v1/incidents/${id}/closure-proposal`, ClosureActionResponseSchema, body, {
    ifMatchVersion: version,
  });
}

export function approveClosure(id: string, version: number): Promise<ClosureActionResponse> {
  return api.post<ClosureActionResponse>(`/api/v1/incidents/${id}/closure-approval`, ClosureActionResponseSchema, {}, {
    ifMatchVersion: version,
  });
}

export function rejectClosure(id: string, version: number, body: RejectClosureRequest): Promise<ClosureActionResponse> {
  return api.post<ClosureActionResponse>(`/api/v1/incidents/${id}/closure-rejection`, ClosureActionResponseSchema, body, {
    ifMatchVersion: version,
  });
}

export function getClosuresPending(page: number, pageSize: number): Promise<ClosuresPendingResponse> {
  return api.get<ClosuresPendingResponse>('/api/v1/closures/pending', ClosuresPendingResponseSchema, { page, pageSize });
}
