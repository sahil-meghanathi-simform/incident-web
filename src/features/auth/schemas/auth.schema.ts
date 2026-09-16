// Re-exported from the vendored contract rather than redefined — the login/register
// forms validate against exactly what the backend's .strict() schemas accept, so a
// contract change surfaces here as a type error instead of a runtime 422 discovered late.
export { LoginRequestSchema as loginSchema, RegisterRequestSchema as registerSchema } from '../../../api/contracts/auth.contract';
export type { LoginRequest, RegisterRequest } from '../../../api/contracts/auth.contract';
