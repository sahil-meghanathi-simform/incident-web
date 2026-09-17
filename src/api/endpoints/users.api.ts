import { z } from 'zod';
import { api } from '../client';
import { AssignableInvestigatorSchema, type AssignableInvestigator } from '../contracts/user.contract';

const AssignableInvestigatorsResponseSchema = z.array(AssignableInvestigatorSchema);

export function getAssignableInvestigators(minClearance: number): Promise<AssignableInvestigator[]> {
  return api.get<AssignableInvestigator[]>(
    '/api/v1/users/assignable-investigators',
    AssignableInvestigatorsResponseSchema,
    { minClearance },
  );
}
