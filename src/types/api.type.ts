export interface OffsetEnvelope<T> {
  items: T[];
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}

export interface CursorEnvelope<T> {
  items: T[];
  nextCursor: string | null;
  hasMore: boolean;
}
