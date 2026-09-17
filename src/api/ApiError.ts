export type ErrorDetail = Readonly<{
  path: string;
  code: string;
  message: string;
  received?: unknown;
}>;

/** Mirrors the backend's §2.7 error envelope shape (incident-api/src/contracts/errors.contract.ts). */
export class ApiError extends Error {
  readonly code: string;
  readonly status: number;
  readonly requestId: string;
  readonly details?: ErrorDetail[];
  readonly meta?: Record<string, unknown>;

  constructor(params: {
    code: string;
    status: number;
    message: string;
    requestId: string;
    details?: ErrorDetail[];
    meta?: Record<string, unknown>;
  }) {
    super(params.message);
    this.name = 'ApiError';
    this.code = params.code;
    this.status = params.status;
    this.requestId = params.requestId;
    this.details = params.details;
    this.meta = params.meta;
  }
}

export function isApiError(err: unknown): err is ApiError {
  return err instanceof ApiError;
}
