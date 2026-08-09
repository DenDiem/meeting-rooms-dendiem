export interface PaginationMeta {
  readonly total: number;
  readonly page: number;
  readonly perPage: number;
}

export interface ApiEnvelope {
  readonly data: unknown;
  readonly meta?: PaginationMeta;
}

export interface ApiErrorBody {
  readonly errors?: {
    readonly message?: string;
    readonly fields?: Record<string, string>;
  };
}
